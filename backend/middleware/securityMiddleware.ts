import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

const paypalSources = ['https://*.paypal.com', 'https://*.paypalobjects.com']

// Security headers. The PayPal SDK needs its script, frames and API calls allowed,
// and its checkout popup needs window.opener, which the default opener policy blocks.
const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            scriptSrc: ["'self'", ...paypalSources],
            frameSrc: ["'self'", ...paypalSources],
            connectSrc: ["'self'", ...paypalSources],
            // Uploaded product images are served from Cloudinary
            imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com', ...paypalSources]
        }
    },
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }
})

// Slow down password guessing on login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { message: 'Too many login attempts, please try again in 15 minutes' }
})

// Stop mass account creation
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { message: 'Too many accounts created, please try again later' }
})

export { securityHeaders, loginLimiter, registerLimiter }
