import mongoose from 'mongoose';


const CategorySchema = mongoose.Schema({
    name : {
        type :String,
        
    }
})

const Category = mongoose.model('category',CategorySchema)


export default Category;