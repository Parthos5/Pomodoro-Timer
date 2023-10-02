const BACKEND_URL = "http://localhost:5000/getTasks";
const authToken = localStorage.getItem("authToken");
if (authToken) {
  // console.log(authToken)
  console.log("executing get tasks");
  getTasks();
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
async function getTasks() {
  console.log("in get tasks funcn");
  let taskdiv = document.getElementById("tasks");
  let todos = document.getElementById("todos");
  let tasks = await fetch("http://localhost:5000/getTasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      authToken,
    }),
  }).then((res) => res.json());
  if (tasks.tasks) {
    let tasksArr = tasks.tasks;
    // let img = `<img src="../icons/${tasksArr.priority}-flag.png" id="flag" alt="">`;
    console.log(tasksArr);
    for (let i = 0; i < tasksArr.length; i++) {
      todos.innerHTML += `
      <div id="element" class="element">
      <label class="containercheck">
      <input type="checkbox">
      <div class="checkmark"></div>
    </label>
    <p id="mytask">${tasksArr[i].description}</p>
    <img src="../icons/${tasksArr[i].priority}-flag.png" id="flag" alt="">
    <img src="../icons/more.png" id="more" class="more" alt="">
    </div>`;
    }
  }
  taskdiv.innerHTML += `<div class="element" id="addtask" onclick="handleAddTask()">
    <img src="../icons/plus.png" alt="" id="addicon" class="addicon">
    <p id="mytask" class="addtasktext">Add a Task</p>
    <!-- <img src="../icons/red-flag.png" id="flag" alt="">
    <p>14-03-2023</p> -->
</div>
`;
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
let todos = document.getElementById("todos");
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

  // case of when every input field is chosen and task is added
  if (taskinput.value != "" && dateinput.value != "" && priorityctr === 1) {
    let formatteddate = convertdate(dateinput.value); //retreiving correct format of date
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
    todos.innerHTML += `
<div id="element" class="element">
          <label class="containercheck">
            <input type="checkbox">
            <div class="checkmark"></div>
          </label>
          <p id="mytask">${taskinput.value}</p>
          ${img}
          <img src="../icons/more.png" id="more" class="more" alt="">
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
