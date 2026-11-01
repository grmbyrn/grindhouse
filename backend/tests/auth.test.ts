import request from 'supertest'
import { describe, expect, it } from 'vitest'
import app from '../app.js'
import { PASSWORD, authCookie, createUser } from './helpers.js'

describe('register', () => {
    it('creates the user and sets an HTTP-only auth cookie', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({ name: 'Jane', email: 'jane@example.com', password: PASSWORD })

        expect(res.status).toBe(201)
        expect(res.body).toMatchObject({ name: 'Jane', email: 'jane@example.com', isAdmin: false })
        expect(res.body).not.toHaveProperty('password')
        const cookie = ([] as string[]).concat(res.headers['set-cookie']).find((c) => c.startsWith('jwt='))
        expect(cookie).toMatch(/HttpOnly/i)
    })

    it.each([
        ['an invalid email', { name: 'Jane', email: 'not-an-email', password: PASSWORD }, /valid email/],
        ['a short password', { name: 'Jane', email: 'jane@example.com', password: 'short' }, /at least 8/],
        ['a missing name', { name: ' ', email: 'jane@example.com', password: PASSWORD }, /Name is required/],
    ])('rejects %s', async (_, body, message) => {
        const res = await request(app).post('/api/users').send(body)

        expect(res.status).toBe(400)
        expect(res.body.message).toMatch(message)
    })

    it('rejects an email that is already registered', async () => {
        await createUser({ email: 'taken@example.com' })

        const res = await request(app)
            .post('/api/users')
            .send({ name: 'Jane', email: 'taken@example.com', password: PASSWORD })

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('User already exists')
    })
})

describe('login', () => {
    it('logs in with the right password', async () => {
        await createUser({ email: 'john@example.com' })

        const res = await request(app).post('/api/users/auth').send({ email: 'john@example.com', password: PASSWORD })

        expect(res.status).toBe(200)
        expect(authCookie(res)).toMatch(/^jwt=/)
    })

    it('rejects the wrong password without saying which field was wrong', async () => {
        await createUser({ email: 'john@example.com' })

        const res = await request(app)
            .post('/api/users/auth')
            .send({ email: 'john@example.com', password: 'wrong-password' })

        expect(res.status).toBe(401)
        expect(res.body.message).toBe('Invalid email or password')
    })

    it('rejects query objects in place of strings (NoSQL injection)', async () => {
        await createUser({ email: 'john@example.com' })

        const res = await request(app)
            .post('/api/users/auth')
            .send({ email: { $gt: '' }, password: { $gt: '' } })

        expect(res.status).toBe(400)
    })
})

describe('protected routes', () => {
    it('rejects requests without a cookie', async () => {
        const res = await request(app).get('/api/users/profile')

        expect(res.status).toBe(401)
    })

    it('rejects a forged token', async () => {
        const res = await request(app).get('/api/users/profile').set('Cookie', 'jwt=not.a.real.token')

        expect(res.status).toBe(401)
    })

    it('returns the profile for a logged-in user', async () => {
        const { cookie } = await createUser({ email: 'john@example.com' })

        const res = await request(app).get('/api/users/profile').set('Cookie', cookie)

        expect(res.status).toBe(200)
        expect(res.body.email).toBe('john@example.com')
        expect(res.body).not.toHaveProperty('password')
    })
})
