import mongoose from 'mongoose';


const AdminSchema = mongoose.Schema({
    name  : {
type : String
    },
    email : {
        type :String,
        
    },
    password :{
        type : String
    }
})

const Admin = mongoose.model('admin',AdminSchema)


export default Admin;