// import express from 'express';

// import { userauth } from '../middleware/loginauth.js';
// // import { departmentdeletefunc, d } from '../controller/Category.js';
// import { Categorydeletefunc, Categoryfunc, CategoryUpdateFunc, GetCategoryfunc, GetSingleCategory } from '../controller/Category.js';

// const router = express.Router();







// // department routes starting here 

// router.post('/category',Categoryfunc);
// router.get('/getAllCategory',GetCategoryfunc)
// router.get('/singleCategory/:id',GetSingleCategory)
// router.post ('/CategoryUpdate/:id',CategoryUpdateFunc)
// router.delete('/categorydelete/:id',Categorydeletefunc)
// // department routes ending here 

// export default router;






import express from 'express';
import path from "path";
import fs from "fs";
import Papa from "papaparse";



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
router.get("/api/meta-metrics", (req, res) => {
  const filePath = path.join(process.cwd(), "public", "meta_mom_sample.csv");
  const file = fs.readFileSync(filePath, "utf8");
  const parsed = Papa.parse(file, { header: true, dynamicTyping: true });
  res.json(parsed.data);
});

// department routes ending here 

export default router;