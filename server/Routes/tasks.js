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
      return res.status(400).json({ Error: "Auth token not generated" });
    }
    let userInfo = decoded.user;
    let user = await User.findOne({ _id: userInfo.id });
    // console.log(tasks.tasks)
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    let prevtasks = user.tasks;
    const redTasks = prevtasks.filter((task) => task.priority === "red");
    const yellowTasks = prevtasks.filter((task) => task.priority === "yellow");
    const blueTasks = prevtasks.filter((task) => task.priority === "blue");
    const greyTasks = prevtasks.filter((task) => task.priority === "grey");
    let tasks = [...redTasks,...yellowTasks,...blueTasks,...greyTasks]
    console.log(tasks)
    return res.status(200).json({ message: "success", tasks });
  } catch (err) {
    return res.status(400).json({ Error: err });
  }
});

//add task
router.post("/addTask", async (req, res) => {
  const { authToken, task } = req.body;

  if (!authToken) {
    res.status(400).json({ error: "No auth token found" });
  }
  if (!task) {
    res.status(400).json({ error: "Missing information sent in task object" });
  }
  if (!task.description) {
    res.status(400).json({ error: "missing description" });
  }
  console.log(task.date);

  try {
    const decoded = await jwt.verify(authToken, JWT_SECRET);
    if (!decoded) {
      res.status(400).json({ Error: "Auth token not verified" });
    }
    let userInfo = decoded.user;
    let user = await User.findOne({ _id: userInfo.id });
    if (!user) {
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

//check Task
router.post("/checkTasks", async (req, res) => {
  const { checked, taskDesc, authToken } = req.body;

  if (!authToken) {
    return res.status(400).json({ error: "No auth token found" });
  }
  if (!checked) {
    return res.status(400).json("Missing Check");
  }
  if (!taskDesc) {
    return res.status(400).json("Missing description");
  }
  try {
    // return res.status(200).json({message:"Hello"});
    const decoded = await jwt.verify(authToken, JWT_SECRET);
    if (!decoded) {
      res.status(400).json({ Error: "Auth token not verified" });
    }
    let userInfo = decoded.user;
    let user = await User.findOne({ _id: userInfo.id });
    if (!user) {
      res.status(400).json({ message: "User not found" });
    }

    let tasks = user.tasks;
    let task = tasks.find((task) => task.description === taskDesc);
    if (!task) {
      res.status(400).json({ message: "Task not found" });
    }

    task.completed = !task.completed;
    await user.save();
    res.status(200).json({ message: "Success" });
  } catch (err) {
    return res.status(500).json({ Error: err, message: "Error" });
  }
});

//filter tasks according to priority - can be single priority or all ordered
router.post("/priorityTasks", async (req, res) => {
  const { type, authToken } = req.body;
  if (!authToken) {
    return res.status(400).json({ error: "No auth token found" });
  }
  try {
    const decoded = await jwt.verify(authToken, JWT_SECRET);
    if (!decoded) {
      res.status(400).json({ Error: "Auth token not verified" });
    }
    let userInfo = decoded.user;
    let user = await User.findOne({ _id: userInfo.id });
    if (!user) {
      res.status(400).json({ message: "User not found" });
    }

    let prevtasks = user.tasks;
    let tasks;

    if(type === "red"){
      tasks = prevtasks.filter((task) => task.priority === "red")
    }
    else if(type === "yellow"){
      tasks = prevtasks.filter((task) => task.priority === "yellow")
    }
    else if(type === "blue"){
      tasks = prevtasks.filter((task) => task.priority === "blue")
    }
    else{
      tasks = prevtasks.filter((task) => task.priority === "grey")
    }
    return res.status(200).json({message:'Success',tasks})
    
  } catch (err) {
    return res.status(500).json({ Error: err });
  }
});

module.exports = router;
