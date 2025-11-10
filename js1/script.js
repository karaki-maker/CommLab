let name = "Katerina"; 

let temperature = 20; 

function changeText(){
    console.log("click the button"); 
    // myText.innerText = "LALALALALALALA"; 
    myText.innerHTML = "click <a href='#'>here</a>"
    headline.style.textDecoration = "underline";
}

// let headline = document.querySelector("h1"); 

// document.querySelector("h1").innerText = "Tried it. Didn't like it.";

//below is a function call: 
// alert("Hi " + name + " it's " + temperature + " degrees outside."); 

// temperature = 16; 

// alert("Now it's " + temperature + " degrees.") 

console.log("THe page has loaded and the temperature is " + temperature); 

// function definition 
// define once 
// use many times 
// function DoManyThings(){
    // console.log("button was clicked");
   //  alert("Hi " + name + " it's " + temperature + " degrees outside."); 

// }

{
    console.log("received: " + greeting);
    alert(greeting); 
    document.querySelector("h1").innerText = "Tried it. Didn't like it.";
}

