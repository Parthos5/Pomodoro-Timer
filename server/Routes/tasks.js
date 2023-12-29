const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const moment = require("moment-timezone");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "MYNAMEISPARTHANDAMAWESOMEHEREIAM";

//fetch tasks
router.post("/getTasks", async (req, res) => {
  const { authToken, date, priority,completed } = req.body;

  if (!authToken) {
    return res.status(400).json({ error: "No auth token found" });
  }
  if (!date || !priority) {
    return res.status(400).json({ error: "Insufficient date" });
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
    let finalTasks = user.tasks;

    //  DATE FILTER
    if (date != "off") {
      finalTasks = await dateTasks(prevtasks, date);
    }

    // PRIORITY FILTER
    if (priority != "off") {
      finalTasks = await priorityTasks(finalTasks,priority)
    }

    // CHECK FILTER
    if (completed != "off"){
      finalTasks = await completedTasks(finalTasks,completed)
    }

    //ORDERING TASKS ACC TO PRIORITY
    const redTasks = finalTasks.filter((task) => task.priority === "red");
    const yellowTasks = finalTasks.filter((task) => task.priority === "yellow");
    const blueTasks = finalTasks.filter((task) => task.priority === "blue");
    const greyTasks = finalTasks.filter((task) => task.priority === "grey");
    let tasks = [...redTasks, ...yellowTasks, ...blueTasks, ...greyTasks];
    // console.log(tasks);
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

//delete task
router.post("/deleteTask", async (req, res) => {
  const { authToken, taskId } = req.body;
  console.log("hello");
  if (!authToken) {
    return res.status(400).json({ error: "No auth token found" });
  }
  if (!taskId) {
    return res.status(400).json("Missing task ID");
  }

  try {
    const decoded = await jwt.verify(authToken, JWT_SECRET);
    if (!decoded) {
      return res.status(400).json({ Error: "Auth token not verified" });
    }
    let userInfo = decoded.user;
    let user = await User.findOne({ _id: userInfo.id });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    let tasks = user.tasks;
    console.log("2nd hello");

    const isValidObjectId = mongoose.Types.ObjectId.isValid(taskId);
    if (!isValidObjectId) {
      return res.status(400).json({ error: "Invalid task ID format" });
    }
    // const taskIdObj = mongoose.Types.ObjectId(taskId)
    // if(!taskIdObj){
    //   res.status(400).json({error:"no converting"})
    // }
    var ObjectId = require("mongodb").ObjectId;
    let newTaskId = new ObjectId(taskId); // wrap in ObjectID
    console.log("3rd hello");
    console.log(newTaskId);
    // console.log(taskIdObj)
    let taskIndex = tasks.findIndex(
      (task) => task._id.toString() === newTaskId.toString()
    );
    if (taskIndex === -1) {
      return res.status(400).json({ message: "Task not found" });
    }

    tasks.splice(taskIndex, 1);
    await user.save();
    res.status(200).json({ message: "Success" });
  } catch (err) {
    return res.status(500).json({ Error: err, message: "Error" });
  }
});

/*****TASK FILTERS*****/
//filter tasks according to priority - can be single priority or all ordered
async function priorityTasks(prevtasks, priority) {
  let tasks;

  if (priority === "red") {
    tasks = prevtasks.filter((task) => task.priority === "red");
  } else if (priority === "yellow") {
    tasks = prevtasks.filter((task) => task.priority === "yellow");
  } else if (priority === "blue") {
    tasks = prevtasks.filter((task) => task.priority === "blue");
  } else {
    tasks = prevtasks.filter((task) => task.priority === "grey");
  }
  return tasks;
}

//filter tasks according to the date
async function dateTasks(prevtasks, date) {
  let tasks;
  console.log("datemsg 1");
  // Getting today's date
  const tempToday = new Date();
  console.log(tempToday);
  // tempToday.setHours(0, 0, 0, 0);
  const today = tempToday.toISOString().replace(/T.*$/, "T00:00:00.000Z");

  // Compare the dates
  if (date === "past3") {
    tasks = prevtasks.filter(
      (task) => task.date.toISOString().split("T")[0] < today.split("T")[0]
    );
  } else if (date === "future3") {
    tasks = prevtasks.filter(
      (task) => task.date.toISOString().split("T")[0] > today.split("T")[0]
    );
  } else {
    tasks = prevtasks.filter(
      (task) => task.date.toISOString().split("T")[0] === today.split("T")[0]
    );
  }
  return tasks;
}

//filter tasks according to completion
 async function completedTasks(prevtasks,completed){
    let tasks;
    if (completed) {
      tasks = prevtasks.filter((task) => task.completed === true);
    } else {
      tasks = prevtasks.filter((task) => task.completed === false);
    }
    // console.log(tasks);
    return tasks;
};

module.exports = router;
