// ===== GLOBAL FLAGS =====
let meltdownStarted = false;
let popupIntervalId = null;

// Images for the popups (replace with your real file paths)
const popupImages = [
  'images/fake-mima-1.jpg',
  'images/fake-mima-2.jpg',
  'images/fake-mima-3.jpg'
];

// Single Rumi-as-Mima image for the center popup
const rumiImage = 'images/rumi-as-mima.jpg';

// ===== MUSIC SCROLL SLOWDOWN =====

const bgMusic = document.getElementById('bg-music');

function updateMusicRateOnScroll() {
  if (!bgMusic) return;

  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop;
  const scrollHeight = doc.scrollHeight - doc.clientHeight;

  if (scrollHeight <= 0) return;

  const ratio = Math.min(scrollTop / scrollHeight, 1);
  // Start at 1.0, slow to ~0.4 as you reach bottom
  const rate = 1 - 0.6 * ratio;
  bgMusic.playbackRate = Math.max(rate, 0.4);
}

window.addEventListener('scroll', () => {
  updateMusicRateOnScroll();
  checkForMeltdownTrigger();
});

// Also update once at load
document.addEventListener('DOMContentLoaded', () => {
  updateMusicRateOnScroll();
});

// ===== MELTDOWN TRIGGER =====

function checkForMeltdownTrigger() {
  if (meltdownStarted) return;

  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop;
  const scrollHeight = doc.scrollHeight - doc.clientHeight;

  if (scrollHeight <= 0) return;

  const ratio = scrollTop / scrollHeight;

  // When scrolled ~80% down the page, start meltdown
  if (ratio > 0.8) {
    startMeltdown();
  }
}

// ===== POPUP CREATION =====

function createPopup(isCenter = false) {
  const popup = document.createElement('div');
  popup.classList.add('mima-popup');
  if (isCenter) {
    popup.classList.add('mima-popup-center');
  }

  let imgSrc;
  if (isCenter) {
    imgSrc = rumiImage;
  } else {
    const idx = Math.floor(Math.random() * popupImages.length);
    imgSrc = popupImages[idx];
  }

  popup.innerHTML = `
    <div class="popup-titlebar">
      <span>I_AM_MIMA.EXE</span>
      <span class="popup-close">×</span>
    </div>
    <div class="popup-content">
      <p class="popup-text">I AM MIMA</p>
      <img src="${imgSrc}" class="popup-polaroid" alt="Mima popup">
    </div>
  `;

  document.body.appendChild(popup);

  // Random position for normal popups
  if (!isCenter) {
    const width = 240;
    const height = 200;

    const maxX = Math.max(window.innerWidth - width - 10, 0);
    const maxY = Math.max(window.innerHeight - height - 10, 0);

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
  } else {
    // Center popup on screen
    const width = 280;
    const height = 220;
    const x = (window.innerWidth - width) / 2;
    const y = (window.innerHeight - height) / 2;
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
  }

  // Close button (if you want user to close them; can also leave them un-closeable)
  const closeBtn = popup.querySelector('.popup-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      popup.remove();
    });
  }
}

// ===== START MELTDOWN =====

function startMeltdown() {
  meltdownStarted = true;

  // Slow the music more dramatically
  if (bgMusic) {
    bgMusic.playbackRate = 0.4;
  }

  // Rapidly spawn popups
  let count = 0;
  const maxPopups = 25; // number of random popups

  popupIntervalId = setInterval(() => {
    createPopup(false);
    count += 1;

    if (count >= maxPopups) {
      clearInterval(popupIntervalId);

      // One big center popup (Rumi as Mima)
      createPopup(true);

      // After a short delay, show login screen (crash)
      setTimeout(showLoginScreen, 2000);
    }
  }, 200);
}

// ===== LOGIN SCREEN =====

const loginOverlay = document.getElementById('login-overlay');
const pageContent = document.getElementById('page-content');
const loginButton = document.getElementById('login-button');

function showLoginScreen() {
  if (pageContent) {
    pageContent.classList.add('hidden');
  }
  if (loginOverlay) {
    loginOverlay.classList.remove('hidden');
  }
}

if (loginButton) {
  loginButton.addEventListener('click', () => {
    // Send user to desktop.html (your Perfect OS desktop)
    window.location.href = 'desktop.html';
  });
}




