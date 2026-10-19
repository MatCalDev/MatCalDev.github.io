const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
const SPEED = 0.0005;
const STAR_COLORS = ['#9bb0ff', '#cad7ff', '#ffffff', '#fff4e8', '#ffd2a1', '#ffad7a'];
const PLANET_COLORS = ['#c9694a', '#e6cf9a', '#8fd3e8'];
const header = document.querySelector('.site-header');

const stage = document.querySelector('.project-grid');
const cards = [...stage.querySelectorAll('.project-card')];
const prev = document.getElementById('proj-prev');
const next = document.getElementById('proj-next');
const count = document.getElementById('proj-count');
let active = 0;
let swiped = false;

function render() {
  cards.forEach((card, i) => {
    const offset = i - active;
    card.style.setProperty('--offset', offset);
    card.style.setProperty('--abs', Math.abs(offset));
    card.style.zIndex = cards.length - Math.abs(offset);
    card.classList.toggle('is-active', offset === 0);
    card.classList.toggle('is-far', Math.abs(offset) > 1);
  });
  count.textContent = `${active + 1} / ${cards.length}`;
  prev.disabled = active === 0;
  next.disabled = active === cards.length - 1;
}

function setActive(i) {
  active = Math.min(Math.max(i, 0), cards.length - 1);
  render();
}

prev.addEventListener('click', () => setActive(active - 1));
next.addEventListener('click', () => setActive(active + 1));

cards.forEach((card, i) => {
  card.addEventListener('click', () => {
    if (swiped) { swiped = false; return; }
    if (i !== active) setActive(i);
  });
});

stage.setAttribute('tabindex', '0');
stage.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') setActive(active - 1);
  if (e.key === 'ArrowRight') setActive(active + 1);
});

let startX = null;
stage.addEventListener('pointerdown', (e) => { startX = e.clientX; });
stage.addEventListener('pointerup', (e) => {
  if (startX === null) return;
  const dx = e.clientX - startX;
    if (Math.abs(dx) > 50) {
    swiped = true;
    setTimeout(() => { swiped = false; }, 50);
    setActive(active + (dx < 0 ? 1 : -1));
    }
  startX = null;
});

render();

function onScroll() {
  header.classList.toggle('scrolled', window.scrollY > 40);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

function updateStarCount() {
    const area = canvas.width * canvas.height;
    const target = Math.max(60, Math.min(400, Math.round(area / 6500)));

    while (stars.length < target) {
        stars.push(createStar());
    }
    if (stars.length > target) {
        stars.length = target;
    }
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    updateStarCount();
}

window.addEventListener('resize', resize);

function createStar(z = Math.random() * 0.9 + 0.1) {
    const isPlanet = Math.random() < 0.03;
    const palette = isPlanet ? PLANET_COLORS : STAR_COLORS;
    return {
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        z: z,
        phase: Math.random() * Math.PI * 2,
        isPlanet: isPlanet,
        color: palette[Math.floor(Math.random() * palette.length)]
    };
}

function draw() {
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const time = performance.now();

    for (const star of stars) {
        star.z -= SPEED;

        const screenX = canvas.width / 2 + (star.x / star.z) * canvas.width / 2;
        const screenY = canvas.height / 2 + (star.y / star.z) * canvas.height / 2;

        if (star.z <= 0 || screenX < 0 || screenX > canvas.width || screenY < 0 || screenY > canvas.height) {
            Object.assign(star, createStar(1));
            continue;
        }

        const closeness = 1 - star.z;
        const twinkle = star.isPlanet ? 1 : 0.75 + 0.25 * Math.sin(time * 0.003 + star.phase);
        ctx.globalAlpha = closeness * twinkle;
        ctx.fillStyle = star.color;
        ctx.shadowColor = star.color;
        ctx.shadowBlur = star.isPlanet ? 12 : 0;
        ctx.beginPath();
        ctx.arc(screenX, screenY, closeness * (star.isPlanet ? 4 : 2.5), 0, Math.PI * 2);
        ctx.fill();
    }
    requestAnimationFrame(draw);
}

resize();
draw();