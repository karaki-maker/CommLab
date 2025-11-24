
// let firstButton = document.querySelector("#firstButton"); 

// changeInnerText(firstButton)

function colorize(elm){
    elm.style.backgroundColor = "red";
    elm.classList.toggle("circle")
}

function clickedButton(){
    // // select box(es)
    let b = document.querySelector(".box");
    // // use colorie to color box 
    console.log(b); 
    // colorize(b); 
    let bs = document.querySelectorAll(".box"); 
    console.log(bs); 

    // call function 
    // for each element (forEach)
    // in a list (bs)
    bs.forEach(colorize); 
}

// function clickButton(){
    console.log("clicked")
    let b = document.createElement("button"); 
    b.innerText = "Start the Engine"; 
    document.body.append(b); 
// }

// function changeInnerText(elm){
   // elm.innerText = "STARTED"; 
    // elm.style.color = "red"; 
// }