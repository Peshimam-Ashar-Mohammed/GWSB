/* ============================================
   FOR FILZ 🤍 — Interactive Logic
   ============================================ */

(function () {
  'use strict';

  // ─── Floating Hearts & Sparkles ───
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrameId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const PARTICLE_SYMBOLS = ['♡', '✦', '·', '♡', '✧', '♡', '·'];
  const PARTICLE_COLORS = [
    'rgba(255, 143, 171, 0.35)',
    'rgba(255, 179, 198, 0.3)',
    'rgba(251, 111, 146, 0.2)',
    'rgba(237, 222, 208, 0.4)',
    'rgba(255, 214, 224, 0.35)',
  ];

  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height; // start anywhere for initial fill
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 20;
      this.size = Math.random() * 16 + 10;
      this.speed = Math.random() * 0.5 + 0.2;
      this.drift = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.symbol = PARTICLE_SYMBOLS[Math.floor(Math.random() * PARTICLE_SYMBOLS.length)];
      this.color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
      this.wobblePhase = Math.random() * Math.PI * 2;
      this.wobbleSpeed = Math.random() * 0.01 + 0.005;
      this.wobbleAmount = Math.random() * 20 + 10;
    }

    update() {
      this.y -= this.speed;
      this.wobblePhase += this.wobbleSpeed;
      this.x += Math.sin(this.wobblePhase) * 0.3 + this.drift;

      if (this.y < -30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.font = `${this.size}px serif`;
      ctx.textAlign = 'center';
      ctx.fillText(this.symbol, this.x, this.y);
      ctx.restore();
    }
  }

  // Create particles — fewer on mobile for performance
  const particleCount = window.innerWidth < 600 ? 18 : 35;
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    animFrameId = requestAnimationFrame(animateParticles);
  }

  animateParticles();

  // ─── Card Toggle Logic ───
  const cards = document.querySelectorAll('.message-card');

  function hideAllCards() {
    cards.forEach((card) => {
      card.classList.add('hidden');
      card.classList.remove('show');
    });
  }

  function showCard(id) {
    const card = document.getElementById(id);
    if (!card) return;

    const wasVisible = !card.classList.contains('hidden');

    hideAllCards();

    if (wasVisible) return; // toggle off

    card.classList.remove('hidden');
    // Force reflow for animation
    void card.offsetWidth;
    card.classList.add('show');

    // Re-trigger message animations
    const msgs = card.querySelectorAll('.card-msg');
    msgs.forEach((msg) => {
      msg.style.animation = 'none';
      void msg.offsetWidth;
      msg.style.animation = '';
    });

    // Scroll into view
    setTimeout(() => {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }

  // Button: I don't feel well
  document.getElementById('btn-unwell').addEventListener('click', () => {
    showCard('card-unwell');
  });

  // Button: Exam stress
  document.getElementById('btn-exam').addEventListener('click', () => {
    showCard('card-exam');
  });

  // Card close buttons
  document.querySelectorAll('.card-close').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.message-card');
      card.classList.add('hidden');
      card.classList.remove('show');
    });
  });

  // ─── Letter Overlay ───
  const letterOverlay = document.getElementById('letter-overlay');
  const letterContent = document.getElementById('letter-content');
  const letterCursor = document.getElementById('letter-cursor');
  let typewriterTimeout;

  const letterText = `Filza,

I know today isn't easy… and tomorrow matters a lot.
But you don't have to carry everything at once.

Just breathe a little. Take it slow.

You care so much about everything you do…
and that's exactly why you'll be okay.

Even if today feels messy, it doesn't define you.

Good luck for tomorrow 🤍
And please take care of yourself…

Get well soon baddie 💅

— yours 🤍`;

  function typeWriter(text, element, cursorEl, index = 0) {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      typewriterTimeout = setTimeout(() => {
        typeWriter(text, element, cursorEl, index + 1);
      }, 35);

      // Auto-scroll letter container
      const container = element.closest('.letter-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    } else {
      // Done typing — hide cursor after a moment
      setTimeout(() => {
        cursorEl.style.display = 'none';
      }, 1500);
    }
  }

  function openLetter() {
    hideAllCards();
    letterContent.textContent = '';
    letterCursor.style.display = 'inline';
    letterOverlay.classList.remove('hidden');
    void letterOverlay.offsetWidth;
    letterOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Begin typewriter after the slide-up animation
    setTimeout(() => {
      typeWriter(letterText, letterContent, letterCursor);
    }, 600);
  }

  function closeLetter() {
    clearTimeout(typewriterTimeout);
    letterOverlay.classList.add('hidden');
    letterOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  document.getElementById('btn-letter').addEventListener('click', openLetter);
  document.getElementById('letter-close').addEventListener('click', closeLetter);

  // Close letter on backdrop click
  document.querySelector('.letter-backdrop').addEventListener('click', closeLetter);

  // Close letter on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLetter();
  });

  // ─── Surprise Toast ───
  const surpriseMessages = [
    'Baddie energy activated 💅',
    "You've got this, always",
    'Drink water right now 😤',
    "You're stronger than today",
    'Remember to breathe 🤍',
    'Someone is really proud of you',
    'You are enough, always ✨',
    'Take it one step at a time',
  ];

  const surpriseToast = document.getElementById('surprise-toast');
  const surpriseText = document.getElementById('surprise-text');
  let surpriseTimer;
  let lastSurpriseIndex = -1;

  function showSurprise() {
    // Pick a random message (avoid repeating the last one)
    let idx;
    do {
      idx = Math.floor(Math.random() * surpriseMessages.length);
    } while (idx === lastSurpriseIndex && surpriseMessages.length > 1);
    lastSurpriseIndex = idx;

    surpriseText.textContent = surpriseMessages[idx];
    surpriseToast.classList.remove('hidden');
    void surpriseToast.offsetWidth;
    surpriseToast.classList.add('show');

    clearTimeout(surpriseTimer);
    surpriseTimer = setTimeout(() => {
      surpriseToast.classList.remove('show');
    }, 2800);
  }

  document.getElementById('btn-surprise').addEventListener('click', showSurprise);

  // ─── Burst hearts on button click ───
  function burstHearts(x, y) {
    const burstCount = 6;
    for (let i = 0; i < burstCount; i++) {
      const heart = document.createElement('span');
      heart.textContent = ['♡', '🤍', '✧', '💕'][Math.floor(Math.random() * 4)];
      heart.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: ${Math.random() * 14 + 12}px;
        pointer-events: none;
        z-index: 999;
        opacity: 1;
        transition: all 1s ease-out;
      `;
      document.body.appendChild(heart);

      const angle = (Math.PI * 2 * i) / burstCount + Math.random() * 0.5;
      const dist = Math.random() * 60 + 40;

      requestAnimationFrame(() => {
        heart.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist - 30}px)`;
        heart.style.opacity = '0';
      });

      setTimeout(() => heart.remove(), 1100);
    }
  }

  // Attach burst to all mood buttons
  document.querySelectorAll('.mood-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      burstHearts(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  });
})();
