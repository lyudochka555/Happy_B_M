/* ============================================================
   1. ПОЯВЛЕНИЕ КАРТОЧЕК ПРИ СКРОЛЛЕ
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  reveals.forEach(el => obs.observe(el));

  setTimeout(() => {
    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) el.classList.add('visible');
    });
  }, 100);

  document.querySelector('.scroll-down').addEventListener('click', () => {
    document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });
  });
});

/* ============================================================
   2. ФОНОВЫЕ СТИКЕРЫ
   ============================================================ */
(function initBgPetals() {
  const container = document.getElementById('bgPetals');
  const symbols = ['✦', '✧', '★', '☆', '❤', '✿', '❀']; 
  for (let i = 0; i < 25; i++) {
    const el = document.createElement('div');
    el.className = 'bg-petal';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = (14 + Math.random() * 20) + 'px'; 
    el.style.animationDuration = (12 + Math.random() * 18) + 's';
    el.style.animationDelay = (-Math.random() * 20) + 's';
    container.appendChild(el);
  }
})();

/* ============================================================
   3. ТОСТЫ
   ============================================================ */
const toast = document.getElementById('toast');
let toastTimer;
function showToast(text) {
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

/* ============================================================
   4. КОНФЕТТИ И САЛЮТ
   ============================================================ */
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animId = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const colors = ['#ff4e72', '#ff8a5c', '#9d4edd', '#ffffff', '#f6d365'];
const fireworkColors = ['#ff4e72', '#ff8a5c', '#9d4edd', '#ffffff', '#f6d365'];

function drawHeart(x, y, size, rotation) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rotation); ctx.scale(size / 20, size / 20);
  ctx.beginPath(); ctx.moveTo(0, 6);
  ctx.bezierCurveTo(-12, -6, -20, -2, -20, 8); ctx.bezierCurveTo(-20, 16, -8, 22, 0, 28);
  ctx.bezierCurveTo(8, 22, 20, 16, 20, 8); ctx.bezierCurveTo(20, -2, 12, -6, 0, 6);
  ctx.fill(); ctx.restore();
}

function updateAndDrawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.vy += p.gravity; p.vx *= p.friction; p.vy *= p.friction;
    p.x += p.vx; p.y += p.vy; p.rotation += p.rotSpeed; p.life -= p.decay;

    if (p.life <= 0) { particles.splice(i, 1); continue; }

    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;

    if (p.isFirework) {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
    } else {
      if (p.shape === 'circle') {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2); ctx.fill();
      } else if (p.shape === 'heart') {
        drawHeart(p.x, p.y, p.size, p.rotation);
      } else {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation); ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2); ctx.restore();
      }
    }
  }

  if (particles.length > 0) animId = requestAnimationFrame(updateAndDrawParticles);
  else { ctx.clearRect(0, 0, canvas.width, canvas.height); animId = null; }
}

function startAnimation() { if (!animId) animId = requestAnimationFrame(updateAndDrawParticles); }

window.launchConfetti = function (count = 100, x = window.innerWidth / 2, y = window.innerHeight / 2) {
  const shapes = ['circle', 'rect', 'heart'];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 5 + Math.random() * 10;
    particles.push({
      x: x, y: y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 3,
      gravity: 0.2, friction: 0.98, decay: 0.01, size: 5 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.3,
      shape: shapes[Math.floor(Math.random() * shapes.length)], life: 1, isFirework: false
    });
  }
  startAnimation();
};

window.launchFireworks = function () {
  let fireworkCount = 0;
  const interval = setInterval(() => {
    const fx = window.innerWidth * (0.2 + Math.random() * 0.6);
    const fy = window.innerHeight * (0.1 + Math.random() * 0.4);
    const fireworkColor = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 2;
      particles.push({
        x: fx, y: fy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        gravity: 0.06, friction: 0.96, decay: 0.015, size: 2 + Math.random() * 3,
        color: fireworkColor, rotation: 0, rotSpeed: 0, life: 1, isFirework: true
      });
    }
    startAnimation();
    fireworkCount++;
    if (fireworkCount >= 7) clearInterval(interval);
  }, 350);
};

/* ============================================================
   5. ИГРА (Логика из твоего исходника)
   ============================================================ */
(function initGame() {
  const area = document.getElementById('gameArea');
  const basket = document.getElementById('gameBasket');
  const scoreEl = document.getElementById('gameScore');
  const timeEl = document.getElementById('gameTime');
  const overlay = document.getElementById('gameStartOverlay');
  
  let score = 0, timeLeft = 15, isPlaying = false;
  let items = [], gameLoopId, spawnInterval, timerInterval;
  let basketX = 50;

  const goodEmojis = ['🌹', '🌺', '🌷', '🌸', '🏵️', '🌻', '🌼', '💐'];
  const badEmoji = '🌵';

  // Четкое движение корзины за пальцем/мышкой
  function moveBasket(e) {
    if (!isPlaying) return;
    const rect = area.getBoundingClientRect();
    let clientX = e.clientX;
    if (e.touches) clientX = e.touches[0].clientX; // Для тач-экранов
    
    let x = clientX - rect.left;
    basketX = Math.max(5, Math.min(95, (x / rect.width) * 100));
    basket.style.left = basketX + '%';
  }

  area.addEventListener('mousemove', moveBasket);
  area.addEventListener('touchmove', (e) => { 
    moveBasket(e); 
  }, { passive: true });

  function spawnItem() {
    if (!isPlaying) return;
    const el = document.createElement('div');
    el.className = 'game-item';
    const isBad = Math.random() < 0.22;
    el.textContent = isBad ? badEmoji : goodEmojis[Math.floor(Math.random() * goodEmojis.length)];
    
    const x = 10 + Math.random() * 80;
    el.style.left = x + '%';
    el.style.top = '-40px';
    area.appendChild(el);

    items.push({ el, x, y: -40, speed: 2 + Math.random() * 3, isBad });
  }

  function updateGame() {
    if (!isPlaying) return;
    
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    // Чуть увеличил зону захвата для удобства
    const hitZone = isTouch ? 12 : 8; 

    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      item.y += item.speed;
      item.el.style.top = item.y + 'px';
      const areaH = area.offsetHeight;
      
      if (item.y > areaH - 80 && item.y < areaH && Math.abs(item.x - basketX) < hitZone) {
        if (item.isBad) { score = Math.max(0, score - 5); }
        else { score += 10; }
        scoreEl.textContent = `Счёт: ${score}`;
        item.el.remove();
        items.splice(i, 1);
        continue;
      }
      if (item.y > areaH) { item.el.remove(); items.splice(i, 1); }
    }
    gameLoopId = requestAnimationFrame(updateGame);
  }

  function startGame() {
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    clearInterval(spawnInterval); clearInterval(timerInterval);
    score = 0; timeLeft = 15; isPlaying = true;
    scoreEl.textContent = `Счёт: ${score}`;
    timeEl.textContent = `Время: ${timeLeft}с`;
    overlay.classList.add('hidden');
    items.forEach(i => i.el.remove()); items = [];
    basketX = 50; basket.style.left = '50%';

    spawnInterval = setInterval(spawnItem, 650); // Чуть чаще спавн
    timerInterval = setInterval(() => {
      timeLeft--;
      timeEl.textContent = `Время: ${timeLeft}с`;
      if (timeLeft <= 0) endGame();
    }, 1000);
    updateGame();
  }

  function endGame() {
    isPlaying = false; 
    clearInterval(spawnInterval); clearInterval(timerInterval);
    cancelAnimationFrame(gameLoopId); 
    items.forEach(i => i.el.remove()); items = [];
    overlay.classList.remove('hidden');
    overlay.innerHTML = `<div class="center" style="padding:20px;">
      <h3 style="margin-bottom:15px; font-family:'Cormorant Garamond'; font-size:1.8rem; font-weight:700; color:#2d1b36;">Твой счёт: ${score}</h3>
      <button class="btn" id="gameRestartBtn">Ещё раз</button>
    </div>`;
    document.getElementById('gameRestartBtn').addEventListener('click', () => {
      overlay.innerHTML = `<button class="btn" id="gameStartBtn">Играть</button>`;
      document.getElementById('gameStartBtn').addEventListener('click', startGame);
    });
  }
  document.getElementById('gameStartBtn').addEventListener('click', startGame);
})();

/* ============================================================
   6. КНОПКИ, САЛЮТ, НАСТРОЕНИЕ
   ============================================================ */
document.getElementById('partyBtn').addEventListener('click', () => {
  window.launchFireworks();
  showToast('С днём рождения, Маша! 💗');
});

document.getElementById('nameTrigger').addEventListener('click', (e) => {
  window.launchConfetti(60, e.clientX, e.clientY);
});

document.querySelectorAll('.mood-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.body.className = ''; 
    document.body.classList.add(`mood-${btn.dataset.mood}`);
  });
});

/* ============================================================
   7. ВИДЕО (Карусель из твоего исходника)
   ============================================================ */
(function initVideoCarousel() {
  const carousel = document.getElementById('videoCarousel');
  const prevBtn = document.getElementById('videoPrev');
  const nextBtn = document.getElementById('videoNext');
  
  if (!carousel) return;

  // На телефонах стрелки не нужны, там свайп
  if (window.matchMedia('(pointer: coarse)').matches) {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
  }

  function pauseAllVideos() {
    carousel.querySelectorAll('video').forEach(v => v.pause());
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      pauseAllVideos();
      const card = carousel.querySelector('.video-card');
      if (card) carousel.scrollBy({ left: card.offsetWidth + 15, behavior: 'smooth' });
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      pauseAllVideos();
      const card = carousel.querySelector('.video-card');
      if (card) carousel.scrollBy({ left: -(card.offsetWidth + 15), behavior: 'smooth' });
    });
  }

  carousel.addEventListener('touchstart', pauseAllVideos, { passive: true });

  // Чтобы играло только одно видео
  carousel.querySelectorAll('video').forEach(video => {
    video.addEventListener('play', () => {
      carousel.querySelectorAll('video').forEach(v => {
        if (v !== video) v.pause();
      });
    });
  });
})();