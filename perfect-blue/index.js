document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("bgm");
  const pageWrapper = document.getElementById("page-wrapper");
  const popupLayer = document.getElementById("popup-layer");
  const loginOverlay = document.getElementById("login-overlay");
  const loginBtn = document.getElementById("login-btn");

  let musicStarted = false;
  let meltdownStarted = false;
  let popupInterval = null;

  /* ====== START MUSIC ON FIRST USER ACTION ====== */
  function tryStartMusic() {
    if (musicStarted || !audio) return;
    musicStarted = true;
    audio.volume = 0.9;
    audio.play().catch(() => {
      // autoplay might be blocked; that's ok
    });
    document.removeEventListener("click", tryStartMusic);
    document.removeEventListener("keydown", tryStartMusic);
  }

  document.addEventListener("click", tryStartMusic);
  document.addEventListener("keydown", tryStartMusic);

  /* ====== SCROLL -> SLOW DOWN MUSIC + TRIGGER MELTDOWN NEAR BOTTOM ====== */
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Slow down music as you scroll down
    if (audio && docHeight > 0) {
      const t = Math.min(Math.max(scrollTop / docHeight, 0), 1);
      const rate = 1 - 0.6 * t; // from 1.0 down to 0.4
      audio.playbackRate = rate;
    }

    // Trigger meltdown when near bottom of page
    if (!meltdownStarted && docHeight > 0) {
      const t = scrollTop / docHeight;
      if (t > 0.95) {
        startMeltdown();
      }
    }
  });

  /* ====== POPUP CREATION (I AM MIMA WINDOWS) ====== */
  function createPopup() {
    if (!popupLayer) return;

    const popup = document.createElement("div");
    popup.className = "popup-window";

    const text = document.createElement("p");
    text.textContent = "I AM MIMA";

    // 🔽 THIS IS WHERE THE POPUP IMAGE IS CREATED
    const img = document.createElement("img");
    img.src = "images/perfectblue.jpg"; // make sure this file exists!
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

  /* ====== CENTER RUMI-AS-MIMA POPUP ====== */
  function placeRumiCenter() {
    if (!popupLayer) return;

    const rumi = document.createElement("div");
    rumi.className = "popup-window rumi-center";

    const text = document.createElement("p");
    text.textContent = "I AM MIMA";

    const img = document.createElement("img");
    img.src = "images/perfectblue.jpg"; // or another Rumi/Mima image
    img.alt = "Rumi as Mima";

    rumi.appendChild(text);
    rumi.appendChild(img);
    popupLayer.appendChild(rumi);
  }

  /* ====== START MELTDOWN SEQUENCE ====== */
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

    // Place Rumi in the center shortly after
    setTimeout(placeRumiCenter, 1200);

    // After a while, "crash" to login screen
    setTimeout(() => {
      if (popupInterval) clearInterval(popupInterval);
      if (pageWrapper) pageWrapper.classList.add("hidden");
      if (loginOverlay) loginOverlay.classList.remove("hidden");
    }, 7000);
  }

  /* ====== LOGIN BUTTON ====== */
  if (loginBtn) {
    loginBtn.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = "desktop.html";
    });
  }
});







