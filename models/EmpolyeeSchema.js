import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    employeeCode: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String },
    department: { type: String },
    password: { type: String, required: true },
    joiningDate: { type: Date },
    dob: { type: Date },
    bloodGroup: { type: String },
    designation: { type: String },
    status: { type: String },
    address: { type: String },
    profileImage: {
      url: { type: String, required: false },
      public_id: { type: String, required: false },
  },
  });
  
  const Employee = mongoose.model("Employee", employeeSchema);
  export default Employee;
  
