import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary'

// Hosts like Render wipe their disk on every deploy, so uploaded images are stored on
// Cloudinary instead. In development, without these vars, uploads fall back to ./uploads.
export const CLOUDINARY_VARS = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'] as const

export const isCloudinaryConfigured = () => CLOUDINARY_VARS.every((name) => process.env[name]?.trim())

// Uploads an image from memory and returns its HTTPS URL
export const uploadImage = (buffer: Buffer): Promise<string> => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
    })

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'grind-house',
                resource_type: 'image',
                // Nothing in the shop shows images larger than this
                transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
            },
            (error, result?: UploadApiResponse) => {
                if (error || !result) return reject(error ?? new Error('Image upload failed'))
                resolve(result.secure_url)
            },
        )
        stream.end(buffer)
    })
}
