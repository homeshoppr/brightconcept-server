import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config()
const Url = process.env.mongoUrl

 export const Connection = async()=>{
    try {
await mongoose.connect(`${Url}`)
console.log("database is connecting");

        
    } catch (error) {
        console.log("database is not connecting",error);
        
    }
}