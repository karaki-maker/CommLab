
let myButton = document.querySelector("#myButton"); 
let myInput = document.querySelector("#myInput"); 
let myOutput = document.querySelector("#myOutput"); 

//define function 
function buttonClicked(eventInfo){
    document.body.style.backgroundColor = "pink"; 
    console.log(eventInfo.target)
    console.log(myButton)
    }
//reference function to be called upon event happening 
myButton.addEventListener("click", buttonClicked); 

// alternative 
// defined function ight where we reference it 
// myButton.addEventListener("click", function(){
//    document.body.style.backgroundColor = "pink"; 
// }); 
    
function inputChanged(eventInfo){
    console.log(eventInfo.target.value); 
    console.log("input changed!"); 
    myOutput.innerText = eventInfo.target.value; 
}
//                      "change"
myInput.addEventListener("change", inputChanged);



