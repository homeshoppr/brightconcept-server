import Project from "../models/projectSchema.js";
import cloudinary from '../config/cloudinaryConfig.js';
import Service from "../models/serviceModel.js";

// Function to upload an image to Cloudinary
const uploadImageToCloudinary = async (file) => {
  try {
    if (!file || !file.buffer) {
      throw new Error('File buffer is missing');
    }

    // Use Cloudinary's `upload_stream` method for direct buffer uploads
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'projects' }, // Set the folder in Cloudinary
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result.secure_url); // Return the secure URL
          }
        }
      );

      // Stream the file buffer to Cloudinary
      upload.end(file.buffer);
    });
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Error uploading image');
  }
};


// Function to delete image from Cloudinary
const deleteImageFromCloudinary = async (imageUrl) => {
  try {
    // Extract the public ID from the Cloudinary URL
    const imageId = imageUrl.split('/').slice(-2).join('/').split('.')[0];  // Extract image ID

    // Delete the image from Cloudinary using the imageId
    await cloudinary.uploader.destroy(imageId);

  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw new Error('Error deleting image');
  }
};

const createProject = async (req, res) => {
  try {
    const { sellerName, city, category, type, status, price, projectName, description, role, userId, size  } = req.body;
    
    if (category === 'New Project' && role !== 'admin') {
      return res.status(400).json({ message: 'Only admin can create a new project' });
    }
    
    if (!req.files || !req.files.thumbnail || req.files.thumbnail.length === 0) {
      return res.status(400).json({ message: 'Thumbnail image is required' });
    }
    const thumbnailUrl = await uploadImageToCloudinary(req.files.thumbnail[0]);

    const project = await Project.create({
      sellerName,
      userRole: role,
      city,
      category,
      type,
      status,
      price,
      projectName,
      thumbnail: thumbnailUrl,
      description,
      size,
    });

    if (req.files.descriptionImage && req.files.descriptionImage.length > 0) {
      const descriptionImageUrl = await uploadImageToCloudinary(req.files.descriptionImage[0]);
      project.descriptionImage = descriptionImageUrl;
    }
    if (req.files.propertyImageOne && req.files.propertyImageOne.length > 0) {
      const propertyImageOne = await uploadImageToCloudinary(req.files.propertyImageOne[0]);
      project.propertyImageOne = propertyImageOne;
    }
    
    if (req.files.propertyImageTwo && req.files.propertyImageTwo.length > 0) {
      const propertyImageTwo = await uploadImageToCloudinary(req.files.propertyImageTwo[0]);
      project.propertyImageTwo = propertyImageTwo;
    }
    
    if (req.files.propertyImageThree && req.files.propertyImageThree.length > 0) {
      const propertyImageThree = await uploadImageToCloudinary(req.files.propertyImageThree[0]);
      project.propertyImageThree = propertyImageThree;
    }
    
    if (req.files.propertyImageFour && req.files.propertyImageFour.length > 0) {
      const propertyImageFour = await uploadImageToCloudinary(req.files.propertyImageFour[0]);
      project.propertyImageFour = propertyImageFour;
    }

    if (userId) {
      project.user = userId;
    }
    await project.save({ new: true });
    return res.status(201).json({ message: 'Project uploaded successfully', project});
  } catch (error) {
    console.error('Error uploading Property:', error);
    return res.status(500).json({ message: 'Error uploading Project', error: error.message });
  }
}
export const createService = async (req, res) => {
  try {
    const {
      serviceName,
      shortDescription,
      longDescription,
      seoTitle,
      seoDescription,
      seoKeywords,
      role
    } = req.body;

    if (!serviceName || !shortDescription || !longDescription) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    if (!req.files || !req.files.thumbnail || req.files.thumbnail.length === 0) {
      return res.status(400).json({ message: "Thumbnail is required" });
    }

    const thumbnailUrl = await uploadImageToCloudinary(req.files.thumbnail[0]);

    const service = new Service({
      serviceName,
      shortDescription,
      longDescription,
      thumbnail: thumbnailUrl,
      seoTitle,
      seoDescription,
      seoKeywords,
      role: role || "admin",
    });

    if (req.files.descriptionImageOne?.length > 0) {
      service.descriptionImageOne = await uploadImageToCloudinary(req.files.descriptionImageOne[0]);
    }

    if (req.files.descriptionImageTwo?.length > 0) {
      service.descriptionImageTwo = await uploadImageToCloudinary(req.files.descriptionImageTwo[0]);
    }

    if (req.files.portfolio1?.length > 0) {
      service.portfolio1 = await uploadImageToCloudinary(req.files.portfolio1[0]);
    }

    if (req.files.portfolio2?.length > 0) {
      service.portfolio2 = await uploadImageToCloudinary(req.files.portfolio2[0]);
    }

    if (req.files.portfolio3?.length > 0) {
      service.portfolio3 = await uploadImageToCloudinary(req.files.portfolio3[0]);
    }

    await service.save();

    return res.status(201).json({ message: "Service uploaded successfully", service });
  } catch (error) {
    console.error("Error uploading service:", error);
    return res.status(500).json({ message: "Error uploading service", error: error.message });
  }
};

const getAllService = async (req, res) => {
  try {
    const projects = await Service.find().sort({ createdAt: -1 });
    return res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
}
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
}

// const deleteProject = async (req, res) => {
//   try {
//     const { projectId } = req.params;
//     const project = await Project.findById(projectId);
//     if (!project) {
//       return res.status(404).json({ message: 'Project not found' });
//     }
//     if (project.thumbnail) {
//       await deleteImageFromCloudinary(project.thumbnail);
//     }
//     if (project.descriptionImage) {
//       await deleteImageFromCloudinary(project.descriptionImage);
//     }
//     if (project.propertyImageOne) {
//       await deleteImageFromCloudinary(project.propertyImageOne);
//     }
//     if (project.propertyImageTwo) {
//       await deleteImageFromCloudinary(project.propertyImageTwo);
//     }
//     if (project.propertyImageThree) {
//       await deleteImageFromCloudinary(project.propertyImageThree);
//     }
//     if (project.propertyImageFour) {
//       await deleteImageFromCloudinary(project.propertyImageFour);
//     }

//     await Project.findByIdAndDelete(projectId);
//     return res.status(200).json({ message: 'Project deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting project:', error);
//     return res.status(500).json({ message: 'Error deleting project', error: error.message });
//   }
// }
const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const service = await Service.findById(projectId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Delete all images if they exist
    if (service.thumbnail) {
      await deleteImageFromCloudinary(service.thumbnail);
    }
    if (service.descriptionImageOne) {
      await deleteImageFromCloudinary(service.descriptionImageOne);
    }
    if (service.descriptionImageTwo) {
      await deleteImageFromCloudinary(service.descriptionImageTwo);
    }
    if (service.portfolio1) {
      await deleteImageFromCloudinary(service.portfolio1);
    }
    if (service.portfolio2) {
      await deleteImageFromCloudinary(service.portfolio2);
    }
    if (service.portfolio3) {
      await deleteImageFromCloudinary(service.portfolio3);
    }

    // Finally delete the service
    await Service.findByIdAndDelete(projectId);

    return res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
};

const getProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Service.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    return res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
}

const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { sellerName, city, category, type, status, price, projectName, description, size } = req.body;
    const value = {sellerName, city, category, type, status, price, projectName, description, size}
    const project = await Project.findById(projectId);

    const fieldsToUpdate = [
      "sellerName",
      "city",
      "category",
      "type",
      "status",
      "price",
      "projectName",
      "description",
      "size"
    ]

    let hasUpdates = false;

    fieldsToUpdate.forEach((field) => {
      if (value[field] !== undefined && value[field] !== project[field]) {
        project[field] = value[field];
        hasUpdates = true;
      }
    });

    
    if (req.files.thumbnail){
      const thumbnail = await uploadImageToCloudinary(req.files.thumbnail[0])
      if (thumbnail){
        deleteImageFromCloudinary(project.thumbnail)
        project.thumbnail = thumbnail
        hasUpdates = true
      }
    }
    if (req.files.descriptionImage){
      const descriptionImageUrl = await uploadImageToCloudinary(req.files.descriptionImage[0])
      if (descriptionImageUrl){
        deleteImageFromCloudinary(project.descriptionImage)
        project.descriptionImage = descriptionImageUrl
        hasUpdates = true
      }
    }
    
    if (req.files.propertyImageOne){
      const propertyImageOne = await uploadImageToCloudinary(req.files.propertyImageOne[0])
      if (propertyImageOne){
        deleteImageFromCloudinary(project.propertyImageOne)
        project.propertyImageOne = propertyImageOne
        hasUpdates = true
      }
    }
    if (req.files.propertyImageTwo){
        const propertyImageTwo = await uploadImageToCloudinary(req.files.propertyImageTwo[0])
        if (propertyImageTwo){
          deleteImageFromCloudinary(project.propertyImageTwo)
          project.propertyImageTwo = propertyImageTwo
          hasUpdates = true
        }
      }
      if (req.files.propertyImageThree){
        const propertyImageThree = await uploadImageToCloudinary(req.files.propertyImageThree[0])
        if (propertyImageThree){
          deleteImageFromCloudinary(project.propertyImageThree)
          project.propertyImageThree = propertyImageThree
          hasUpdates = true
        }
      }
      if (req.files.propertyImageFour){
        const propertyImageFour = await uploadImageToCloudinary(req.files.propertyImageFour[0])
        if (propertyImageFour){
          deleteImageFromCloudinary(project.propertyImageFour)
          project.propertyImageFour = propertyImageFour
          hasUpdates = true
        }
      }
    
    if (!hasUpdates) {
      return res
        .status(400)
        .json({message: "No fields to update"});
    }

    const updatedProject = await project.save({ validateBeforeSave: false });

    return res.status(200).json({message: "Project updated successful", projectId: updatedProject._id })

  } catch(error) {
    console.error('Error updating project:', error);
    return res.status(500).json({ message: 'Error updating project', error: error.message });
  }
}

const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Incoming body:", id);
    console.log("Incoming body:", req.body);
    console.log("Incoming files:", req.files);

    const {
      serviceName,
      shortDescription,
      longDescription,
      seoTitle,
      seoDescription,
      seoKeywords,
      role
    } = req.body;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    let hasUpdates = false;

    // ✅ Text fields update
    const textFields = {
      serviceName,
      shortDescription,
      longDescription,
      seoTitle,
      seoDescription,
      seoKeywords,
      role
    };

    for (const key in textFields) {
      if (textFields[key] !== undefined && textFields[key] !== "") {
        service[key] = textFields[key];
        hasUpdates = true;
      }
    }

    // ✅ Image fields update
    const imageFields = [
      "thumbnail",
      "descriptionImageOne",
      "descriptionImageTwo",
      "portfolio1",
      "portfolio2",
      "portfolio3"
    ];

    for (const field of imageFields) {
      if (req.files && req.files[field]) {
        const uploaded = await uploadImageToCloudinary(req.files[field][0]);
        if (uploaded) {
          if (service[field]) {
            await deleteImageFromCloudinary(service[field]);
          }
          service[field] = uploaded;
          hasUpdates = true;
        }
      }
    }

    if (!hasUpdates) {
      return res.status(400).json({ message: "No fields to update" });
    }

    await service.save({ validateBeforeSave: false });

    return res.status(200).json({
      message: "Service updated successfully",
      serviceId: service._id,
      updatedService: service
    });

  } catch (error) {
    console.error('Error updating service:', error);
    return res.status(500).json({
      message: 'Error updating service',
      error: error.message
    });
  }
};








const project = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    return res.status(200).json({
      _id: project._id,
      sellerName: project.sellerName,
      userRole: project.userRole,
      city: project.city,
      category: project.category,
      type: project.type,
      size: project.size,
      status: project.status,
      price: project.price,
      projectName: project.projectName,
      description: project.description,
      thumbnail: project.thumbnail,
      descriptionImage: project.descriptionImage,
      propertyImages: [project.propertyImageOne, project.propertyImageTwo, project.propertyImageThree, project.propertyImageFour],
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
}

const sellerDeleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findByIdAndDelete(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (req.user._id.toString() !== project.user.toString()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (project.thumbnail) {
      await deleteImageFromCloudinary(project.thumbnail);
    }
    if (project.descriptionImage) {
      await deleteImageFromCloudinary(project.descriptionImage);
    }
    if (project.propertyImageOne) {
      await deleteImageFromCloudinary(project.propertyImageOne);
    }
    if (project.propertyImageTwo) {
      await deleteImageFromCloudinary(project.propertyImageTwo);
    }
    if (project.propertyImageThree) {
      await deleteImageFromCloudinary(project.propertyImageThree);
    }
    if (project.propertyImageFour) {
      await deleteImageFromCloudinary(project.propertyImageFour);
    }

    await Project.findByIdAndDelete(projectId);
    return res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
}

const sellerAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id }).sort({ createdAt: -1 });
    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: 'No projects found' });
    }
    return res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
}

const sellerUpdateProject = async (req, res) => {
  try {
    const { sellerName, city, category, type, price, projectName, description, size } = req.body;
    const value = {sellerName, city, category, type, price, projectName, description, size}
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (req.user._id.toString() !== project.user.toString()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const fieldsToUpdate = [
      "sellerName",
      "city",
      "category",
      "type",
      "status",
      "price",
      "projectName",
      "description",
      "size"
    ]

    let hasUpdates = false;

    fieldsToUpdate.forEach((field) => {
      if (value[field] !== undefined && value[field] !== project[field]) {
        project[field] = value[field];
        hasUpdates = true;
      }
    });

    
    if (req.files.thumbnail){
      const thumbnail = await uploadImageToCloudinary(req.files.thumbnail[0])
      if (thumbnail){
        deleteImageFromCloudinary(project.thumbnail)
        project.thumbnail = thumbnail
        hasUpdates = true
      }
    }
    if (req.files.descriptionImage){
      const descriptionImageUrl = await uploadImageToCloudinary(req.files.descriptionImage[0])
      if (descriptionImageUrl){
        deleteImageFromCloudinary(project.descriptionImage)
        project.descriptionImage = descriptionImageUrl
        hasUpdates = true
      }
    }
    
    if (req.files.propertyImageOne){
      const propertyImageOne = await uploadImageToCloudinary(req.files.propertyImageOne[0])
      if (propertyImageOne){
        deleteImageFromCloudinary(project.propertyImageOne)
        project.propertyImageOne = propertyImageOne
        hasUpdates = true
      }
    }
    if (req.files.propertyImageTwo){
        const propertyImageTwo = await uploadImageToCloudinary(req.files.propertyImageTwo[0])
        if (propertyImageTwo){
          deleteImageFromCloudinary(project.propertyImageTwo)
          project.propertyImageTwo = propertyImageTwo
          hasUpdates = true
        }
      }
    if (req.files.propertyImageThree){
      const propertyImageThree = await uploadImageToCloudinary(req.files.propertyImageThree[0])
      if (propertyImageThree){
        deleteImageFromCloudinary(project.propertyImageThree)
        project.propertyImageThree = propertyImageThree
        hasUpdates = true
      }
    }
    if (req.files.propertyImageFour){
      const propertyImageFour = await uploadImageToCloudinary(req.files.propertyImageFour[0])
      if (propertyImageFour){
        deleteImageFromCloudinary(project.propertyImageFour)
        project.propertyImageFour = propertyImageFour
        hasUpdates = true
      }
    }
    
    if (!hasUpdates) {
      return res
        .status(400)
        .json({message: "No fields to update"});
    }

    const updatedProject = await project.save({ validateBeforeSave: false });

    return res.status(200).json({message: "Project updated successful", projectId: updatedProject._id })
  } catch (error) {
    console.error('Error updating project:', error);
    return res.status(500).json({ message: 'Error updating project', error: error.message });
  }
}

const propertiesHome = async (req, res) => {
  try {
    const category = req.params.category;
    const projects = await Project.find({ category: category, status: "Approved" }).sort({ createdAt: -1 }).select("_id thumbnail price city projectName");
    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: 'No projects found' });
    }
    return res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
}

const cities = async (req, res) => {
  try {
    const cities = await Project.aggregate([
      {
        $group: {
          _id: null,
          cities: { $addToSet: "$city" }
        }
      },
      {
        $project: { _id: 0, cities: 1 }
      }
    ]);
    if (!cities || cities.length === 0) {
      return res.status(404).json({ message: 'No cities found' });
    }

    return res.status(200).json(cities[0].cities);
  } catch (error) {
    console.error("Error fetching cities:", error);
    return res.status(500).json({ message: "Error fetching cities", error: error.message });
  }
};

const searchProject = async (req, res) => {
  try {
    const searchText = req.query.search;
    const cityText = req.query.city;

    let projects;

    if (cityText && searchText) { 
      projects = await Project.find({
        status: "Approved",
        $and: [
          { projectName: { $regex: searchText, $options: "i" } },
          { city: { $regex: cityText, $options: "i" } },
        ],
      }).sort({ createdAt: -1 });
    } else if (searchText) {
      projects = await Project.find({
        status: "Approved",
        projectName: { $regex: searchText, $options: "i" },
      }).sort({ createdAt: -1 });
    }

    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: "No projects found" });
    }
    
    return res.status(200).json(projects);
  } catch (error) {
    console.error("Error searching projects:", error);
    return res.status(500).json({ message: "Error searching projects", error: error.message });
  }
};

export {
  createProject,
  getAllProjects,
  deleteProject,
  getProject,
  updateProject,
  project,
  sellerDeleteProject,
  sellerAllProjects,
  sellerUpdateProject,
  propertiesHome,
  cities,
  searchProject,
  getAllService,
  updateService
};
