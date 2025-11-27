/* Smooth nav scroll + active link */
document.querySelectorAll('.nav-links a[href^="#"]').forEach(link=>{
  link.addEventListener('click', e=>{
    e.preventDefault();
    document.querySelector(link.getAttribute('href')).scrollIntoView({behavior:'smooth', block:'start'});
  });
});

/* Canvas particle system: snow + shards */
const canvas = document.getElementById('iceCanvas');
const ctx = canvas.getContext('2d');
let W = innerWidth, H = innerHeight;
function resize(){ W=canvas.width=innerWidth; H=canvas.height=innerHeight; }
addEventListener('resize', resize);
resize();

const flakes = [];
for(let i=0;i<140;i++){
  flakes.push({
    x: Math.random()*W,
    y: Math.random()*H,
    r: Math.random()*2.4 + 0.6,
    vx: (Math.random()-0.5)*0.6,
    vy: Math.random()*0.6 + 0.2,
    alpha: Math.random()*0.6 + 0.05
  });
}
function drawFlakes(){
  ctx.clearRect(0,0,W,H);
  // subtle shard lines
  for(let i=0;i<flakes.length;i++){
    const f = flakes[i];
    f.x += f.vx;
    f.y += f.vy;
    if(f.x>W) f.x=0;
    if(f.x<0) f.x=W;
    if(f.y>H) f.y=0;
    ctx.beginPath();
    ctx.fillStyle = `rgba(180,230,255,${f.alpha})`;
    ctx.arc(f.x,f.y,f.r,0,Math.PI*2);
    ctx.fill();

    // small shard streak
    ctx.beginPath();
    ctx.moveTo(f.x, f.y);
    ctx.lineTo(f.x - f.vx*6, f.y - f.vy*6);
    ctx.strokeStyle = `rgba(180,230,255,${f.alpha*0.35})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  requestAnimationFrame(drawFlakes);
}
drawFlakes();

/* reveal on scroll for elements with .section */
const revealEls = document.querySelectorAll('.section, .hero, .price-card, .card, .step');
function onScrollReveal(){
  revealEls.forEach(el=>{
    const r = el.getBoundingClientRect();
    if(r.top < innerHeight - 120) el.classList.add('revealer','visible');
  });
}
addEventListener('scroll', onScrollReveal);
onScrollReveal();

/* tilt micro-interactions */
const tiltable = document.querySelectorAll('.card, .price-card, .step, .hero-left, .orb-wrap');
tiltable.forEach(el=>{
  el.addEventListener('mousemove', e=>{
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) - rect.width/2;
    const y = (e.clientY - rect.top) - rect.height/2;
    const rx = (-y/20).toFixed(2);
    const ry = (x/20).toFixed(2);
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
  });
  el.addEventListener('mouseleave', ()=> el.style.transform = '');
});

/* Cube subtle speed increase on hover */
const cube = document.getElementById('cube');
if(cube){
  cube.addEventListener('mouseenter', ()=> cube.style.animationDuration = '4s');
  cube.addEventListener('mouseleave', ()=> cube.style.animationDuration = '10s');
}

/* Form AJAX w/ feedback */
const form = document.getElementById('leadForm');
const msg = document.getElementById('formMsg');
if(form){
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    msg.textContent = 'Sending...';
    const fd = new FormData(form);
    try{
      const res = await fetch(form.action, {method:'POST', body:fd, headers:{'Accept':'application/json'}});
      if(res.ok){ msg.textContent = 'Thanks — we got it. Check your inbox.'; form.reset(); }
      else { const j = await res.json(); msg.textContent = j.error || 'Failed. Try again.'; }
    }catch(err){ msg.textContent = 'Network error. Try again later.'; }
    setTimeout(()=> msg.textContent='', 6000);
  });
}

/* nav highlight on scroll */
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = Array.from(navLinks).map(l=>document.querySelector(l.getAttribute('href')));
function updateNav(){
  const top = window.scrollY + 140;
  sections.forEach((s,i)=>{
    if(!s) return;
    if(top >= s.offsetTop && top < s.offsetTop + s.offsetHeight){
      navLinks.forEach(a=>a.classList.remove('active'));
      navLinks[i].classList.add('active');
    }
  });
}
addEventListener('scroll', updateNav);
updateNav();

/* reduce motion preference */
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.querySelectorAll('*').forEach(n=> n.style.animation = 'none');
}
