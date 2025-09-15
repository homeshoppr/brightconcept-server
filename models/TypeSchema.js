import mongoose from 'mongoose';

const Typeschema = new mongoose.Schema({
    name :{
        type: String,
        Required : true
    }
})

const CategoryType = mongoose.model("type",Typeschema)

export default CategoryType;