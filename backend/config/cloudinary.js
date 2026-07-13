const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const path = require('path');

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
        // Create unique filename: uniId_timestamp_originalname
        // Trim whitespace and remove any special characters that Cloudinary doesn't allow
        const uniId = (req.body.uniId || 'unknown').trim().replace(/\s+/g, '_');
        const timestamp = Date.now();
        // Original extension (e.g. ".pdf"), lowercased, without the dot.
        const ext = path.extname(file.originalname).replace('.', '').toLowerCase();
        const baseName = file.originalname.replace(/\.[^/.]+$/, '').trim().replace(/\s+/g, '_');
        // For resource_type 'raw', Cloudinary does NOT auto-append the file
        // extension the way it does for images — so the extension must be part
        // of the public_id, otherwise the stored URL has no ".pdf" and the file
        // downloads without an extension. Bake the extension into the public_id.
        return {
            folder: 'jobfair-cvs',
            resource_type: 'raw',
            public_id: `${uniId}_${timestamp}_${baseName}${ext ? '.' + ext : ''}`,
        };
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 4 * 1024 * 1024 // 4MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept PDFs, DOC, and DOCX files
        const allowedMimes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF, DOC, and DOCX files are allowed'), false);
        }
    }
});

module.exports = { cloudinary, upload };
