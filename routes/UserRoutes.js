import express from "express";

import { createEmployee, editEmployeefunc, employeedeleteFunc, getEmployees, SingleUserGetFunc } from "../controller/UserAdd.js";
// Multer configuration for storing image in memory
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
    },
  });




// Define routes
const router = express.Router();

// Define the POST route for uploading employee data with image
router.post("/employees", upload.single("profileImage"), createEmployee); // Handle image as buffer
router.get("/employees", getEmployees);
router.get('/getSingleUser/:id',SingleUserGetFunc)
router.put('/edituser/:id',upload.single('profileImage'),editEmployeefunc)

router.delete('/employeedelete/:id',employeedeleteFunc)

export default router;
