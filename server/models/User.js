const mongoose = require("mongoose")

const {Schema} = mongoose;

const taskSchema = new Schema({
    description:{
        type:String,
        required:true
    },
    priority:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    date:{
        type:Date,
        required:true
    }
})

const userSchema = new Schema({
    _id:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,

        required:true
    },
    password:{
        type:String,
        required:true
    },
    spotify_access_token:{
        type:String,
        default:"",
    },
    tasks:[taskSchema]
})

module.exports = mongoose.model("User",userSchema,"User")