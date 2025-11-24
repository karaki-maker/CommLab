let soundOne = document.querySelector("#soundOne");


let playBtn = document.querySelector("#playButton"); 
let pauseBtn = document.querySelector("#pauseButton"); 
let speedBtn = document.querySelector("#speedButton"); 
let slowBtn = document.querySelector("#slowButton"); 
let soundSpeed = 1; 

playBtn.addEventListener("click", function(){
    soundOne.play()
})

pauseBtn.addEventListener("click", function(){
    soundOne.pause()
})

speedBtn.addEventListener("click", function(){
    soundSpeed = soundSpeed + 0.5; 
    soundOne.playbackRate = soundSpeed; 
    console.log(soundSpeed)
})

slowBtn.addEventListener("click", function(){
    soundSpeed = soundSpeed * 0.9; 
    soundOne.playbackRate = soundSpeed; 
    console.log(soundSpeed)
})