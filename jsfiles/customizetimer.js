let themeinput = document.getElementById("themeinput");
let soundinput = document.getElementById("notificationsound");

let notificationinput = document.getElementById("notificationsound")
let notify = document.getElementById("notificationsoundeffect");

function showtabinfo(e){
    let general = document.getElementById("generaltab");
    let timer = document.getElementById("timertab");
    let notification = document.getElementById("notificationtab");

    let timerset = document.getElementById("timerset");
    let generalset = document.getElementById("generalset")
    let notificationset = document.getElementById("notificationset"); //initialsing the buttons

    let current = e.id;
    //initialsing the minutes and seconds
    let worktime = document.getElementById("worktime");
    let breaktime = document.getElementById("breaktime");
    if(current == "generalset")
    {
        //coloring btns white and transparent accordingly
        generalset.setAttribute("style", `background-color:white;color: rgba(52,55,83,1);`);
        timerset.setAttribute("style", `background-color:transparent;color: white;`);
        notificationset.setAttribute("style", `background-color:transparent;color: white;`);

        //displaying and erasing other info accordingly
        general.style.display = "block";
        timer.style.display = "none";
        notification.style.display= "none";
    }
    else if(current == "timerset")
    {
        // //initialsing the minutes and seconds
        // let worktime = document.getElementById("worktime");
        // let breaktime = document.getElementById("breaktime");

        //coloring btns white and transparent accordingly
        timerset.setAttribute("style", `background-color:white;color: rgba(52,55,83,1);`);
        generalset.setAttribute("style", `background-color:transparent;color: white;`);
        notificationset.setAttribute("style", `background-color:transparent;color: white;`);

        //displaying and erasing other info accordingly
        timer.style.display = "flex";
        general.style.display = "none";
        notification.style.display= "none";
        setTimeout(function() {
            timer.classList.add("fadedesc")
          }, 700);

    }
    else
    {
        //coloring btns white and transparent accordingly
        notificationset.setAttribute("style", `background-color:white;color: rgba(52,55,83,1);`);
        generalset.setAttribute("style", `background-color:transparent;color: white;`);
        timerset.setAttribute("style", `background-color:transparent;color: white;`);

        //displaying and erasing other info accordingly
        timer.style.display = "none";
        general.style.display = "none";
        notification.style.display= "block";
    }

    //pushing the updated settings into the localstorqage
    document.getElementById("save").addEventListener("click",function(){
        //timer settings geting pushed
        if(worktime.value != "" && breaktime.value != "") //condn incase no input is given to timer
        {
        let timerset = [worktime.value,breaktime.value];
        localStorage.setItem("timer",JSON.stringify(timerset));
        }
        console.log(themeinput.value);

        //theme settings pushed
        localStorage.setItem("theme",themeinput.value);
    })
}

//pushing the updated settings into the localstorqage
document.getElementById("save").addEventListener("click",function(){
    //timer settings geting pushed
    if(worktime.value != "" && breaktime.value != "") //condn incase no input is given to timer
    {
    let timerset = [worktime.value,breaktime.value];
    localStorage.setItem("timer",JSON.stringify(timerset));
    }

    console.log(themeinput.value);
    //theme settings pushed
    localStorage.setItem("theme",themeinput.value);

    //notification settings getting pushed
    localStorage.setItem("notif",notificationinput.value);
    notify.innerHTML = `<source src="./notifications/${notificationinput.value}.wav" type="audio/mpeg">`

    //musicbox settings fetching and rendering
    let musicswitch = localStorage.getItem("musicbox");
    if(musicswitch == "on")
    {
        musicbox.style.visibility = "visible";
        musicbox.classList.toggle("show");
        musicbox.classList.remove("hide");
        // setTimeout(function() {
        //     musicbox.style.visibility = "visible";
        //   }, 500);
    }
    else{
        musicbox.classList.remove("show");
        musicbox.classList.toggle("hide");
        setTimeout(function() {
            musicbox.style.visibility = "hidden";
          }, 500);
    }
})


// theme fetching and setting
let body = document.getElementById("section");
function updatemew(){
    let theme = localStorage.getItem("theme");
    body.setAttribute("style","background-image: url(./theme/"+ theme + ".jpg)")
    notify.innerHTML = `<source src="./notifications/${notificationinput.value}.wav" type="audio/mpeg">`
  }
let updatetimered = setInterval(updatemew, 1000);

function defaultset(){
    localStorage.setItem("theme","classic");
    localStorage.setItem("notif","bell");
    localStorage.setItem("timer","[25,5]");
    localStorage.setItem("notification","on");
}

//function for focus mode aka fullscreen
function togglefullscreen(){
  const elem = document.getElementById('section');
  if (!document.fullscreenElement) {
    elem.requestFullscreen().catch(err => {
      alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });
  } else {
    document.exitFullscreen();
  }
}