import Blog from '../models/blogSchema.js'; // Blog schema
import cloudinary from '../config/cloudinaryConfig.js'; // Cloudinary config

// Function to upload an image to Cloudinary
const uploadImageToCloudinary = async (file) => {
  try {
    if (!file || !file.buffer) {
      throw new Error('File buffer is missing');
    }

    // Use Cloudinary's `upload_stream` method for direct buffer uploads
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'blogs' }, // Set the folder in Cloudinary
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            // console.log('Cloudinary upload result:', result);
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


// Controller function to create a new blog
// export const createBlog = async (req, res) => {
//   try {

//     if (!req.files || !req.files.image || req.files.image.length === 0) {
//       return res.status(400).json({ message: 'Image file is required' });
//     }

//     const { title, category, shortDescription, imageAlt, content } = req.body;

//     // Upload the main blog image
//     const imageUrl = await uploadImageToCloudinary(req.files.image[0]);

//     // Upload the description image (if provided)
//     let descriptionImageUrl = null;
//     if (req.files.descriptionImage && req.files.descriptionImage.length > 0) {
//       descriptionImageUrl = await uploadImageToCloudinary(req.files.descriptionImage[0]);
//     }

//     // Create and save the blog in MongoDB
//     const newBlog = new Blog({
//       title,
//       category,
//       shortDescription,
//       image: imageUrl,
//       imageAlt,
//       descriptionImage: descriptionImageUrl,
//       content,
//     });

//     await newBlog.save();

//     // Send success response
//     return res.status(200).json({ message: 'Blog uploaded successfully', blog: newBlog });
//   } catch (error) {
//     console.error('Error uploading blog:', error);
//     return res.status(500).json({ message: 'Error uploading blog', error: error.message });
//   }
// };



export const createBlog = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // Upload the portfolio image
    const imageUrl = await uploadImageToCloudinary(req.file);

    // Save portfolio entry
    const newBlog = new Blog({
      image: imageUrl,
    });

    await newBlog.save();

    return res
      .status(200)
      .json({ message: "Blog uploaded successfully", blog: newBlog });
  } catch (error) {
    console.error("Error uploading portfolio:", error);
    return res
      .status(500)
      .json({ message: "Error uploading portfolio", error: error.message });
  }
};


// Controller function to get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    // Fetch all blogs from the database
    const blogs = await Blog.find();

    // Check if no blogs exist
    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ message: 'No blogs found' });
    }

    // Send the blogs in the response
    return res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return res.status(500).json({ message: 'Error fetching blogs', error: error.message });
  }
};



export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;  // Get blog ID from request parameters

    // Find the blog by its ID
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Return the blog data
    return res.status(200).json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return res.status(500).json({ message: 'Error fetching blog', error: error.message });
  }
};


export const editBlog = async (req, res) => {
  try {
    const { id } = req.params;  // Get blog ID from request params
    const { title, category, shortDescription, imageAlt, content } = req.body; // Get updated fields

    // Find the blog by ID
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Update the blog's fields
    if (title) blog.title = title;
    if (category) blog.category = category;
    if (shortDescription) blog.shortDescription = shortDescription;
    if (imageAlt) blog.imageAlt = imageAlt;
    if (content) blog.content = content;

    // Handle image upload if a new image is provided
    let imageUrl = blog.image; // Default to the current image if no new image is uploaded
    let descriptionImageUrl = blog.descriptionImage;

    if (req.files && req.files.image && req.files.image.length > 0) {
      // Upload the new main blog image
      imageUrl = await uploadImageToCloudinary(req.files.image[0]);
      deleteImageFromCloudinary(blog.image);
    }

    if (req.files && req.files.descriptionImage && req.files.descriptionImage.length > 0) {
      // Upload the new description image (if provided)
      descriptionImageUrl = await uploadImageToCloudinary(req.files.descriptionImage[0]);
      deleteImageFromCloudinary(blog.descriptionImage);
    }

    // Update image URLs in the blog
    blog.image = imageUrl;
    blog.descriptionImage = descriptionImageUrl;

    // Save the updated blog
    await blog.save();

    // Send success response
    return res.status(200).json({ message: 'Blog updated successfully', blog });
  } catch (error) {
    console.error('Error updating blog:', error);
    return res.status(500).json({ message: 'Error updating blog', error: error.message });
  }
};










// Controller function to delete a blog
// Controller function to delete a blog
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;  // Get blog ID from request params

    // Find the blog by ID
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Delete the image from Cloudinary
    await deleteImageFromCloudinary(blog.image);

    // If description image exists, delete it from Cloudinary as well
    if (blog.descriptionImage) {
      await deleteImageFromCloudinary(blog.descriptionImage);
    }

    // Delete the blog from MongoDB
    await Blog.findByIdAndDelete(id);

    // Send success response
    return res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return res.status(500).json({ message: 'Error deleting blog', error: error.message });
  }
};
