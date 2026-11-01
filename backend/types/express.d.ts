import type { UserDocument } from '../models/userModel.js'

declare global {
    namespace Express {
        interface Request {
            // Set by the protect middleware
            user?: UserDocument
        }
    }
}
