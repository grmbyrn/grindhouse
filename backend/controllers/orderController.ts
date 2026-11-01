import asyncHandler from '../middleware/asyncHandler.js'
import type { Types } from 'mongoose'
import Order from '../models/orderModel.js'
import Product from '../models/productModel.js'
import calcPrices from '../utils/calcPrices.js'
import { verifyPayPalPayment } from '../utils/paypal.js'

// @desc   Create a new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod } = req.body

    if (!Array.isArray(orderItems) || orderItems.length === 0) {
        res.status(400)
        throw new Error('No order items')
    }

    // Look prices up in the DB, never trust prices sent by the client
    const itemsFromDB = await Product.find({
        _id: { $in: orderItems.map((x: { _id: string }) => String(x._id)) },
    })

    const dbOrderItems = orderItems.map((itemFromClient: { _id: string; qty: number }) => {
        const matchingItemFromDB = itemsFromDB.find(
            (itemFromDB) => itemFromDB._id.toString() === String(itemFromClient._id),
        )

        if (!matchingItemFromDB) {
            res.status(404)
            throw new Error(`Product not found: ${itemFromClient._id}`)
        }

        const qty = Number(itemFromClient.qty)
        if (!Number.isInteger(qty) || qty < 1) {
            res.status(400)
            throw new Error('Invalid quantity')
        }

        return {
            name: matchingItemFromDB.name,
            qty,
            image: matchingItemFromDB.image,
            price: matchingItemFromDB.price,
            product: matchingItemFromDB._id,
        }
    })

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(dbOrderItems)

    const order = new Order({
        orderItems: dbOrderItems,
        user: req.user!._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    })

    const createdOrder = await order.save()

    res.status(201).json(createdOrder)
})

// @desc   Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user!._id })
    res.status(200).json(orders)
})

// @desc   Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate<{
        user: { _id: Types.ObjectId; name: string; email: string }
    }>('user', 'name email')

    // Only the customer who placed the order, or an admin, can see it.
    // Return 404 rather than 403 so order IDs can't be probed.
    if (order && (req.user!.isAdmin || order.user._id.equals(req.user!._id))) {
        res.status(200).json(order)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

// @desc   Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (!order?.user.equals(req.user!._id)) {
        res.status(404)
        throw new Error('Order not found')
    }

    if (order.isPaid) {
        res.status(400)
        throw new Error('Order is already paid')
    }

    const paypalOrderId = req.body.id
    if (typeof paypalOrderId !== 'string') {
        res.status(400)
        throw new Error('Missing payment ID')
    }

    // Check with PayPal that the payment went through
    const { verified, value, currency } = await verifyPayPalPayment(paypalOrderId)
    if (!verified) {
        res.status(400)
        throw new Error('Payment not verified')
    }

    // Check the same PayPal payment isn't being reused for another order
    const paymentAlreadyUsed = await Order.exists({ 'paymentResult.id': paypalOrderId })
    if (paymentAlreadyUsed) {
        res.status(400)
        throw new Error('Payment has already been used')
    }

    // Check the amount paid matches the order total
    if (currency !== 'USD' || value !== order.totalPrice.toFixed(2)) {
        res.status(400)
        throw new Error('Payment amount does not match order total')
    }

    order.isPaid = true
    order.paidAt = new Date()
    order.paymentResult = {
        id: paypalOrderId,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer?.email_address,
    }

    const updatedOrder = await order.save()

    res.status(200).json(updatedOrder)
})

// @desc   Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (order) {
        order.isDelivered = true
        order.deliveredAt = new Date()

        const updatedOrder = await order.save()

        res.status(200).json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

// @desc   Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (_req, res) => {
    const orders = await Order.find({}).populate('user', 'id name')
    res.status(200).json(orders)
})

export { addOrderItems, getMyOrders, getOrderById, updateOrderToPaid, updateOrderToDelivered, getOrders }
