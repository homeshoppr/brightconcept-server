import { Router } from "express";
import { 
    createProject,
    getAllProjects,
    deleteProject,
    updateProject,
    getProject,
    project,
    sellerDeleteProject,
    sellerAllProjects,
    sellerUpdateProject,
    propertiesHome,
    cities,
    searchProject,
    createService,
    getAllService,
    updateService
} from "../controller/projectController.js";
import upload from '../config/multerConfig.js';
import {authMiddleware} from "../middleware/authMiddleware.js";

const propertyRouter = Router();


propertyRouter.post('/add',upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'propertyImageOne', maxCount: 1 },
    { name: 'propertyImageTwo', maxCount: 1 },
    { name: 'propertyImageThree', maxCount: 1 },
    { name: 'propertyImageFour', maxCount: 1 },
    { name: 'descriptionImage', maxCount: 1 }
]), createProject);



propertyRouter.post(
  "/addservice",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "descriptionImageOne", maxCount: 1 },
    { name: "descriptionImageTwo", maxCount: 1 },
    { name: "portfolio1", maxCount: 1 },
    { name: "portfolio2", maxCount: 1 },
    { name: "portfolio3", maxCount: 1 },
  ]),
  createService
);

propertyRouter.get('/get/all', getAllProjects);
propertyRouter.get('/get/allservice', getAllService);
propertyRouter.delete('/delete/:projectId', deleteProject);
propertyRouter.get('/serviceget/:projectId', getProject);
propertyRouter.get('/get/:projectId', project);
propertyRouter.patch(
    '/update/:projectId',
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'propertyImageOne', maxCount: 1 },
        { name: 'propertyImageTwo', maxCount: 1 },
        { name: 'propertyImageThree', maxCount: 1 },
        { name: 'propertyImageFour', maxCount: 1 },
        { name: 'descriptionImage', maxCount: 1 }
    ]),
    updateProject
);

propertyRouter.patch(
  '/updateservice/:id',
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'descriptionImageOne', maxCount: 1 },
    { name: 'descriptionImageTwo', maxCount: 1 },
    { name: 'portfolio1', maxCount: 1 },
    { name: 'portfolio2', maxCount: 1 },
    { name: 'portfolio3', maxCount: 1 },
  ]),
  updateService
);






propertyRouter.delete('/seller/delete/:projectId', authMiddleware, sellerDeleteProject);
propertyRouter.get('/seller/all', authMiddleware, sellerAllProjects);
propertyRouter.patch(
    '/seller/update/:projectId',
    authMiddleware,
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'propertyImageOne', maxCount: 1 },
        { name: 'propertyImageTwo', maxCount: 1 },
        { name: 'propertyImageThree', maxCount: 1 },
        { name: 'propertyImageFour', maxCount: 1 },
        { name: 'descriptionImage', maxCount: 1 }
    ]),
    sellerUpdateProject
);

propertyRouter.get('/home/:category', propertiesHome);

propertyRouter.get('/all/cities', cities);

propertyRouter.get('/items/search', searchProject);


export default propertyRouter