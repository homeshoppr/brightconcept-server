import Employee from "../models/EmpolyeeSchema.js";
import cloudinary from "cloudinary";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

// Configure Cloudinary with your credentials
// cloudinary.v2.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });
// console.log("Cloudinary Configured:", process.env.CLOUDINARY_CLOUD_NAME);

export const createEmployee = async (req, res) => {
  try {
      // const { ...otherData } = req.body;
      const { password, ...otherData } = req.body;
   // Hash the password using bcrypt
   const saltRounds = 10; // Adjust the salt rounds as needed
   const hashedPassword = await bcrypt.hash(password, saltRounds);  
      let uploadedImage = null;

      if (req.file) {
          const result = await new Promise((resolve, reject) => {
              const upload = cloudinary.v2.uploader.upload_stream(
                  { folder: "employee_images" },
                  (error, result) => {
                      if (error) reject(error);
                      else resolve(result);
                  }
              );
              upload.end(req.file.buffer); 
          });

          uploadedImage = {
              url: result.secure_url,
              public_id: result.public_id, 
          };
      }

 
      const newEmployee = new Employee({
          ...otherData,
          password: hashedPassword,
          profileImage: uploadedImage || null, 
      });

      await newEmployee.save();

      res.status(201).json({
          message: "Employee created successfully",
          employee: newEmployee,
      });
  } catch (error) {
      console.error("Error creating employee:", error);
      res.status(500).json({
          message: "Error creating employee",
          error: error.message,
      });
  }
};






  export const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({},"-password");

        res.status(200).json({
            message: "Employees fetched successfully",
            employees,
        });
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ message: "Error fetching employees", error });
    }
};



export const SingleUserGetFunc = async (req,res)=>{
  const {id} = req.params
  try {
    const result = await Employee.findById({_id : id},"-password")
    res.status(200).json({message:'data found Succesfuuly',data :result})
    
  } catch (error) {
    
  }
}


// export const editEmployeefunc = async (req, res) => {
//   const { id } = req.params;
//   const { password, ...otherData } = req.body; // Extract password separately
//   let updatedFields = { ...otherData };

//   try {
//       console.log("Request body:", req.body);
//       console.log("Request file:", req.file);

//       // Find the existing employee
//       const employee = await Employee.findById(id);
//       if (!employee) {
//           return res.status(404).json({ message: "Employee not found" });
//       }

//       // Hash the new password if it's provided
//       if (password) {
//           const saltRounds = 10;
//           const hashedPassword = await bcrypt.hash(password, saltRounds);
//           updatedFields.password = hashedPassword;
//       }

//       // Handle profile image update
//       if (req.file) {
//           if (employee.profileImage && employee.profileImage.public_id) {
//               await cloudinary.v2.uploader.destroy(employee.profileImage.public_id);
//           }

//           const result = await new Promise((resolve, reject) => {
//               const upload = cloudinary.v2.uploader.upload_stream(
//                   { folder: "employee_images" },
//                   (error, result) => {
//                       if (error) reject(error);
//                       else resolve(result);
//                   }
//               );
//               upload.end(req.file.buffer);
//           });

//           updatedFields.profileImage = {
//               url: result.secure_url,
//               public_id: result.public_id,
//           };
//       }

//       console.log("Updated Fields:", updatedFields);

//       // Update the employee record in the database
//       const updatedEmployee = await Employee.findByIdAndUpdate(
//           id,
//           { $set: updatedFields },
//           { new: true }
//       );

//       res.status(200).json({
//           message: "Employee updated successfully",
//           employee: updatedEmployee,
//       });
//   } catch (error) {
//       console.error("Error updating employee:", error);
//       res.status(500).json({
//           message: "Error updating employee",
//           error: error.message,
//       });
//   }
// };


export const editEmployeefunc = async (req, res) => {
  const { id } = req.params;
  const { password, ...otherData } = req.body; // Extract password separately
  let updatedFields = { ...otherData };

  try {
      // Find the existing employee
      const employee = await Employee.findById(id);
      if (!employee) {
          return res.status(404).json({ message: "Employee not found" });
      }

      // Hash the new password if provided
      if (password) {
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          updatedFields.password = hashedPassword;
      }

      // Handle profile image update if a file is uploaded
      if (req.file) {
          // Delete old image from Cloudinary if exists
          if (employee.profileImage && employee.profileImage.public_id) {
              await cloudinary.v2.uploader.destroy(employee.profileImage.public_id);
          }

          // Upload new image to Cloudinary
          const result = await new Promise((resolve, reject) => {
              const upload = cloudinary.v2.uploader.upload_stream(
                  { folder: "employee_images" },
                  (error, result) => {
                      if (error) reject(error);
                      else resolve(result);
                  }
              );
              upload.end(req.file.buffer);
          });

          updatedFields.profileImage = {
              url: result.secure_url,
              public_id: result.public_id,
          };
      } else {
          // If no new image is uploaded, retain the existing profile image
          updatedFields.profileImage = employee.profileImage;
      }

    

      // Update the employee record
      const updatedEmployee = await Employee.findByIdAndUpdate(
          id,
          { $set: updatedFields },
          { new: true } // Return the updated document
      );

      res.status(200).json({
          message: "Employee updated successfully",
        //   employee: updatedEmployee,
      });
  } catch (error) {
      console.error("Error updating employee:", error);
      res.status(500).json({
          message: "Error updating employee",
          error: error.message,
      });
  }
};




export const employeedeleteFunc = async (req, res) => {
  const { id } = req.params;

  try {
     
      const employee = await Employee.findById(id);

      if (!employee) {
          return res.status(404).json({ message: "Employee not found" });
      }

      // If the employee has a profile image, delete it from Cloudinary
      if (employee.profileImage && employee.profileImage.public_id) {
          const cloudinaryResult = await cloudinary.v2.uploader.destroy(employee.profileImage.public_id);
      }

      // Delete the employee record from the database
      await Employee.deleteOne({ _id: id });

      res.status(200).json({ message: "Employee and profile image deleted successfully" });
  } catch (error) {
      console.error("Error deleting employee:", error);
      res.status(500).json({ message: "Error deleting employee", error: error.message });
  }
};
