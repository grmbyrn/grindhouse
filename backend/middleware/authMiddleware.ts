import jwt, { type JwtPayload } from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'
import asyncHandler from './asyncHandler.js'
import User from '../models/userModel.js'

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
    // Read the JWT from the cookie
    const token = req.cookies.jwt

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
            const user = await User.findById(decoded.userId).select('-password')

            if (!user) {
                throw new Error('Not authorised, user not found')
            }

            req.user = user
            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('Not authorised, token failed')
        }
    } else {
        res.status(401)
        throw new Error('Not authorised, no token')
    }
})

// Admin middleware
const admin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.isAdmin) {
        next()
    } else {
        res.status(401)
        throw new Error('Not authorised as admin')
    }
}

export { protect, admin }
