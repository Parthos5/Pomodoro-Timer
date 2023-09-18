const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "MYNAMEISPARTHANDAMAWESOMEHEREIAM";

//fetch tasks
router.post("/getTasks", async (req, res) => {
  const { authToken } = req.body;

  if (!authToken) {
    res.status(400).json({ error: "No auth token found" });
  }

  try {
    const decoded = await jwt.verify(authToken, JWT_SECRET);
    if (!decoded) {
      res.status(400).json({ Error: "Auth token not verified" });
    }
    let userInfo = decoded.user;
    let user = await User.findOne({ _id: userInfo.id });
    // console.log(tasks.tasks)
    if (!user) {
      res.status(400).json({ message: "User not found" });
    }
    let tasks = user.tasks;
    res.status(200).json({ message: "success", tasks });
  } catch (err) {
    res.status(400).json({ Error: err });
  }
});

router.post("/addTask", async (req, res) => {
  const { authToken,task } = req.body;

  if (!authToken) {
    res.status(400).json({ error: "No auth token found" });
  }
  if(!task){
    res.status(400).json({error:"Missing information sent in task object"})
  }

  try {
    const decoded = await jwt.verify(authToken, JWT_SECRET);
    if (!decoded) {
      res.status(400).json({ Error: "Auth token not verified" });
    }
    let userInfo = decoded.user;
    let user = await User.findOne({_id:userInfo.id});
    if(!user){
      res.status(400).json({ message: "User not found" });
    }
    let tasks = user.tasks;
    user.tasks.push(task);
    await user.save();
    res.status(200).json({ message: "success", tasks });
  } catch (err) {
    res.status(400).json({ Error: err });
  }
});

module.exports = router;
