const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage engine configuration (Local Disk first)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Filter out non-image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Please upload an image file (png/jpg/jpeg)'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size 5MB
});

// Middleware to upload file to Cloudinary if configured, otherwise fall back to local serving
const uploadImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const isCloudinaryConfigured = cloudName && apiKey && apiSecret;

  if (isCloudinaryConfigured) {
    try {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'smart_waste_management',
      });

      // Remove the file from local storage since it's uploaded to Cloudinary
      fs.unlinkSync(req.file.path);

      // Attach secure Cloudinary URL
      req.file.uploadedUrl = result.secure_url;
      next();
    } catch (error) {
      console.error('Cloudinary Upload Failed, falling back to local storage:', error.message);
      req.file.uploadedUrl = `/uploads/${req.file.filename}`;
      next();
    }
  } else {
    // Cloudinary not configured, use local static path
    req.file.uploadedUrl = `/uploads/${req.file.filename}`;
    next();
  }
};

module.exports = { upload, uploadImage };
