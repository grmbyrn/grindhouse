import path from 'node:path'
import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import { securityHeaders } from './middleware/securityMiddleware.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
// Builds the Express app. server.ts starts it; tests import it directly.
const app = express()

// Render (and most hosts) sit behind one proxy; needed so rate limiting sees the real client IP
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1)
}

// Security headers
app.use(securityHeaders)

// Health check for the host's uptime monitoring; 503 while the database is unreachable
app.get('/api/health', (_req, res) => {
    const dbConnected = mongoose.connection.readyState === 1
    res.status(dbConnected ? 200 : 503).json({
        status: dbConnected ? 'ok' : 'unavailable',
        db: dbConnected ? 'connected' : 'disconnected',
    })
})

// Body parser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Cookie parser middleware
app.use(cookieParser())

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/api/config/paypal', (_req, res) => res.send({ clientId: process.env.PAYPAL_CLIENT_ID }))

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
    // set static folder
    app.use(express.static(path.join(__dirname, '/frontend/build')))

    // any route that is not api will be redirected to index.html
    app.get('/{*splat}', (_req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')))
} else {
    app.get('/', (_req, res) => {
        res.send('API is running...')
    })
}

app.use(notFound)
app.use(errorHandler)

export default app
