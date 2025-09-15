import mongoose from "mongoose";
import Employee from '../models/EmpolyeeSchema.js'
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import AttendenceModel from "../models/AttendanceSchema.js";
dotenv.config();






export const loginEmployee = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Employee.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const now = new Date();
    const attendanceRecord = new AttendenceModel({
      employeeId: user._id,
      firstName:user.firstName,
      lastName:user.lastName,
      role: user.role,
      email: user.email,
      department: user.department,
      loginDate: now.toISOString().split('T')[0], // Only the date
      loginTime: now.toTimeString().split(' ')[0], // Only the time
    });
    await attendanceRecord.save();

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.firstName, email: user.email, role: user.role, profile:user.profileImage.url },
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};


export const logoutEmployee = async (req, res) => {
  const { employeeId } = req.body;

  try {
    const now = new Date();

    // Find the latest attendance record for this employee where logoutTime is null
    const attendanceRecord = await AttendenceModel.findOne({
      employeeId,
      logoutTime: null,
    }).sort({ loginDate: -1, loginTime: -1 }); // Sort by latest session

    if (!attendanceRecord) {
      return res.status(400).json({ message: 'No active session found to logout.' });
    }

    const loginDate = attendanceRecord.loginDate;  // This is a Date object
    const loginTime = attendanceRecord.loginTime;  // This is a string in HH:mm:ss format


    // Combine `loginDate` and `loginTime` into a valid Date object
    const loginTimeArray = loginTime.split(':');
    const loginDateTime = new Date(loginDate);
    loginDateTime.setHours(loginTimeArray[0], loginTimeArray[1], loginTimeArray[2]);


    // Check if the combined Date is valid
    if (isNaN(loginDateTime)) {
      return res.status(400).json({ message: 'Failed to combine login date and time into a valid Date object.' });
    }

    // Update the record with logout details
    attendanceRecord.logoutDate = now.toISOString().split('T')[0]; // Only the date
    attendanceRecord.logoutTime = now.toTimeString().split(' ')[0]; // Only the time

    // Calculate total duration in milliseconds
    const totalMilliseconds = now - loginDateTime;

    // Convert milliseconds to hours and minutes
    const totalHours = Math.floor(totalMilliseconds / (1000 * 60 * 60)); // Extract total hours
    const totalMinutes = Math.floor((totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60)); // Remaining minutes

    // Save total duration to the record
    attendanceRecord.totalHours = `${totalHours}h ${totalMinutes}m`;

    // Save the updated record
    await attendanceRecord.save();

    res.status(200).json({
      message: 'Logout successful',
      logoutDate: attendanceRecord.logoutDate,
      logoutTime: attendanceRecord.logoutTime,
      totalHours: attendanceRecord.totalHours,
    });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({
      message: 'Error logging out',
      error: error.message,
    });
  }
};


export const AttendenceRecordFunc = async(req,res)=>{
  try {
    const Attendence = await AttendenceModel.find({});
    if(Attendence) {
     return res.status(200).json({message:"attendence Record get Successfullt",Attendence})
    }
  } catch (error) {
    res.status(400).json({message:"Attendence not found",error})
  }
}