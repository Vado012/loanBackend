import mongoose from 'mongoose';
const userschema = mongoose.Schema({
    Firstname:{
        type:String,
        required:true
    },
    Lastname:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
     Phonenumber:{
        type:String,
        required:true,
        unique:true
    },
    Password:{
        type:String,
        required:true
    },
    role:{
        type:String, 
        enum: ["admin", "user"],
        default:"user"
    }
},{ timestamps:true })

const User = mongoose.model('User',userschema);
export default User;