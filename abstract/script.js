
function createRandomShape() {
  const canvas = document.getElementById("canvas");
  const shape = document.createElement("div");

  const size = Math.floor(Math.random() * 80) + 20;

  const x = Math.floor(Math.random() * (canvas.clientWidth - size));
  const y = Math.floor(Math.random() * (canvas.clientHeight - size));

  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const color = `rgb(${r}, ${g}, ${b})`;

  const type = Math.floor(Math.random() * 3);


  shape.style.width = size + "px";
  shape.style.height = size + "px";
  shape.style.backgroundColor = color;
  shape.style.position = "absolute";
  shape.style.left = x + "px";
  shape.style.top = y + "px";

  if (type === 1) {
    shape.style.borderRadius = "50%";
  } else if (type === 2) {
    shape.style.height = size * 1.5 + "px"; 
  }

  canvas.appendChild(shape);
}

function makeArt() {
  const canvas = document.getElementById("canvas");
  canvas.innerHTML = "";

  for (let i = 0; i < 30; i++) {
    createRandomShape();
  }
}