
const stage     = document.querySelector(".stage");
const infoBox   = document.getElementById("infoBox");

const hoursImg   = document.getElementById("hoursImg");
const minutesImg = document.getElementById("minutesImg");
const secondsImg = document.getElementById("secondsImg");

const hourSoundEl   = document.getElementById("hourSound");
const minuteSoundEl = document.getElementById("minuteSound");
const secondSoundEl = document.getElementById("secondSound");

const curtain    = document.querySelector(".rnOuter");
const openButton = document.getElementById("openCurtainBtn");


let hourNotes   = [];
let minuteNotes = [];
let secondNotes = [];


let lastH = 0;
let lastM = 0;
let lastS = 0;


let clockInterval = null;
let clockStarted  = false;


function repeat(n, action) {
  for (let i = 0; i < n; i++) {
    action(i);
  }
}


function playNoteSound(type) {
  let audioEl = null;
  if (type === "hours")   audioEl = hourSoundEl;
  if (type === "minutes") audioEl = minuteSoundEl;
  if (type === "seconds") audioEl = secondSoundEl;

  if (!audioEl) return;

  try {
    audioEl.currentTime = 0;
    audioEl.play().catch(() => {});
  } catch (e) {
    console.warn("Could not play sound:", e);
  }
}


function showInfo(text) {
  infoBox.textContent = text;
  infoBox.classList.add("visible");


  setTimeout(() => {
    infoBox.classList.remove("visible");
  }, 2500);
}


function createNote(imagePath, type) {
  const rect = stage.getBoundingClientRect();
  const noteSize = 40;

  const maxX = rect.width  - noteSize;
  const maxY = rect.height - noteSize;

  const img = document.createElement("img");
  img.classList.add("note");
  img.classList.add(`${type}-note`); 
  img.src = imagePath;
  img.alt = type + " note";

 
  let x = Math.random() * maxX;
  let y = Math.random() * maxY;


  let vx = (Math.random() * 2 + 0.5) * (Math.random() < 0.5 ? -1 : 1);
  let vy = (Math.random() * 2 + 0.5) * (Math.random() < 0.5 ? -1 : 1);

  img.style.left = x + "px";
  img.style.top  = y + "px";


  img.addEventListener("click", (event) => {
    event.stopPropagation();
    if (type === "hours") {
      showInfo(`Current hour: ${lastH} hour${lastH === 1 ? "" : "s"}.`);
    } else if (type === "minutes") {
      showInfo(`Current minute: ${lastM} minute${lastM === 1 ? "" : "s"}.`);
    } else if (type === "seconds") {
      showInfo(`Current second: ${lastS} second${lastS === 1 ? "" : "s"}.`);
    }
  });

  stage.appendChild(img);

  
  playNoteSound(type);

  return { el: img, x, y, vx, vy, type };
}


function updateCount(targetCount, notesArray, imagePath, type) {
  const current = notesArray.length;


  if (targetCount > current) {
    const toAdd = targetCount - current;
    repeat(toAdd, () => {
      const note = createNote(imagePath, type);
      notesArray.push(note);
    });
  }


  if (targetCount < current) {
    const toRemove = current - targetCount;
    for (let i = 0; i < toRemove; i++) {
      const note = notesArray.pop();
      note.el.remove();
    }
  }
}


function getTheTime() {
  let now = new Date(); 

  let h = now.getHours();     
  let m = now.getMinutes();   
  let s = now.getSeconds();  

  console.log(h, m, s);

  lastH = h;
  lastM = m;
  lastS = s;


  updateCount(h, hourNotes,   "images/whole.png",   "hours");


  updateCount(m, minuteNotes, "images/half.png",    "minutes");


  updateCount(s, secondNotes, "images/quarter.png", "seconds");
}


function animate() {
  const rect = stage.getBoundingClientRect();
  const noteSize = 40;
  const maxX = rect.width  - noteSize;
  const maxY = rect.height - noteSize;

  function moveAndBounce(note) {
    note.x += note.vx;
    note.y += note.vy;

 
    if (note.x <= 0) {
      note.x = 0;
      note.vx *= -1;
    } else if (note.x >= maxX) {
      note.x = maxX;
      note.vx *= -1;
    }


    if (note.y <= 0) {
      note.y = 0;
      note.vy *= -1;
    } else if (note.y >= maxY) {
      note.y = maxY;
      note.vy *= -1;
    }

    note.el.style.left = note.x + "px";
    note.el.style.top  = note.y + "px";
  }

  hourNotes.forEach(moveAndBounce);
  minuteNotes.forEach(moveAndBounce);
  secondNotes.forEach(moveAndBounce);

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);


if (openButton && curtain) {
  openButton.addEventListener("click", () => {
    curtain.classList.add("open");
    openButton.remove();

    if (!clockStarted) {
      getTheTime(); 
      clockInterval = setInterval(getTheTime, 1000);
      clockStarted = true;
    }
  });
}






