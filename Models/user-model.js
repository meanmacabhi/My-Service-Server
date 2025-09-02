const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");



const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
});

//json web token
userSchema.methods.generateToken =async function(){
    try {
        return jwt.sign({ //payload
            userId:this._id.toString(),
            email : this.email,
            isAdmin : this.isAdmin,
        },
        process.env.JWT_KEY,//key
        {
            expiresIn:"30d",//expiry duration
        }
    );
    } catch (error) {
        console.error(error);
    }
};

const User = new mongoose.model("User",userSchema);

module.exports = User;