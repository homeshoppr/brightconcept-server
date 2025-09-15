import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    firstName: {
        type: String
    },
    lastName: { type: String },
    role: { type: String, required: true },
    email: { type: String, required: true },
    department: { type: String, required: true },
    loginDate: { type: Date, required: true }, // Full date
    loginTime: { type: String, required: true }, // Time as a string
    logoutDate: { type: Date, default: null },   // Full date
    logoutTime: { type: String, default: null }, // Time as a string
    totalHours: { type: String, default: null }, // Total hours worked in "Xh Ym" format
});

const AttendenceModel = mongoose.model('Attendance', attendanceSchema);

export default AttendenceModel;
