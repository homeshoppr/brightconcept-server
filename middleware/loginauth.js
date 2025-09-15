import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();
export const userauth = (req,res, next)=>{
    const {authorization} = req.headers
;

    
    
    if(!authorization){
        return res.status(401).json({message: "token is not found"})
    }
    try {
        const user = jwt.verify(authorization, process.env.JWT_SECRET)
        
        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({message: error.message})
    }
}