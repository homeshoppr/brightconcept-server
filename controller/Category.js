import mongoose from 'mongoose';
import Category from '../models/CategorySchema.js';



export const Categoryfunc = async (req,res)=>{
    const {name} = req.body
   
    
    try {

        if(!name){
            return res.status(400).json({message :"please provide all the filed"})
        }
        const existsdata = await Category.findOne({name})
        if (existsdata) {
          return  res.status(400).json({message:"this department is already saved"})
        }

 const finaldata = new Category(req.body);
 await finaldata.save();
  return res.status(200).json({message: "Data saved Successfully"})
        
    } catch (error) {
        res.status(400).json({message:"There are some error"})
    }
}
 

export const GetCategoryfunc = async (req,res)=>{
    try {
        const resultdata = await Category.find({})
        if(resultdata){
          return  res.status(200).json({message:'category Data found',resultdata})
        }
    } catch (error) {
       res.status(400).json({message:'Data not found'}) 
    }
}


export const GetSingleCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const singleCategory = await Category.findOne({ _id: id });

        if (!singleCategory) {
            return res.status(401).json({ message: "Data not found in Database" }); // Return here to stop execution
        }

        return res.status(200).json({ message: 'Data Found Successfully', singleCategory });
    } catch (error) {
        return res.status(400).json({ message: "Data not found", error: error.message });
    }
};



export const CategoryUpdateFunc = async (req,res)=>{
    const {id} = req.params
    const Categorydata = req.body
    try {
        const resultdata = new Category(Categorydata)
        await Category.updateOne({_id : id},resultdata)
        res.status(200).json({message:'Data Updated Successfully'})
    } catch (error) {
        res.status(400).json({message:'Data Not updated'})
    }
}



export const Categorydeletefunc = async (req,res)=>{
    const {id} = req.params
    try {
         await Category.deleteOne({_id : id})
        res.status(200).json({message:'Data delted Successfully'})
    } catch (error) {
        res.status(400).json({message:'data not deleted'})
    }
}