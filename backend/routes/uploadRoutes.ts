import path from 'path'
import express from 'express'
import multer, { type FileFilterCallback } from 'multer'
import type { Request } from 'express'
import { protect, admin } from '../middleware/authMiddleware.js'
import { isCloudinaryConfigured, uploadImage } from '../utils/cloudinary.js'
const router = express.Router()

// Cloudinary uploads straight from memory; the local fallback writes to ./uploads
const diskStorage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'uploads/')
    },
    filename(req, file, cb){
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

function fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    const filetypes = /jpe?g|png|webp/;
    const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = mimetypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Images only!'));
    }
  }

const limits = { fileSize: 2 * 1024 * 1024 } // 2MB
const uploadToMemory = multer({ storage: multer.memoryStorage(), fileFilter, limits }).single('image')
const uploadToDisk = multer({ storage: diskStorage, fileFilter, limits }).single('image')

router.post('/', protect, admin, (req, res) => {
    // Checked per request: imports run before server.ts loads .env, so a check at
    // module load would never see the Cloudinary vars locally
    const useCloudinary = isCloudinaryConfigured()
    const uploadSingleImage = useCloudinary ? uploadToMemory : uploadToDisk

    uploadSingleImage(req, res, async function (err) {
        if (err) {
        return res.status(400).send({ message: err.message });
        }

        if (!req.file) {
        return res.status(400).send({ message: 'No image file provided' });
        }

        let image = `/${req.file.path}`
        if (useCloudinary) {
            try {
                image = await uploadImage(req.file.buffer)
            } catch (error) {
                console.error('Cloudinary upload failed:', error)
                return res.status(502).send({ message: 'Image upload failed, please try again' });
            }
        }

        res.status(200).send({
        message: 'Image uploaded successfully',
        image,
        });
    });
});

export default router
