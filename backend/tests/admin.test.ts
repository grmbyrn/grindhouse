import request from 'supertest'
import { describe, expect, it } from 'vitest'
import app from '../app.js'
import Order from '../models/orderModel.js'
import { createProduct, createUser, shippingAddress } from './helpers.js'

describe('admin-only routes', () => {
    it.each([
        ['list users', 'get', '/api/users'],
        ['list all orders', 'get', '/api/orders'],
        ['create a product', 'post', '/api/products'],
        ['upload an image', 'post', '/api/upload'],
    ] as const)('a customer cannot %s', async (_, method, url) => {
        const { cookie } = await createUser()

        const res = await request(app)[method](url).set('Cookie', cookie)

        expect(res.status).toBe(401)
        expect(res.body.message).toBe('Not authorised as admin')
    })

    it('an admin can list users and orders', async () => {
        const { cookie } = await createUser({ isAdmin: true })

        expect((await request(app).get('/api/users').set('Cookie', cookie)).status).toBe(200)
        expect((await request(app).get('/api/orders').set('Cookie', cookie)).status).toBe(200)
    })

    it('an admin can create a product', async () => {
        const { cookie } = await createUser({ isAdmin: true })

        const res = await request(app).post('/api/products').set('Cookie', cookie)

        expect(res.status).toBe(201)
        expect(res.body.name).toBe('Sample name')
    })

    it('only an admin can mark an order delivered', async () => {
        const customer = await createUser()
        const admin = await createUser({ isAdmin: true })
        const product = await createProduct()
        const order = await Order.create({
            user: customer.user._id,
            orderItems: [
                { name: product.name, qty: 1, image: product.image, price: product.price, product: product._id },
            ],
            shippingAddress,
            paymentMethod: 'PayPal',
            itemsPrice: 10,
            taxPrice: 1.5,
            shippingPrice: 10,
            totalPrice: 21.5,
        })

        const asCustomer = await request(app).put(`/api/orders/${order._id}/deliver`).set('Cookie', customer.cookie)
        expect(asCustomer.status).toBe(401)

        const asAdmin = await request(app).put(`/api/orders/${order._id}/deliver`).set('Cookie', admin.cookie)
        expect(asAdmin.status).toBe(200)
        expect(asAdmin.body.isDelivered).toBe(true)
    })
})
