/* ============ Smooth scroll for nav + buttons ============ */
document.querySelectorAll('a[href^="#"], [data-scroll]').forEach(el => {
  el.addEventListener('click', (e) => {
    const hashHref = el.getAttribute('href');
    const dataScroll = el.getAttribute('data-scroll');
    const targetId = (hashHref && hashHref.startsWith('#')) ? hashHref : dataScroll;

    if (!targetId) return;
    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ============ Subtle snow (canvas) ============ */
(function snow(){
  const canvas = document.getElementById('snowCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width = innerWidth;
  let H = canvas.height = innerHeight;

  window.addEventListener('resize', ()=>{
    W = canvas.width = innerWidth;
    H = canvas.height = innerHeight;
  });

  const flakes = [];
  const COUNT = Math.max(45, Math.floor((W*H)/120000));
  for(let i=0;i<COUNT;i++){
    flakes.push({
      x: Math.random()*W,
      y: Math.random()*H,
      r: Math.random()*2 + 0.8,
      vx: (Math.random()-0.5)*0.35,
      vy: Math.random()*0.6 + 0.18,
      a: Math.random()*0.7 + 0.25
    });
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    for(const f of flakes){
      f.x += f.vx;
      f.y += f.vy;
      if(f.x > W) f.x = 0;
      if(f.x < 0) f.x = W;
      if(f.y > H) f.y = 0;

      ctx.beginPath();
      ctx.fillStyle = `rgba(248,250,252,${f.a})`;
      ctx.arc(f.x,f.y,f.r,0,Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ============ Magnetic CTAs ============ */
document.querySelectorAll('[data-magnetic]').forEach(btn=>{
  btn.addEventListener('mousemove', e=>{
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left) - r.width/2;
    const y = (e.clientY - r.top) - r.height/2;
    btn.style.transform = `translate(${x*0.18}px, ${y*0.14}px)`;
  });
  btn.addEventListener('mouseleave', ()=> {
    btn.style.transform = '';
  });
});

/* ============ Tilt cards ============ */
document.querySelectorAll('.tilt-card').forEach(card=>{
  card.addEventListener('mousemove', e=>{
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left)/r.width - 0.5;
    const y = (e.clientY - r.top)/r.height - 0.5;
    card.style.transform =
      `perspective(900px) rotateX(${ -y*8 }deg) rotateY(${ x*8 }deg) scale(1.03)`;
  });
  card.addEventListener('mouseleave', ()=> {
    card.style.transform = '';
  });
});

/* ============ Hero console parallax on scroll ============ */
const heroGraphic = document.getElementById('heroGraphic');
window.addEventListener('scroll', ()=>{
  if(!heroGraphic) return;
  const s = window.scrollY * 0.08;
  heroGraphic.style.transform = `translateY(${s}px)`;
});

/* ============ Reveal on scroll ============ */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
    }
  });
},{threshold:0.18});
revealEls.forEach(el => io.observe(el));

/* ============ Stagger for "What We Offer" cards ============ */
const offerCards = document.querySelectorAll('.offer-card');
const offerObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const card = entry.target;
      const delay = parseInt(card.getAttribute('data-delay') || '0', 10);
      setTimeout(()=> card.classList.add('visible-offer'), delay);
      offerObserver.unobserve(card);
    }
  });
},{threshold:0.2});
offerCards.forEach(c => offerObserver.observe(c));

/* ============ FAQ accordion ============ */
document.querySelectorAll('.faq-item').forEach(item=>{
  const btn = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  if(!btn || !answer) return;

  btn.addEventListener('click', ()=>{
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(openItem=>{
      if(openItem !== item){
        openItem.classList.remove('open');
      }
    });
    if(!isOpen){
      item.classList.add('open');
    }else{
      item.classList.remove('open');
    }
  });
});

/* ============ Metric counters ============ */
function animateNumber(el, target, ms=1500){
  const start = performance.now();
  function tick(now){
    const t = Math.min(1,(now-start)/ms);
    const eased = t<.5 ? 2*t*t : (-1 + (4-2*t)*t);
    const value = target * eased;
    el.textContent = Number.isInteger(target)
      ? Math.floor(value)
      : (Math.round(value*10)/10);
    if(t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const nums = document.querySelectorAll('.num');
const metricsObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const el = entry.target;
      const target = parseFloat(el.getAttribute('data-target'));
      animateNumber(el, target);
      metricsObserver.unobserve(el);
    }
  });
},{threshold:0.4});
nums.forEach(n => metricsObserver.observe(n));

/* ============ Reduced motion respect ============ */
if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.querySelectorAll('*').forEach(n => n.style.animation = 'none');
}
