// onload === 'ol'

let oltheme = localStorage.getItem("theme");
let olbody = document.getElementById("section");
let notifyss = document.getElementById("notificationsoundeffect");

//first default condition for music box
localStorage.setItem("musicbox","on");


if(oltheme == "classic")
{
    olbody.style.backgroundColor = "rgb(245,35%,19%)";
}
else{
olbody.setAttribute("style","background-image: url(./theme/"+ oltheme + ".jpg)")
}

let notifonload = localStorage.getItem("notif");
notifyss.innerHTML = `<source src="./notifications/${notifonload}.wav" type="audio/mpeg">`

//checking notification toggle onload
let notiftogg = document.getElementById("notiftoggle");

let notitoggle = localStorage.getItem("notification");
//for new systems where localstoage item is not loaded
if(!notitoggle)
{
  localStorage.setItem("musicbox","on");
}
if(notitoggle == "on")
{
    notiftogg.checked = true;
}

//logic for notification toggle on and off
notiftogg.addEventListener("change",function(){
  doSomething();
})
function doSomething() {
if (notiftogg.checked) {
  console.log('Toggle is checked');
  localStorage.setItem("notification","on")
} else {
  console.log('Toggle is not checked');
  localStorage.setItem("notification","off")
}
}

//checking notification toggle onload
let musictogg = document.getElementById("musictogg");

let musictoggle = localStorage.getItem("musicbox");
//for new systems where localstoage item is not loaded
if(!musictoggle)
{
  localStorage.setItem("musicbox","on");
}
if(musictoggle == "on")
{
  musictogg.checked = true;
}

//logic for spotify music box toggle on and off
musictogg.addEventListener("change",function(){
  doSomethingformusic();
})
function doSomethingformusic() {
if (musictogg.checked) {
  console.log('Toggle is checked');
  localStorage.setItem("musicbox","on")
} else {
  console.log('Toggle is not checked');
  localStorage.setItem("musicbox","off")
}
}

let musicbox = document.getElementById("musicbox");
//onload function for music box
if(musictoggle == "off"){
  musicbox.style.visibility = "hidden";
}