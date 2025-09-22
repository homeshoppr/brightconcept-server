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
// router.get("/api/meta-metrics", (req, res) => {
//   const file = fs.readFileSync("public/meta_mom_sample.csv", "utf8");
//   const parsed = Papa.parse(file, { header: true, dynamicTyping: true });
//   res.json(parsed.data);
// });
router.get("/api/meta-metrics", async (req, res) => {
  try {
    const response = await fetch(`${process.env.VERCEL_URL || "http://localhost:8000"}/meta_mom_sample.csv`);
    const text = await response.text();
    const parsed = Papa.parse(text, { header: true, dynamicTyping: true });
    res.json(parsed.data);
  } catch (err) {
    console.error("Error fetching CSV:", err);
    res.status(500).json({ error: "Failed to load CSV file" });
  }
});

// department routes ending here 

export default router;