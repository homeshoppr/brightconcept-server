// import mongoose from 'mongoose';
// import dotenv from 'dotenv';

// dotenv.config()
// const Url = process.env.mongoUrl

//  export const Connection = async()=>{
//     try {
// await mongoose.connect(`${Url}`)
// console.log("database is connecting");

        
//     } catch (error) {
//         console.log("database is not connecting",error);
        
//     }
// }





import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const Url = process.env.mongoUrl; // Make sure variable name matches in Vercel too

export const Connection = async () => {
  try {
    await mongoose.connect(Url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10s timeout
    });
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};
