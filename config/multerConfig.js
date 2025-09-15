// multerConfig.js
import multer from 'multer';

// You don't need to define storage since you're uploading directly to Cloudinary
const upload = multer();

export default upload;
