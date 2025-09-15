import express from 'express';
import { loginAdmin, registerAdmin } from '../controller/adminController.js';
// import { registerAdmin, loginAdmin } from '../controllers/adminController.js';

const router = express.Router();

// Admin Registration
router.post('/register', registerAdmin);

// Admin Login
router.post('/login', loginAdmin);

export default router;
