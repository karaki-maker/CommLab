
let container = document.querySelector("#container"); 

// create element in "JS Space"
let headline = document.createElement("h5");

headline.innerText = "Welcome to my Page";

function welcome(){
    // put it on the page 
    // document.body.append(headline);
    // put it into another element
    container.append(headline); 

    // remove an element from the page 
    document.querySelector(".notWanted").remove()
}

function moveBox(){
    container.classList.toggle("move"); 

    // random between 0 and 100 
    let r1 = Math.random(); 
    console.log(r1);

    // custom number size 
    let r2 = Math.random() * 100; 
    console.log(r2);

    // custom min and max value 
    let r3 = 10 + Math.random(10) * 10; 

    // custom 
    let r4 = Math.floor(r3); 
    console.log(r4); 

    document.querySelector(".notWanted").style.fontSize = r2+"px";
}

