// ================== GLOBAL STATE ==================
let zCounter = 10;

// story flags
let mimaPosted = false;
let emailReplySent = false;
let firstMeMailAdded = false;
let firstMeReplyAdded = false;
let newsAfterFirstReplyAdded = false;
let photoMailAdded = false;
let photographerHeadlineAdded = false;
let finalMailAdded = false;
let identityReplySent = false;

// which mail is open
let currentMailId = null;

// ================== MUSIC PLAYER STATE ==================
// 3 visible tracks in the UI
let currentTrack = null;

const audioMap = {
  song1: new Audio('audio/nowembraced.mp3'),
  song2: new Audio('audio/aloneyetcalm.mp3'),
  song3: new Audio('audio/angeloflove.mp3')
};

// hidden nightmare track – NO visible tape/icon
const nightmareAudio = new Audio('audio/nightmare.mp3');

function stopAllMusic() {
  // stop visible tracks + nightmare
  const allAudios = [...Object.values(audioMap), nightmareAudio];
  allAudios.forEach(a => {
    a.pause();
    a.currentTime = 0;
  });

  currentTrack = null;

  document.querySelectorAll('.music-track.active').forEach(el =>
    el.classList.remove('active')
  );
}

function toggleTrack(id) {
  const audio = audioMap[id];
  if (!audio) return;

  const trackEl = document.querySelector(`.music-track[data-track="${id}"]`);

  // if this track is already playing -> stop it
  if (currentTrack === id && !audio.paused) {
    audio.pause();
    audio.currentTime = 0;
    currentTrack = null;
    if (trackEl) trackEl.classList.remove('active');
    return;
  }

  // otherwise stop everything (including nightmare) and start this one
  stopAllMusic();
  audio.play();
  currentTrack = id;
  if (trackEl) trackEl.classList.add('active');
}

// play nightmare.mp3 in the background (no visible tape)
function playNightmare() {
  stopAllMusic();          // kills any song + resets UI highlight
  nightmareAudio.loop = true;
  nightmareAudio.play();
}

// ================== WINDOW + ICON MANAGEMENT ==================
function bringToFront(win) {
  zCounter += 1;
  win.style.zIndex = zCounter;
}

function openWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;
  win.classList.remove('hidden');
  bringToFront(win);
}

function closeWindow(button) {
  const win = button.closest('.window');
  if (!win) return;
  win.classList.add('hidden');
}

// highlight desktop icon for a window (glow)
function highlightIconForWindow(windowId) {
  const icon = document.querySelector(`.icon[data-window="${windowId}"]`);
  if (icon) {
    icon.classList.add('icon-highlight');
  }
}

// Desktop icons click -> open windows + clear highlight
document.querySelectorAll('.icon').forEach(icon => {
  icon.addEventListener('click', () => {
    const target = icon.dataset.window;
    openWindow(target);
    icon.classList.remove('icon-highlight');
  });
});

// Window close buttons
document.querySelectorAll('.window-close').forEach(btn => {
  btn.addEventListener('click', () => closeWindow(btn));
});

// Clicking inside a window brings it to front
document.querySelectorAll('.window').forEach(win => {
  win.addEventListener('mousedown', () => bringToFront(win));
});

// ESC closes all windows
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.window').forEach(win => {
      win.classList.add('hidden');
    });
  }
});

// ================== IMAGE PREVIEW (FOLDER + RECYCLE) ==================

const previewWindow = document.getElementById('image-preview-window');
const previewImg = document.getElementById('preview-image');

function openPreviewFromItem(item) {
  if (!previewImg || !item) return;

  // 1) try data-large
  let src = item.dataset.large;

  // 2) fallback to the thumbnail img src
  if (!src || src.trim() === '') {
    const imgEl = item.querySelector('img');
    if (imgEl) src = imgEl.getAttribute('src');
  }

  if (!src) return;

  previewImg.src = src;
  openWindow('image-preview-window');
}

// folder thumbnails
document.querySelectorAll('.folder-item').forEach(item => {
  item.addEventListener('click', () => {
    openPreviewFromItem(item);
  });
});

// recycle bin items (images)
document.querySelectorAll('.deleted-item').forEach(item => {
  item.addEventListener('click', () => {
    openPreviewFromItem(item);

    // if it's the red dress, ramp the horror + show popup(s)
    if (item.classList.contains('deleted-red')) {
      startScreenShake();
      setTimeout(showIdentityPopup, 1500);
    }
  });
});

// ================== INBOX / MAIL CLIENT =====================

// Email contents data
const emailData = {
  m1: {
    from: 'chamlover2@fans.jp',
    subject: "Please don't leave Mima!",
    body:
      "Hi Mimarin,\n\nPlease don't leave Cham! You are my favorite and have always been.\n" +
      "Your fans need you!\n\n- chamlover2"
  },
  m2: {
    from: 'chamforev3r@fans.jp',
    subject: "I love you Mima",
    body:
      "Dear Mimarin,\n\nI love you so much Mima!\n" +
      "I am always looking at Mima's Room..\n\n- chamforev3r"
  },
  m3: {
    from: 'me-mania@fanmail.jp',
    subject: 'You were perfect tonight',
    body:
      "Mima,\n\nI watched your performance with CHAM again. You were perfect.\n" +
      "The real Mima is the one on stage, not on TV.\n\nYour biggest fan,\nMe-Mania"
  },
  m4: {
    from: 'me-mania@fanmail.jp',
    subject: 'The real Mima',
    body:
      "Mima,\n\nI saw the rumors online. Don't worry. I know the truth.\n" +
      "I know which one is really you.\n\n- Me-Mania"
  },
  // appears AFTER you post in Mima's Room
  m5: {
    from: 'me-mania@fanmail.jp',
    subject: "That girl on TV isn't you, right?",
    body:
      "Mimarin,\n\nI watched \"Double Bind\" tonight. That girl they say is you...\n" +
      "She did such terrible things. That can't be you.\n\n" +
      "That wasn’t you on the TV, right…? That’s an imposter.\n\n" +
      "Please tell me I'm right.\n\n- Me-Mania"
  },
  // reply after your prewritten message: "I'll take care of it."
  m6: {
    from: 'me-mania@fanmail.jp',
    subject: "I'll take care of it.",
    body:
      "Mimarin,\n\nThank you for telling me the truth.\n" +
      "I knew it. That one on TV is an imposter.\n\n" +
      "Don't worry. I'll take care of it.\n\n- Me-Mania"
  },
  // after the promiscuous photoshoot article
  m7: {
    from: 'me-mania@fanmail.jp',
    subject: "I'll keep your image pure",
    body:
      "Mimarin,\n\nI saw the photoshoot. Those pictures weren't really you.\n" +
      "I'll keep your image pure, Mimarin.\n" +
      "You won't have to do things like that anymore.\n\n- Me-Mania"
  },
  // final email from "mimakirigoe"
  m8: {
    from: 'mimakirigoe@mima-room.jp',
    subject: "who are you?",
    body:
      "who are you?"
  }
};

const mailRows = document.querySelectorAll('.mail-row');
const readFromEl = document.getElementById('read-from');
const readSubjectEl = document.getElementById('read-subject');
const readBodyEl = document.getElementById('read-body');
const replySection = document.getElementById('reply-section');
const replyToLabel = document.getElementById('reply-to-label');
const replyText = document.getElementById('reply-text');
const sendBtn = document.getElementById('send-reply-btn');
const sendStatus = document.getElementById('send-status');

function displayEmail(id) {
  const data = emailData[id];
  if (!data) return;
  currentMailId = id;

  if (readFromEl) readFromEl.textContent = data.from;
  if (readSubjectEl) readSubjectEl.textContent = data.subject;
  if (readBodyEl) readBodyEl.textContent = data.body;

  // visual selection
  document.querySelectorAll('.mail-row').forEach(row =>
    row.classList.remove('selected')
  );
  const activeRow = document.querySelector(`.mail-row[data-id="${id}"]`);
  if (activeRow) activeRow.classList.add('selected');

  // Default: hide reply box
  replySection.classList.add('hidden');

  // When the new Me-Mania TV email appears (m5), allow reply with your prewritten text
  if (id === 'm5') {
    replySection.classList.remove('hidden');
    replyToLabel.textContent = emailData[id].from;
    replyText.readOnly = true;
    replyText.value =
`You believe me right? She’s an imposter! It’s not me! I trust you, Mr. ME-MANIA. I’ll always be with you and I’ll never change! Not a bit! But I have a problem… It’s that imposter. She keeps getting in my way! I don’t know what to do… You’re the only one I can depend on…`;
  }

  // Final email: mimic identity breakdown reply
  if (id === 'm8') {
    replySection.classList.remove('hidden');
    replyToLabel.textContent = emailData[id].from;
    replyText.readOnly = true;
    replyText.value = "I AM MIMA. I AM AN IDOL. I AM THE REAL MIMA.";
  }

  // When reading m7, later we trigger photographer murder news
  if (id === 'm7' && !photographerHeadlineAdded) {
    setTimeout(addPhotographerMurderNews, 1800);
  }
}

// initial selection (just some innocent fan mail)
displayEmail('m3');

// click rows
mailRows.forEach(row => {
  row.addEventListener('click', () => {
    displayEmail(row.dataset.id);
  });
});

// add Me-Mania "TV imposter" email AFTER posting in Mima's Room
function addNewMeManiaEmail() {
  if (firstMeMailAdded) return;
  const mailList = document.getElementById('mail-list');
  if (!mailList) return;

  const row = document.createElement('div');
  row.classList.add('mail-row');
  row.dataset.id = 'm5';
  row.innerHTML = `
    <span class="ml-from">me-mania@fanmail.jp</span>
    <span class="ml-subject">That girl on TV isn't you, right?</span>
    <span class="ml-date"></span>
  `;
  mailList.appendChild(row);

  row.addEventListener('click', () => displayEmail('m5'));

  firstMeMailAdded = true;

  // highlight Inbox icon instead of auto-opening
  highlightIconForWindow('inbox-window');
}

// Me-Mania reply: "I'll take care of it."
function addMeManiaFirstReply() {
  if (firstMeReplyAdded) return;
  const mailList = document.getElementById('mail-list');
  if (!mailList) return;

  const row = document.createElement('div');
  row.classList.add('mail-row');
  row.dataset.id = 'm6';
  row.innerHTML = `
    <span class="ml-from">me-mania@fanmail.jp</span>
    <span class="ml-subject">I'll take care of it.</span>
    <span class="ml-date"></span>
  `;
  mailList.appendChild(row);
  row.addEventListener('click', () => displayEmail('m6'));

  firstMeReplyAdded = true;
  displayEmail('m6');

  // highlight Inbox icon for new mail
  highlightIconForWindow('inbox-window');
}

// Me-Mania mail after the promiscuous photoshoot article
function addMeManiaPhotoshootEmail() {
  if (photoMailAdded) return;
  const mailList = document.getElementById('mail-list');
  if (!mailList) return;

  const row = document.createElement('div');
  row.classList.add('mail-row');
  row.dataset.id = 'm7';
  row.innerHTML = `
    <span class="ml-from">me-mania@fanmail.jp</span>
    <span class="ml-subject">I'll keep your image pure</span>
    <span class="ml-date"></span>
  `;
  mailList.appendChild(row);
  row.addEventListener('click', () => displayEmail('m7'));

  photoMailAdded = true;
  displayEmail('m7');

  // highlight Inbox icon
  highlightIconForWindow('inbox-window');
}

// Final "who are you?" email
function addFinalIdentityMail() {
  if (finalMailAdded) return;
  const mailList = document.getElementById('mail-list');
  if (!mailList) return;

  const row = document.createElement('div');
  row.classList.add('mail-row');
  row.dataset.id = 'm8';
  row.innerHTML = `
    <span class="ml-from">mimakirigoe@mima-room.jp</span>
    <span class="ml-subject">who are you?</span>
    <span class="ml-date"></span>
  `;
  mailList.appendChild(row);
  row.addEventListener('click', () => displayEmail('m8'));

  finalMailAdded = true;
  displayEmail('m8');

  // highlight Inbox icon
  highlightIconForWindow('inbox-window');

  // 🔊 stop any current music and start hidden nightmare.mp3
  playNightmare();
}

// reply send logic (context based on currentMailId)
if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    if (!currentMailId) return;

    // FIRST REPLY TO ME-MANIA (m5)
    if (currentMailId === 'm5' && !emailReplySent) {
      const mailList = document.getElementById('mail-list');
      if (mailList) {
        const sentRow = document.createElement('div');
        sentRow.classList.add('mail-row');
        sentRow.innerHTML = `
          <span class="ml-from">mima@idol.jp</span>
          <span class="ml-subject">Re: That girl on TV isn't you, right?</span>
          <span class="ml-date"></span>
        `;
        mailList.appendChild(sentRow);
      }

      emailReplySent = true;
      if (sendStatus) {
        sendStatus.textContent = 'Email sent.';
      }

      // clear the reply text + hide box after sending
      if (replyText) replyText.value = '';
      if (replySection) replySection.classList.add('hidden');

      // Me-Mania: "I'll take care of it."
      setTimeout(addMeManiaFirstReply, 2000);
      // after that, news updates with director murder + photoshoot
      setTimeout(addDynamicNewsAfterEmail, 3500);

      checkForEnding();
      return;
    }

    // FINAL IDENTITY REPLY (m8)
    if (currentMailId === 'm8' && !identityReplySent) {
      identityReplySent = true;
      if (sendStatus) {
        sendStatus.textContent = 'Message sent.';
      }

      // clear reply text + hide
      if (replyText) replyText.value = '';
      if (replySection) replySection.classList.add('hidden');

      startScreenShake();
      highlightRecycleBin();
      setTimeout(showIdentityPopup, 800);
      return;
    }
  });
}

// ================== NEWS / FRONT PAGE =======================

const newsArticleDisplay = document.getElementById('news-article-display');
const newsBodyContainer = document.querySelector('.news-main');
const newsEndMessage = document.getElementById('news-end-message');

const newsArticles = {
  a1: {
    title: 'Mima departs CHAM',
    body:
      "Former pop idol Mima Kirigoe has officially left the pop trio CHAM. " +
      "Her management announced that she will be focusing on an acting career, " +
      "leaving fans divided between excitement and concern.",
    image: 'images/news_mima_departs.jpg'
  },
  a2: {
    title: 'Mima joins TV drama "Double Bind"',
    body:
      "Mima Kirigoe has joined the cast of late-night psychological drama \"Double Bind\". " +
      "The series, known for its unsettling twists, marks a dramatic shift from her bright idol image.",
    image: 'images/news_double_bind.jpg'
  },
  a3: {
    title: 'Scenes of Mima in "Double Bind" disturb viewers!',
    body:
      "Graphic and unsettling scenes featuring Mima’s character have shocked late-night audiences. " +
      "Ratings continue to climb, but fans from her idol days voice outrage, claiming the role is 'not the real Mima'.",
    image: 'images/news_double_bind_scenes.jpg'
  },
  a4: {
    title: 'Director of "Double Bind" murdered',
    body:
      "Takahashi, director of the cult series \"Double Bind\", was found dead in what investigators " +
      "have described as a brutal attack. Police are exploring possible connections to recent threats " +
      "sent to the show and its cast.",
    image: 'images/news_director_murdered.jpg'
  },
  a5: {
    title: 'Mima shocks fans with promiscuous photoshoot post actress debut',
    body:
      "New photos released from a controversial photoshoot show former idol Mima Kirigoe in provocative poses. " +
      "Fans are divided between support for her acting career and anger over what they see as a betrayal of her 'pure' image.",
    image: 'images/news_photoshoot.jpg'
  },
  a6: {
    title: 'Famous celebrity photographer murdered',
    body:
      "A celebrity photographer known for pushing young stars into provocative shoots has been found murdered " +
      "in his studio. Authorities note eerie parallels to other recent deaths surrounding actress Mima Kirigoe.",
    image: 'images/news_photographer_murdered.jpg'
  }
};


// handle clicks on headlines
function handleHeadlineClick(card) {
  const key = card.dataset.article;
  const article = newsArticles[key];
  if (!article || !newsArticleDisplay) return;

  let html = `<h2>${article.title}</h2>`;

  // If an image is defined, show it
  if (article.image) {
    html += `
      <div class="news-article-image-wrapper">
        <img src="${article.image}" alt="${article.title}">
      </div>
    `;
  }

  html += `<p>${article.body}</p>`;

  newsArticleDisplay.innerHTML = html;


  // After photoshoot article (a5) is read, add Me-Mania "pure image" mail
  if (key === 'a5' && !photoMailAdded) {
    setTimeout(addMeManiaPhotoshootEmail, 1200);
  }

  // After photographer murder article (a6) is read, add final identity mail
  if (key === 'a6' && !finalMailAdded) {
    setTimeout(addFinalIdentityMail, 1500);
  }
}

document.querySelectorAll('.headline-card').forEach(card => {
  card.addEventListener('click', () => handleHeadlineClick(card));
});

// Add dynamic news after first Me-Mania reply
function addDynamicNewsAfterEmail() {
  if (newsAfterFirstReplyAdded) return;
  const list = document.getElementById('news-list');
  if (!list) return;

  // Director murdered
  const card4 = document.createElement('article');
  card4.classList.add('headline-card');
  card4.dataset.article = 'a4';
  card4.innerHTML = `
    <h2>Director of "Double Bind" murdered</h2>
    <p class="headline-sub">
      Police investigate shocking death of Takahashi, director of the hit series.
    </p>
  `;
  list.appendChild(card4);
  card4.addEventListener('click', () => handleHeadlineClick(card4));

  // Promiscuous photoshoot
  const card5 = document.createElement('article');
  card5.classList.add('headline-card');
  card5.dataset.article = 'a5';
  card5.innerHTML = `
    <h2>Mima shocks fans with promiscuous photoshoot post actress debut</h2>
    <p class="headline-sub">
      Former idol’s provocative new image leaves longtime fans reeling.
    </p>
  `;
  list.appendChild(card5);
  card5.addEventListener('click', () => handleHeadlineClick(card5));

  newsAfterFirstReplyAdded = true;

  // highlight NEWS icon instead of auto-opening
  highlightIconForWindow('news-window');
}

// Photographer murdered headline
function addPhotographerMurderNews() {
  if (photographerHeadlineAdded) return;
  const list = document.getElementById('news-list');
  if (!list) return;

  const card6 = document.createElement('article');
  card6.classList.add('headline-card');
  card6.dataset.article = 'a6';
  card6.innerHTML = `
    <h2>Famous celebrity photographer murdered</h2>
    <p class="headline-sub">
      Murano, known for provocative shoots, discovered killed in his studio.
    </p>
  `;
  list.appendChild(card6);
  card6.addEventListener('click', () => handleHeadlineClick(card6));

  photographerHeadlineAdded = true;

  // highlight NEWS icon instead of auto-opening
  highlightIconForWindow('news-window');
}

// subtle end message when scrolling
if (newsBodyContainer && newsEndMessage) {
  newsBodyContainer.addEventListener('scroll', () => {
    const { scrollTop, clientHeight, scrollHeight } = newsBodyContainer;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      newsEndMessage.classList.remove('hidden');
    }
  });
}

// ================== MIMA'S ROOM =============================

const mimaPostBtn = document.getElementById('mima-post-btn');
const mimaNewPost = document.getElementById('mima-new-post');
const mimaPostStatus = document.getElementById('mima-post-status');
const mimaPostsContainer = document.getElementById('mima-posts');

if (mimaPostBtn) {
  mimaPostBtn.addEventListener('click', () => {
    if (mimaPosted) return;

    const text = mimaNewPost.value.trim();
    if (!text) return;

    const article = document.createElement('article');
    article.classList.add('mima-post', 'mima-entry');

    const title = document.createElement('h2');
    title.classList.add('mima-date');
    title.textContent = 'New Entry';

    const body = document.createElement('p');
    body.classList.add('mima-text');
    body.textContent = text;

    article.appendChild(title);
    article.appendChild(body);
    if (mimaPostsContainer) {
      mimaPostsContainer.appendChild(article);
    }

    // clear the textbox after posting
    if (mimaNewPost) {
      mimaNewPost.value = '';
    }

    // Trigger new Me-Mania email
    addNewMeManiaEmail();
    checkForEnding();
  });
}

// ================== SOFT ENDING / USERNAME HINT =============================

function checkForEnding() {
  if (emailReplySent && mimaPosted) {
    const topBarRight = document.querySelector('.top-bar-right');
    if (topBarRight) {
      topBarRight.textContent = 'User: **m*';
      topBarRight.classList.add('shake-username');
    }

    const screen = document.querySelector('.screen');
    if (screen) {
      screen.style.backgroundColor = '#006060';
    }
  }
}

// ================== SHAKE + "ARE YOU MIMA?" POPUPS =============================

function startScreenShake() {
  const screen = document.querySelector('.screen');
  const userLabel = document.querySelector('.top-bar-right');
  if (screen) screen.classList.add('shake');
  if (userLabel) userLabel.classList.add('shake');
}

function highlightRecycleBin() {
  const binIcon = document.querySelector('.icon[data-window="recycle-window"]');
  if (binIcon) {
    binIcon.classList.add('icon-highlight');
  }
}

// spawn MANY "Are you Mima?" windows randomly over the screen
function showIdentityPopup() {
  const template = document.getElementById('identity-popup');
  const screen = document.querySelector('.screen');
  if (!template || !screen) return;

  const screenRect = screen.getBoundingClientRect();
  const popupCount = 6; // number of popups to spawn

  for (let i = 0; i < popupCount; i++) {
    const clone = template.cloneNode(true);
    clone.id = ''; // prevent duplicate IDs
    clone.classList.remove('hidden');
    clone.classList.add('identity-popup-instance');

    clone.style.position = 'absolute';

    const approxWidth = 260;
    const approxHeight = 160;

    const maxLeft = Math.max(0, screenRect.width - approxWidth);
    const maxTop = Math.max(0, screenRect.height - approxHeight);

    const left = Math.random() * maxLeft;
    const top = Math.random() * maxTop;

    clone.style.left = left + 'px';
    clone.style.top = top + 'px';

    screen.appendChild(clone);
    bringToFront(clone);

    // YES buttons on each popup -> ending.html (or your link)
    clone.querySelectorAll('.identity-yes').forEach(btn => {
      btn.addEventListener('click', () => {
        window.location.href = 'https://www.youtube.com/watch?v=H10FZubVQzg';
      });
    });
  }
}

// ================== MUSIC TRACK CLICK HANDLERS ==================
document.querySelectorAll('.music-track').forEach(track => {
  track.addEventListener('click', () => {
    const id = track.dataset.track;
    toggleTrack(id);
  });
});




