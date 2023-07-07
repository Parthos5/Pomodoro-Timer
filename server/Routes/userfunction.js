const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post('/register',async (req,res) => {
  const {email,name,password} = req.body;
  try{
    if(!email || !password || !name){
      res.status(400).json({Error:"Missing Credentials"})
    }
    else{
      await User.create({
        email:email,
        password:password,
        name:name
      });
      res.status(400).json({message:"Success,User Created!"})
    }
  }
  catch(err){
    res.status(500).json({Error:err})
  }
})

router.post("/login",async (req, res) => {
    // console.log(req.body)
  const {email,password} = req.body;
  console.log(email)
  console.log(password)

  if(!email || !password){
    res.status(400).json({Error:"Missing credentials"})
  }

  try{
    const userData = await User.findOne({email:email});
    console.log(userData)

    // if(userData){
    //     res.status(200).json({userdata:userData})
    // }
    // else{
    //     res.status(200).json({success:false})
    // }
    if(!userData){
        res.status(400).json({Error:"Email not registered"})
    }
    else{
        if(userData.password == password){
            res.status(200).json({message:"Logged in successfully"})
        }
        else{
            res.status(200).json({message:"Incorrect Password"})
        }
    }
  }
  catch(err){
    res.status(500).json({Error:err})
  }
});

router.get("/register",async (req,res) => {
    res.status(200).json({hi:"ho"})
})

module.exports =  router