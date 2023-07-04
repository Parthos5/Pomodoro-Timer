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
        required:true
    },
    date:{
        type:Date,
        required:true
    }
})

const userSchema = new Schema({
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
    },
    tasks:[taskSchema]
})

module.exports = mongoose.model("User",userSchema)