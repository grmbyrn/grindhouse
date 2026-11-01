import { CLOUDINARY_VARS } from '../utils/cloudinary.js'

// Checks the environment at startup so a misconfigured deploy fails immediately with a
// clear message, instead of failing later on the first login or payment.

const REQUIRED = ['MONGO_URI', 'JWT_SECRET', 'PAYPAL_CLIENT_ID', 'PAYPAL_APP_SECRET'] as const

// Values copied from .env.example or old tutorials that must never sign real tokens
const PLACEHOLDER_SECRETS = ['change_me', 'abc123', 'secret']
const MIN_SECRET_LENGTH = 32

const validateEnv = () => {
    const isProduction = process.env.NODE_ENV === 'production'
    const errors: string[] = []

    // Uploads need Cloudinary in production because the host's disk doesn't survive a redeploy
    const required = isProduction ? [...REQUIRED, ...CLOUDINARY_VARS] : REQUIRED
    const missing = required.filter(name => !process.env[name]?.trim())
    if(missing.length > 0){
        errors.push(`Missing required environment variables: ${missing.join(', ')}`)
    }

    const secret = process.env.JWT_SECRET
    if(secret && (secret.length < MIN_SECRET_LENGTH || PLACEHOLDER_SECRETS.includes(secret))){
        const message = `JWT_SECRET is too weak (use at least ${MIN_SECRET_LENGTH} random characters). Generate one with:\n` +
            `  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
        if(isProduction){
            errors.push(message)
        } else {
            console.warn(`Warning: ${message}`)
        }
    }

    if(errors.length > 0){
        console.error(`Invalid configuration:\n- ${errors.join('\n- ')}`)
        process.exit(1)
    }
}

export default validateEnv
