document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("bgm");
  const pageWrapper = document.getElementById("page-wrapper");
  const popupLayer = document.getElementById("popup-layer");
  const loginOverlay = document.getElementById("login-overlay");
  const loginBtn = document.getElementById("login-btn");

  let meltdownStarted = false;
  let popupInterval = null;

  function tryStartMusic() {
    if (musicStarted || !audio) return;
    musicStarted = true;
    audio.volume = 0.9;
    audio.play().catch(() => {
     
    });
    document.removeEventListener("click", tryStartMusic);
    document.removeEventListener("keydown", tryStartMusic);
  }

  document.addEventListener("click", tryStartMusic);
  document.addEventListener("keydown", tryStartMusic);

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (audio && docHeight > 0) {
      const t = Math.min(Math.max(scrollTop / docHeight, 0), 1);
      const rate = 1 - 0.6 * t; 
      audio.playbackRate = rate;
    }

    if (!meltdownStarted && docHeight > 0) {
      const t = scrollTop / docHeight;
      if (t > 0.95) {
        startMeltdown();
      }
    }
  });

  // Popup (I AM MIMA)
  function createPopup() {
    if (!popupLayer) return;

    const popup = document.createElement("div");
    popup.className = "popup-window";

    const text = document.createElement("p");
    text.textContent = "I AM MIMA";

    // Popup image is created
    const img = document.createElement("img");
    img.src = "images/perfectblue.jpg"; 
    img.alt = "Fake Mima";

    popup.appendChild(text);
    popup.appendChild(img);

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const x = Math.random() * (vw - 240);
    const y = Math.random() * (vh - 150);

    popup.style.left = x + "px";
    popup.style.top = y + "px";

    popupLayer.appendChild(popup);
  }

  function placeRumiCenter() {
    if (!popupLayer) return;

    const rumi = document.createElement("div");
    rumi.className = "popup-window rumi-center";

    const text = document.createElement("p");
    text.textContent = "I AM MIMA";

    const img = document.createElement("img");
    img.src = "images/perfectblue.jpg"; 
    img.alt = "Rumi as Mima";

    rumi.appendChild(text);
    rumi.appendChild(img);
    popupLayer.appendChild(rumi);
  }

  function startMeltdown() {
    meltdownStarted = true;

    if (pageWrapper) {
      pageWrapper.classList.add("meltdown");
    }
    if (popupLayer) {
      popupLayer.classList.add("active");
    }

    // Spawn lots of popups repeatedly
    popupInterval = setInterval(createPopup, 220);

    setTimeout(placeRumiCenter, 1200);

    // Crash to login screen
    setTimeout(() => {
      if (popupInterval) clearInterval(popupInterval);
      if (pageWrapper) pageWrapper.classList.add("hidden");
      if (loginOverlay) loginOverlay.classList.remove("hidden");
    }, 7000);
  }

  // Login button 
  if (loginBtn) {
    loginBtn.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = "desktop.html";
    });
  }
});







