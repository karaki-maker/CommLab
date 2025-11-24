function getScrollPercentage(){
    // how far have we scrolled 
    let scrollTop = window.scrollY; 
    console.log(scrollTop); 

    // how far can we scroll in total 
    let maxScroll = document.body.scrollHeight - window.innerHeight; 

    let perc = scrollTop/maxScroll * 100;
    return perc; 
}

window.addEventListener("scroll", function(){
    // console.log("we are scrolling!") 

    let percentage = getScrollPercentage(); 
    console.log(percentage);

    if(percentage > 33){
        document.querySelector(".one p").style.transform = "rotate(720deg)";
    }else{
        document.querySelector(".one p").style.transform = "rotate(0deg)"; 
    }

    if(percentage >78){
        document.querySelector(".two p").style.transform = "scale(1)"; 
        document.querySelector(".two p").style.opacity = 1; 

    }else{
        document.querySelector(".two p").style.transform = "scale(3)"; 
        document.querySelector(".two p").style.opacity = 0; 
    }

    // if..... 

    let catAngle = (1800/100 * percentage);
    document.querySelector("#cat").style.transform = "rotate(" + catAngle + "deg)"; 
})

