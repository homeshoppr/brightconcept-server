import express from 'express';

import { userauth } from '../middleware/loginauth.js';
// import { departmentdeletefunc, d } from '../controller/Category.js';
import { Categorydeletefunc, Categoryfunc, CategoryUpdateFunc, GetCategoryfunc, GetSingleCategory } from '../controller/Category.js';

const router = express.Router();







// department routes starting here 

router.post('/category',Categoryfunc);
router.get('/getAllCategory',GetCategoryfunc)
router.get('/singleCategory/:id',GetSingleCategory)
router.post ('/CategoryUpdate/:id',CategoryUpdateFunc)
router.delete('/categorydelete/:id',Categorydeletefunc)
// department routes ending here 

export default router;