import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import app from '../app.js'
import { verifyPayPalPayment } from '../utils/paypal.js'
import { createProduct, createUser, shippingAddress } from './helpers.js'

// No real PayPal calls in tests; each test says what PayPal "reports"
vi.mock('../utils/paypal.js', () => ({ verifyPayPalPayment: vi.fn() }))
const mockPayPal = vi.mocked(verifyPayPalPayment)

const placeOrder = (cookie: string, orderItems: object[]) =>
    request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ orderItems, shippingAddress, paymentMethod: 'PayPal' })

describe('creating an order', () => {
    it('calculates prices from the database, ignoring prices sent by the client', async () => {
        const { cookie } = await createUser()
        const product = await createProduct({ price: 50 })

        const res = await request(app)
            .post('/api/orders')
            .set('Cookie', cookie)
            .send({
                orderItems: [{ _id: product._id, qty: 3, price: 0.01 }],
                shippingAddress,
                paymentMethod: 'PayPal',
                itemsPrice: 0.01,
                taxPrice: 0,
                shippingPrice: 0,
                totalPrice: 0.01,
            })

        expect(res.status).toBe(201)
        // 3 × $50 = $150: free shipping over $100, 15% tax
        expect(res.body).toMatchObject({ itemsPrice: 150, shippingPrice: 0, taxPrice: 22.5, totalPrice: 172.5 })
        expect(res.body.orderItems[0]).toMatchObject({ price: 50, qty: 3 })
    })

    it('charges $10 shipping on orders of $100 or less', async () => {
        const { cookie } = await createUser()
        const product = await createProduct({ price: 20 })

        const res = await placeOrder(cookie, [{ _id: product._id, qty: 1 }])

        expect(res.body).toMatchObject({ itemsPrice: 20, shippingPrice: 10, taxPrice: 3, totalPrice: 33 })
    })

    it.each([
        ['no items', [], 400],
        ['a zero quantity', 'qty0', 400],
        ['a product that does not exist', 'missing', 404],
    ] as const)('rejects %s', async (_, items, status) => {
        const { cookie } = await createUser()
        const product = await createProduct()
        const orderItems =
            items === 'qty0'
                ? [{ _id: product._id, qty: 0 }]
                : items === 'missing'
                  ? [{ _id: '64b000000000000000000000', qty: 1 }]
                  : items

        const res = await placeOrder(cookie, [...orderItems])

        expect(res.status).toBe(status)
    })

    it('requires the customer to be logged in', async () => {
        const res = await request(app).post('/api/orders').send({ orderItems: [] })

        expect(res.status).toBe(401)
    })
})

describe('viewing an order', () => {
    it('is allowed for the customer who placed it and for admins, and hidden from everyone else', async () => {
        const owner = await createUser()
        const stranger = await createUser()
        const admin = await createUser({ isAdmin: true })
        const product = await createProduct()
        const { body: order } = await placeOrder(owner.cookie, [{ _id: product._id, qty: 1 }])

        expect((await request(app).get(`/api/orders/${order._id}`).set('Cookie', owner.cookie)).status).toBe(200)
        expect((await request(app).get(`/api/orders/${order._id}`).set('Cookie', admin.cookie)).status).toBe(200)
        // 404, not 403, so order IDs can't be probed
        expect((await request(app).get(`/api/orders/${order._id}`).set('Cookie', stranger.cookie)).status).toBe(404)
    })
})

describe('paying for an order', () => {
    // $20 item: total $33 (see the shipping test above)
    let owner: Awaited<ReturnType<typeof createUser>>
    let orderId: string

    beforeEach(async () => {
        mockPayPal.mockReset()
        owner = await createUser()
        const product = await createProduct({ price: 20 })
        orderId = (await placeOrder(owner.cookie, [{ _id: product._id, qty: 1 }])).body._id
    })

    const pay = (cookie: string, id = orderId, paypalId = 'PAYPAL-1') =>
        request(app).put(`/api/orders/${id}/pay`).set('Cookie', cookie).send({ id: paypalId, status: 'COMPLETED' })

    it('marks the order paid when PayPal confirms the full amount', async () => {
        mockPayPal.mockResolvedValue({ verified: true, value: '33.00', currency: 'USD' })

        const res = await pay(owner.cookie)

        expect(res.status).toBe(200)
        expect(res.body.isPaid).toBe(true)
        expect(mockPayPal).toHaveBeenCalledWith('PAYPAL-1')
    })

    it('rejects a payment PayPal has not completed', async () => {
        mockPayPal.mockResolvedValue({ verified: false, value: '', currency: '' })

        const res = await pay(owner.cookie)

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Payment not verified')
    })

    it('rejects a payment for less than the order total', async () => {
        mockPayPal.mockResolvedValue({ verified: true, value: '1.00', currency: 'USD' })

        const res = await pay(owner.cookie)

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Payment amount does not match order total')
    })

    it('rejects reusing one PayPal payment for a second order', async () => {
        mockPayPal.mockResolvedValue({ verified: true, value: '33.00', currency: 'USD' })
        await pay(owner.cookie)
        const product = await createProduct({ price: 20 })
        const secondOrderId = (await placeOrder(owner.cookie, [{ _id: product._id, qty: 1 }])).body._id

        const res = await pay(owner.cookie, secondOrderId)

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Payment has already been used')
    })

    it("does not let another customer pay for someone else's order", async () => {
        const stranger = await createUser()

        const res = await pay(stranger.cookie)

        expect(res.status).toBe(404)
        expect(mockPayPal).not.toHaveBeenCalled()
    })
})
