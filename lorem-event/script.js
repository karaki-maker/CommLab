let s = document.querySelector("span"); 
console.log(s); 

function move(eventInfo){
console.log(eventInfo.target);
let elementThatWasMouseOvered = eventinfo.target; 
elementThatWasMouseOvered.style.color = "red";
let randomx = -50 + Math.random()*100; // random value between -50 and 50 
let randomY = -50 + Math.random()*100; 
//
elementThatWasMouseOvered.style.transform = "translate(" + randomX + "px," + random


elementThatWasMousedOvered.style.transform = "translate(-30px,0px";



}

s.addEventListener("mouseover", move)
