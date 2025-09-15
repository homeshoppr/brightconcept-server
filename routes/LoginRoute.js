import express from 'express';
import { AttendenceRecordFunc, loginEmployee, logoutEmployee } from '../controller/LoginController.js';
import { userauth } from '../middleware/loginauth.js';

const router = express();


router.post('/userLogin',loginEmployee)
router.get('/checkLogin',userauth)
router.post('/Logout',logoutEmployee)
router.get('/AttenceRecord',AttendenceRecordFunc)




export default router;