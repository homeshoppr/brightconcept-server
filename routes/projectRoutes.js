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
import Service from "../models/serviceModel.js";

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

propertyRouter.get("/get/service/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    // Convert slug to title (replace - with space)
    const title = slug.replace(/-/g, " ");

    // Find service with this title (case-insensitive)
    const service = await Service.findOne({
      title: { $regex: new RegExp(`^${title}$`, "i") }
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({ message: "Server error" });
  }
});




export default propertyRouter