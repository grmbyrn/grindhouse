import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express'

const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404)
    next(error)
}

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    const message = err.message

    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    })
}

export { notFound, errorHandler }
