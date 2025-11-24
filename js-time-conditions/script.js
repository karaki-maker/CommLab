let myText = document.querySelector("#myText");
let output = document.querySelector("#output");



// challenge 1: 
// as we type into the input box, 
// the text should appear inside the "ouput" p tag:

myText.addEventListener("input", outputmyText); 

function outputmyText(eventInfo){
    let elementInteractedWith = eventInfo.target; 

    let text = eventInfo.target.value; 
    console.log(text); 

    output.innerText = text; 

    if (text == "spin"){
        spin(elementInteractedWith); 
        eventInfo.target.value = ""; 
        output.innerText = ""; 
    }
}


// function to spin an element 
function spin(element){
    element.style.transition = "all 1s linear"
    element.style.transform = "rotate(360deg)"
}

let count = 0; // GLOBAL VARIABLE 

// -------- PART 2
let myButton = document.querySelector("#myButton");

myButton.addEventListener("click", function(eventInfo){
    count = count + 1; 
    console.log(count); 

    if(count >= 10){
    document.body.style.backgroundColor = "blue";
    supersize(eventInfo.target); 
    
    setTimeout(function(){
        eventInfo.target.remove()
        clearInterval(messageInterval)
        messageBoard.innterHTML = ""; 
    }, 500) 

   
    }
})


let messageBoard = document.querySelector("#messageBoard");



let messageInterval = setInterval(function(){
    let clicksLeft = 10 - count
    addMessage("Click the button " + clicksLeft + " more times.")
}, 1000); 





// function to add text to the div with id "messageboard"
function addMessage(messagetext){
    let p = document.createElement("p");
    p.innerText = messagetext;
    messageBoard.prepend(p);
}

// function to rapidly increase the size of an element
function supersize(element){
    element.style.transition = "all .5s linear"
    element.style.transform = "scale(100)"
}

