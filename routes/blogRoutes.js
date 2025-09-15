import express from 'express';
import multer from 'multer';
import path from 'path';
import { createBlog, deleteBlog, editBlog, getAllBlogs, getBlogById } from '../controller/blogController.js';
import upload from '../config/multerConfig.js';

const router = express.Router();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });

// Route for adding a new blog

router.post('/blogsadd', upload.single('image'), createBlog);


router.get('/getblogs', getAllBlogs);
router.get('/getsingleblog/:id', getBlogById); 
router.put('/editblog/:id', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'descriptionImage', maxCount: 1 },
]), editBlog);
router.delete('/deleteblog/:id', deleteBlog);

export default router;
