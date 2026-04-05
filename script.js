/* =====================
   Valentine's Day JS
   ===================== */

// ── Floating Hearts ──────────────────────────────────────────────
const heartEmojis = ['💕', '💗', '💓', '💖', '💝', '🌸', '✿', '💞', '🩷'];

function initFloatingHearts() {
  const bg = document.getElementById('heartsBg');
  for (let i = 0; i < 28; i++) {
    const h = document.createElement('div');
    h.className = 'heart-float';
    h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    h.style.left = Math.random() * 100 + '%';
    h.style.fontSize = (14 + Math.random() * 18) + 'px';
    const dur = 8 + Math.random() * 14;
    h.style.animationDuration = dur + 's';
    h.style.animationDelay = -(Math.random() * dur) + 's';
    bg.appendChild(h);
  }
}

// ── Confetti Burst ───────────────────────────────────────────────
const confettiColors = ['#ff6b9d', '#ff8fab', '#ffd6e5', '#c9184a', '#ffb3c6', '#e63966'];

function burst(x, y) {
  for (let i = 0; i < 20; i++) {
    const c = document.createElement('div');
    c.className = 'confetti-piece';
    c.style.left = x + 'px';
    c.style.top = y + 'px';
    c.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    c.style.marginLeft = (Math.random() - 0.5) * 120 + 'px';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 1600);
  }
}

// ── Unlock / Reveal ──────────────────────────────────────────────
function unlock() {
  const lockScreen = document.getElementById('lock-screen');
  const main = document.getElementById('main');

  lockScreen.classList.add('gone');
  main.classList.add('visible');

  burst(window.innerWidth / 2, window.innerHeight / 2);

  setTimeout(() => lockScreen.remove(), 900);
}

// ── Reasons I Love You ───────────────────────────────────────────
const reasons = [
  { emoji: '😂', text: 'The way you laugh at everything — including your own jokes' },
  { emoji: '🤗', text: 'Your hugs that make everything instantly better' },
  { emoji: '✨', text: 'How you light up every room you walk into' },
  { emoji: '💪', text: 'Your strength — you handle anything with such grace' },
  { emoji: '🎯', text: 'How you always know exactly what to say' },
  { emoji: '🌈', text: 'The way you make even boring moments feel like adventures' },
  { emoji: '💭', text: 'Your beautiful mind and the way you see the world' },
  { emoji: '🥰', text: 'Simply for being the most wonderful you' },
];

function initReasons() {
  const grid = document.getElementById('reasons');
  reasons.forEach((r) => {
    const card = document.createElement('div');
    card.className = 'reason-card';
    card.innerHTML = `
      <span class="reason-num">${r.emoji}</span>
      <p class="reason-text">${r.text}</p>
    `;
    card.addEventListener('click', (e) => burst(e.clientX, e.clientY));
    grid.appendChild(card);
  });
}

// ── Photo Gallery ────────────────────────────────────────────────

// ✏️ STEP 1 — Add your image filenames here (put your photos in the images/ folder)
const photoImages = [
  'images/photo2.jpg',   // 👈 replace with your actual filename e.g. 'images/us_paris.jpg'
  'images/photo1.jpg',   // 👈 replace with your actual filename
  'images/photo3.jpg',   // 👈 replace with your actual filename
];

// ✏️ STEP 2 — Change these captions to match your photos
const photoCaptions = [
  'Our first memory 📸',
  'My favourite smile 🥰',
  'Us being us 💕',
];

// Renders an image inside a slot
function showImage(slot, src) {
  slot.innerHTML = '';
  const img = document.createElement('img');
  img.src = src;
  img.alt = 'Our photo';
  slot.appendChild(img);
}

function initPhotoSlots() {
  const grid = document.getElementById('photosGrid');

  photoCaptions.forEach((caption, index) => {
    const slot = document.createElement('div');
    slot.className = 'photo-slot';

    // Load the fixed image
    showImage(slot, photoImages[index]);

    const wrapper = document.createElement('div');
    wrapper.appendChild(slot);

    const cap = document.createElement('p');
    cap.className = 'photo-caption';
    cap.textContent = caption;
    wrapper.appendChild(cap);

    grid.appendChild(wrapper);
  });
}

// ── Init Everything ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initFloatingHearts();
  initReasons();
  initPhotoSlots();
});
