const BACKEND_URL = "http://localhost:5000/getTasks";
const authToken = localStorage.getItem("authToken");
let tasksArrMain;
let addTaskBtn = false;
if (authToken) {
  // console.log(authToken)
  console.log("executing get tasks");
  renderTasks("off", "off", "off");
}
const currentDate = new Date();
// Get the day of the month (1-31)
const dayOfMonth = currentDate.getDate();
// Get the month name (January-December)
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const monthName = monthNames[currentDate.getMonth()];
// Combine the day of the month and month name into the desired format
const todaydate = `${dayOfMonth}${getOrdinalSuffix(dayOfMonth)} ${monthName}`;
// Helper function to get the ordinal suffix (e.g. "st", "nd", "rd", or "th") for a given number
function getOrdinalSuffix(number) {
  if (number >= 11 && number <= 13) {
    return "th";
  }
  switch (number % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
console.log(todaydate);
let recentdate = document.getElementById("todaydate");
recentdate.innerHTML = `${todaydate}`;

function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  return `${hours}:${minutes}`;
}
function updateClock() {
  const clock = document.getElementById("clock");
  clock.textContent = getCurrentTime();
}

setInterval(updateClock, 1000);

//fetch tasks from db
async function fetchTasks(completed, date, priority) {
  console.log(completed, date, priority);
  let tasks = await fetch("http://localhost:5000/getTasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      authToken,
      date,
      priority,
      completed,
    }),
  }).then((res) => res.json());
  console.log(tasks.tasks);
  return tasks.tasks;
}

//render tasks from db
async function renderTasks(completed, date, priority) {
  let todos = document.getElementById("todos");
  let taskdiv = document.getElementById("tasks");
  // let addtaskdiv = document.getElementById("addtask")
  let tasksArr = await fetchTasks(completed, date, priority);
  tasksArrMain = tasksArr;
  // console.log(tasksArr)
  // addtaskdiv.innerHTML = ""
  todos.innerHTML = "";

  if (tasksArr.length > 0) {
    // console.log(tasksArr);
    for (let i = 0; i < tasksArr.length; i++) {
      console.log(tasksArr[i]._id);
      if (!tasksArr[i].completed) {
        console.log("inside rendering tasksArr");
        // todos.innerHTML = "hello"
        todos.innerHTML += `
      <div id="element" class="element">
      <label class="containercheck">
      <input type="checkbox" onclick="checkTask('${tasksArr[i].description}',${tasksArr[i].completed},'${tasksArr[i]._id}') ">
      <div class="checkmark"></div>
    </label>
    <p class="mytask" id="${tasksArr[i]._id}">${tasksArr[i].description}</p>
    <img src="../icons/${tasksArr[i].priority}-flag.png" id="flag" alt="">
    <img src="../icons/dustbin_white.png" onclick="deleteTask('${tasksArr[i]._id}')" id="dustbin${tasksArr[i]._id}" class="more" alt="">
    </div>`;
      } else {
        // todos.innerHTML = `${completed}`
        todos.innerHTML += `
      <div id="element" class="element">
      <label class="containercheck">
      <input type="checkbox" checked onclick="checkTask('${tasksArr[i].description}',${tasksArr[i].completed},'${tasksArr[i]._id}')">
      <div class="checkmark"></div>
    </label>
    <p class="mytask" style="text-decoration:line-through" id="${tasksArr[i]._id}">${tasksArr[i].description}</p>
    <img src="../icons/${tasksArr[i].priority}-flag.png" id="flag" alt="">
    <img src="../icons/dustbin_white.png" onclick="deleteTask('${tasksArr[i]._id}')" id="dustbin${tasksArr[i]._id}" class="more" alt="">
    </div>`;
      }
    }
    if (addTaskBtn == false) {
      taskdiv.innerHTML += `<div class="element" id="addtask" onclick="handleAddTask()">
    <img src="../icons/plus.png" alt="" id="addicon" class="addicon">
    <p id="mytask" class="addtasktext">Add a Task</p>
    <!-- <img src="../icons/red-flag.png" id="flag" alt="">
    <p>14-03-2023</p> -->
</div>
`;
    }
  } else {
    if (addTaskBtn == false || tasksArr.length == 0) {
      taskdiv.innerHTML = `
      <div class="todos" id="todos"></div>
      <div class="element" id="addtask" onclick="handleAddTask()">
    <img src="../icons/plus.png" alt="" id="addicon" class="addicon">
    <p id="mytask" class="addtasktext">Add a Task and organize your day</p>
    <!-- <img src="../icons/red-flag.png" id="flag" alt="">
    <p>14-03-2023</p> -->
</div>
`;
    }
  }
  addTaskBtn = true;
}

async function cutTasks(completed, taskId) {
  console.log("in gentasks funcn");
  console.log(taskId);
  const taskFoundDesc = document.getElementById(taskId);
  if (completed) {
    if (taskFoundDesc) {
      // Apply the text-decoration style
      taskFoundDesc.style.textDecoration = "line-through";
      console.log(taskFoundDesc);
    } else {
      console.log("Element not found with the specified taskId:", taskId);
    }
  } else {
    if (taskFoundDesc) {
      // Apply the text-decoration style
      taskFoundDesc.style.textDecoration = "none";
      console.log(taskFoundDesc);
    } else {
      console.log("Element not found with the specified taskId:", taskId);
    }
  }
}

//adding a task feature
// let addcontainer = document.getElementById("addcontainer");
// let addtaskbtn = document.getElementById("addtask");
let finalpriority;
function handleAddTask() {
  let addtaskbtn = document.getElementById("addtask");
  let addcontainer = document.getElementById("addcontainer");
  console.log("i am in function");
  addcontainer.style.display = "block";
  addtaskbtn.style.display = "none";
}

//cancel adding the task
function handleCancel() {
  let cancel = document.getElementById("cancel");
  let addtaskbtn = document.getElementById("addtask");

  addcontainer.style.display = "none";
  addtaskbtn.style.display = "flex";
}

//add the task to the database and page
let addthetask = document.getElementById("addthetask");
let taskinput = document.getElementById("entertask");
let dateinput = document.getElementById("dateaddtask");
// let todos = document.getElementById("todos");
let priorityctr = 0;

let originalColor = document.getElementById("p1").style.backgroundColor;

//final step of clicking add the task button
addthetask.addEventListener("click", async function () {
  let addtaskbtn = document.getElementById("addtask");
  let todos = document.getElementById("todos");
  let description = taskinput.value;
  let priority;
  console.log(priorityctr);
  console.log(taskinput.value);
  console.log(dateinput.value);
  if (priorityctr === 0) {
    //making sure a priority is selected
    console.log("select a priority");
    document.getElementById("p1").style.backgroundColor = "#47da99"; //making bg colors of these cotnainers green
    document.getElementById("p2").style.backgroundColor = "#47da99";
    document.getElementById("p3").style.backgroundColor = "#47da99";
    document.getElementById("p4").style.backgroundColor = "#47da99";
    console.log("add a task name");
    setTimeout(() => {
      // Reset the color to the original color
      document.getElementById("p1").style.backgroundColor = originalColor;
      document.getElementById("p2").style.backgroundColor = originalColor;
      document.getElementById("p3").style.backgroundColor = originalColor;
      document.getElementById("p4").style.backgroundColor = originalColor;
    }, 500);
  }
  if (taskinput.value == "") {
    //making sure a task is entered
    taskinput.style.boxShadow = "0 3px 12px 0 rgba(0,0,0,0.37)";
    setTimeout(() => {
      // Reset the color to the original color
      taskinput.style.boxShadow = "none";
    }, 500);
  }
  if (dateinput.value == "") {
    //making sure a date is entered
    console.log("add a date");
    dateinput.style.backgroundColor = "#e8847b";
    setTimeout(() => {
      // Reset the color to the original color
      dateinput.style.backgroundColor = "whitesmoke";
    }, 500);
  }
  let formatteddate;
  // case of when every input field is chosen and task is added
  if (taskinput.value != "" && dateinput.value != "" && priorityctr === 1) {
    formatteddate = dateinput.value; //retreiving correct format of date
    //retreiving priority
    let img;
    if (finalpriority == "Priority 1") {
      img = `<img src="../icons/red-flag.png" id="flag" alt="">`;
      priority = "red";
    } else if (finalpriority == "Priority 2") {
      img = `<img src="../icons/yellow-flag.png" id="flag" alt="">`;
      priority = "yellow";
    } else if (finalpriority == "Priority 3") {
      img = `<img src="../icons/blue-flag.png" id="flag" alt="">`;
      priority = "blue";
    } else {
      img = `<img src="../icons/grey-flag.png" id="flag" alt="">`;
      priority = "grey";
    }
    console.log(finalpriority);
    // renderTasks()
    todos.innerHTML += `<div id="element" class="element"> 
    <label class="containercheck">
    <input type="checkbox">
    <div class="checkmark"></div>
    </label>
          <p class="mytask">${taskinput.value}</p>
          ${img}
          <img src="../icons/dustbin_white.png" id="more" class="more" alt="">
        </div>`;
    addcontainer.style.display = "none";
    addtaskbtn.style.display = "flex";
    taskinput.value = "";
    dateinput.value = "";
    p1.style.backgroundColor = "whitesmoke";
    p2.style.backgroundColor = "whitesmoke";
    p3.style.backgroundColor = "whitesmoke";
    p4.style.backgroundColor = "whitesmoke";
  }

  let resp = await fetch("http://localhost:5000/addTask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      authToken: authToken,
      task: {
        description: description,
        priority: priority,
        date: formatteddate,
      },
    }),
  })
    .then((ans) => ans.json())
    .then((data) => console.log(data));
});

function priority(e) {
  let selectedpr = e.querySelector("p").innerHTML;
  finalpriority = selectedpr; //priority is stored here for use in other functions
  // let p1 = document.getElementById("p1");
  // let p2 = document.getElementById("p2");
  // let p3 = document.getElementById("p3");
  // let p4 = document.getElementById("p4");

  console.log(selectedpr);
  let cid = e.id;
  let idcid = document.getElementById(cid);
  console.log(idcid);

  if (cid == "p1") {
    p1.style.backgroundColor = "#47da99";
    p2.style.backgroundColor = "whitesmoke";
    p3.style.backgroundColor = "whitesmoke";
    p4.style.backgroundColor = "whitesmoke";
    priorityctr = 1;
  } else if (cid == "p2") {
    p1.style.backgroundColor = "whitesmoke";
    p2.style.backgroundColor = "#47da99";
    p3.style.backgroundColor = "whitesmoke";
    p4.style.backgroundColor = "whitesmoke";
    priorityctr = 1;
  } else if (cid == "p3") {
    p1.style.backgroundColor = "whitesmoke";
    p2.style.backgroundColor = "whitesmoke";
    p3.style.backgroundColor = "#47da99";
    p4.style.backgroundColor = "whitesmoke";
    priorityctr = 1;
  } else if (cid == "p4") {
    p1.style.backgroundColor = "whitesmoke";
    p2.style.backgroundColor = "whitesmoke";
    p3.style.backgroundColor = "whitesmoke";
    p4.style.backgroundColor = "#47da99";
    priorityctr = 1;
  }
}

function convertdate(date) {
  // split the date string into an array
  const dateArray = date.split("-");

  // rearrange the values in the array to the desired format
  const formattedDate = dateArray[2] + "-" + dateArray[1] + "-" + dateArray[0];

  console.log(formattedDate); // prints day-month-year format of the date
  return formattedDate;
}

async function checkTask(task, completed, taskId) {
  console.log(tasksArrMain);
  if (completed) {
    checked = "y";
  } else {
    checked = "n";
  }
  console.log(checked);
  let resp = await fetch("http://localhost:5000/checkTasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      authToken: authToken,
      taskDesc: task,
      checked: checked,
    }),
  })
    .then((ans) => ans.json())
    .then((data) => {
      console.log(taskId);
      cutTasks(completed, taskId);
    });
}

async function deleteTask(taskId) {
  let dustbin_img = document.getElementById("dustbin" + taskId);
  let task = dustbin_img.parentElement;
  console.log(task);
  task.style.display = "none";

  let resp = await fetch("http://localhost:5000/deleteTask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      authToken,
      taskId,
    }),
  }).then((res) => res.json());

  console.log(resp);
}

//logic for task filter dropdowns
$(document).ready(function () {
  $("#prioritytaskfilter").select2({
    templateResult: formatState,
    templateSelection: formatState,
  });
});

$(document).ready(function () {
  $("#completetaskfilter").select2({
    templateResult: formatState,
    templateSelection: formatState,
  });
});

function formatState(state) {
  if (!state.id) {
    return state.text;
  }

  var $state = $(
    '<span style="display: flex; align-items: center;justify-"><img src="' +
      state.element.getAttribute("data-image") +
      '" class="img-flag" style="width: 18px; height:18px;margin-top:4px" /> ' +
      state.text +
      "</span>"
  );
  return $state;
}

let checked = document.getElementById("completetaskfilter");
let flag = document.getElementById("prioritytaskfilter");
let dateTask = document.getElementById("datetaskfilter");
async function taskFilter() {
  let checkedVal = checked.value;
  let dateVal = dateTask.value;
  let flagVal = flag.value;
  let completed;

  if (checkedVal != "off") {
    completed = checkedVal === "complete" ? true : false;
  } else {
    completed = checkedVal;
  }
  console.log(checkedVal);
  console.log(dateVal);
  console.log(flagVal);
  renderTasks(completed, dateVal, flagVal);
}

//login task load logic
let loginBtn = document.getElementById("loginbtn");
loginBtn.addEventListener("click", function () {
  console.log("loginbtn task loading");
  setTimeout(function () {
    renderTasks("off", "off", "off");
  }, 800);
  // renderTasks("off","off","off");
});
