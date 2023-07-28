const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "MYNAMEISPARTHANDAMAWESOMEHEREIAM";


router.post("/getTasks", async (req,res) =>{
    
})