import mongoose from 'mongoose'
import request from 'supertest'
import app from '../app.js'
import User from '../models/userModel.js'
import Product from '../models/productModel.js'

export const PASSWORD = 'password123'

// The auth cookie is marked Secure, which supertest won't send back over plain HTTP,
// so tests pass it explicitly with .set('Cookie', cookie)
export const authCookie = (res: request.Response) => {
    const cookies = ([] as string[]).concat(res.headers['set-cookie'] ?? [])
    const jwt = cookies.find((c) => c.startsWith('jwt='))
    if (!jwt) throw new Error('No jwt cookie in response')
    return jwt.split(';')[0]
}

export const createUser = async ({
    isAdmin = false,
    email = `user${Math.random().toString(36).slice(2)}@example.com`,
} = {}) => {
    const user = await User.create({ name: isAdmin ? 'Admin' : 'Customer', email, password: PASSWORD, isAdmin })
    const res = await request(app).post('/api/users/auth').send({ email, password: PASSWORD })
    return { user, cookie: authCookie(res) }
}

export const createProduct = (overrides: { name?: string; price?: number; countInStock?: number } = {}) => {
    return Product.create({
        user: new mongoose.Types.ObjectId(),
        name: 'Test product',
        image: '/images/sample.jpg',
        brand: 'Brand',
        category: 'Category',
        description: 'Description',
        price: 10,
        countInStock: 10,
        ...overrides,
    })
}

export const shippingAddress = { address: '1 Main St', city: 'Dublin', postalCode: 'D01', country: 'Ireland' }
