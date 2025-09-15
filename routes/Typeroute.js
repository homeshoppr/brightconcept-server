import express from 'express';
import {GetAlltypeFunc, Typedeletefunc, TypeFunc} from '../controller/TypeController.js'


const router = express.Router();

router.post('/type',TypeFunc);
router.get('/getAlltype',GetAlltypeFunc);
router.delete('/typedelete/:id',Typedeletefunc)



export default router;