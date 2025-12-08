// Bring windows to front by raising z-index
let zCounter = 10;
let emailReplySent = false;
let mimaPosted = false;

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

// Desktop icons click -> open windows
document.querySelectorAll('.icon').forEach(icon => {
  icon.addEventListener('click', () => {
    const target = icon.dataset.window;
    openWindow(target);
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

// ================== FOLDER / IMAGE PREVIEW ==================

const folderItems = document.querySelectorAll('.folder-item');
const previewWindow = document.getElementById('image-preview-window');
const previewImg = document.getElementById('preview-image');

folderItems.forEach(item => {
  item.addEventListener('click', () => {
    const largeSrc = item.dataset.large;
    if (!largeSrc || !previewImg) return;
    previewImg.src = largeSrc;
    openWindow('image-preview-window');
  });
});

// ================== INBOX / MAIL CLIENT =====================

// Email contents data
const emailData = {
  m1: {
    from: 'manager@agency.jp',
    subject: "Today’s CHAM rehearsal",
    body:
      "Hi Mima,\n\nDon't forget rehearsal with CHAM this afternoon.\n" +
      "The fans are really excited for the show.\n\n- Manager"
  },
  m2: {
    from: 'staff@doublebind.tv',
    subject: "First day of shooting",
    body:
      "Dear Mima,\n\nWe’re looking forward to your first day on the set of \"Double Bind\".\n" +
      "Please arrive at 8:00 AM. Wardrobe will meet you at the entrance.\n\n- Production Staff"
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
  m5: {
    from: 'me-mania@fanmail.jp',
    subject: "That girl on TV isn't you, right?",
    body:
      "Mima,\n\nI watched \"Double Bind\" tonight. That girl they say is you...\n" +
      "She did such terrible things. That can't be you.\n" +
      "The real Mima would never do that.\n\nPlease tell me I'm right.\n\n- Me-Mania"
  },
  // This one will be used when he replies after your email
  m6: {
    from: 'me-mania@fanmail.jp',
    subject: "I'll save you, Mima",
    body:
      "Mima,\n\nThank you for telling me the truth. I knew it.\n" +
      "The one on TV isn't you. The real Mima is asking me for help.\n\n" +
      "Don't be afraid. I’ll save you. Just leave everything to me.\n\n" +
      "- Me-Mania"
  }
};

const mailRows = document.querySelectorAll('.mail-row');
const readFromEl = document.getElementById('read-from');
const readSubjectEl = document.getElementById('read-subject');
const readBodyEl = document.getElementById('read-body');
const replySection = document.getElementById('reply-section');

// helper to show email content
function displayEmail(id) {
  const data = emailData[id];
  if (!data) return;

  if (readFromEl) readFromEl.textContent = data.from;
  if (readSubjectEl) readSubjectEl.textContent = data.subject;
  if (readBodyEl) readBodyEl.textContent = data.body;

  // select row visually
  document.querySelectorAll('.mail-row').forEach(row =>
    row.classList.remove('selected')
  );
  const activeRow = document.querySelector(`.mail-row[data-id="${id}"]`);
  if (activeRow) activeRow.classList.add('selected');

  // Only show reply box when Me-Mania's original "isn't you" email is selected
  if (replySection) {
    if (id === 'm5') {
      replySection.classList.remove('hidden');
    } else {
      replySection.classList.add('hidden');
    }
  }
}

// initial selection
displayEmail('m5');

// row click
mailRows.forEach(row => {
  row.addEventListener('click', () => {
    displayEmail(row.dataset.id);
  });
});

// reply send logic
const sendBtn = document.getElementById('send-reply-btn');
const replyText = document.getElementById('reply-text');
const sendStatus = document.getElementById('send-status');

if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    if (emailReplySent) return; // prevent double send

    const text = replyText.value.trim();
    if (!text) return;

    const mailList = document.getElementById('mail-list');

    // Add outgoing "Re:" email from Mima
    if (mailList) {
      const sentRow = document.createElement('div');
      sentRow.classList.add('mail-row');
      sentRow.innerHTML = `
        <span class="ml-from">mima@idol.jp</span>
        <span class="ml-subject">Re: That girl on TV isn't you, right?</span>
        <span class="ml-date">03/18</span>
      `;
      mailList.appendChild(sentRow);
    }

    emailReplySent = true;
    if (sendStatus) {
      sendStatus.textContent = 'Email sent. Somewhere, a decision has been made.';
    }

    // After a small delay, add a new news headline about the diary site
    setTimeout(addDynamicNewsAfterEmail, 2500);

    // After another delay, Me-Mania sends a reply saying he'll save you
    setTimeout(addMeManiaReplyEmail, 4500);

    checkForEnding();
  });
}

// Me-Mania reply email appears after you send your message
function addMeManiaReplyEmail() {
  const mailList = document.getElementById('mail-list');
  if (!mailList) return;

  // Check if we've already added m6 row (avoid duplicate)
  if (document.querySelector('.mail-row[data-id="m6"]')) return;

  const replyRow = document.createElement('div');
  replyRow.classList.add('mail-row');
  replyRow.dataset.id = 'm6';
  replyRow.innerHTML = `
    <span class="ml-from">me-mania@fanmail.jp</span>
    <span class="ml-subject">I'll save you, Mima</span>
    <span class="ml-date">03/18</span>
  `;

  mailList.appendChild(replyRow);

  // Make this row clickable like the others
  replyRow.addEventListener('click', () => {
    displayEmail('m6');
  });

  // Auto-open his reply so the player sees it
  displayEmail('m6');
  // Also bring the inbox window to front in case it's hidden behind another window
  const inboxWindow = document.getElementById('inbox-window');
  if (inboxWindow) bringToFront(inboxWindow);
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
      "leaving fans divided between excitement and concern."
  },
  a2: {
    title: 'Mima joins TV drama \"Double Bind\"',
    body:
      "Mima Kirigoe has joined the cast of late-night psychological drama \"Double Bind\". " +
      "The series, known for its unsettling twists, marks a dramatic shift from her bright idol image."
  },
  a3: {
    title: 'CHAM breaks into Top 100',
    body:
      "Despite losing one of its original members, CHAM has climbed into the Top 100 charts " +
      "with their latest single. Industry watchers note that the group’s success mirrors the growing " +
      "pressure on solo idols to reinvent themselves."
  },
  a4: {
    title: 'Director of \"Double Bind\" murdered',
    body:
      "Takahashi, director of the cult series \"Double Bind\", was found dead in what investigators " +
      "have described as a brutal attack. Police are exploring possible connections to recent threats " +
      "sent to the show and its cast."
  },
  a5: {
    title: 'Celebrity photographer found dead',
    body:
      "Murano, a photographer notorious for pushing young stars into provocative shoots, has been " +
      "found murdered in his studio. Rumors suggest that one of his recent projects stirred " +
      "controversy among fans and industry insiders alike."
  },
  a6: {
    title: 'Police trace disturbing diary website',
    body:
      "Investigators have discovered an anonymous website that appears to document the daily life of " +
      "actress Mima Kirigoe in unsettling detail. Authorities believe the site may be connected to " +
      "ongoing violent incidents surrounding the show \"Double Bind\"."
  }
};

// handle clicks on headlines
document.querySelectorAll('.headline-card').forEach(card => {
  card.addEventListener('click', () => {
    const key = card.dataset.article;
    const article = newsArticles[key];
    if (!article || !newsArticleDisplay) return;

    newsArticleDisplay.innerHTML = `
      <h2>${article.title}</h2>
      <p>${article.body}</p>
    `;
  });
});

// Add dynamic news after email reply
function addDynamicNewsAfterEmail() {
  const list = document.getElementById('news-list');
  if (!list || newsArticles.a6.added) return;

  const card = document.createElement('article');
  card.classList.add('headline-card');
  card.dataset.article = 'a6';
  card.innerHTML = `
    <h2>Police trace disturbing diary site</h2>
    <p class="headline-sub">
      Investigators say an anonymous online diary may hold clues in recent murders.
    </p>
  `;
  list.appendChild(card);
  newsArticles.a6.added = true;

  card.addEventListener('click', () => {
    const article = newsArticles['a6'];
    if (!article || !newsArticleDisplay) return;
    newsArticleDisplay.innerHTML = `
      <h2>${article.title}</h2>
      <p>${article.body}</p>
    `;
  });
}

// show subtle message when scrolled to bottom of center column
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
    mimaPostsContainer.appendChild(article);

    mimaPosted = true;
    if (mimaPostStatus) {
      mimaPostStatus.textContent =
        'Entry posted. The online "Mima" feels more real than the one on TV.';
    }
    checkForEnding();
  });
}

// ================== SOFT ENDING =============================

function checkForEnding() {
  if (emailReplySent && mimaPosted) {
    const topBarRight = document.querySelector('.top-bar-right');
    if (topBarRight) {
      topBarRight.textContent = 'User: Rumi (?)';
    }

    const screen = document.querySelector('.screen');
    if (screen) {
      screen.style.backgroundColor = '#006060';
    }
  }
}

