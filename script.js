/* Studio Boost 46 — Feastie site · shared interactions */
(function(){
  /* CURSOR */
  const cursor=document.getElementById('cursor');
  if(cursor){
    let cx=0,cy=0,tx=0,ty=0;
    window.addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY});
    (function loop(){cx+=(tx-cx)*.2;cy+=(ty-cy)*.2;cursor.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`;requestAnimationFrame(loop)})();
    document.querySelectorAll('a,button,[data-magnetic]').forEach(el=>{
      el.addEventListener('mouseenter',()=>cursor.classList.add('is-hover'));
      el.addEventListener('mouseleave',()=>cursor.classList.remove('is-hover'));
    });
  }

  /* MAGNETIC */
  document.querySelectorAll('[data-magnetic]').forEach(el=>{
    el.addEventListener('mousemove',e=>{
      const r=el.getBoundingClientRect();
      el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.2}px,${(e.clientY-r.top-r.height/2)*.3}px)`;
    });
    el.addEventListener('mouseleave',()=>el.style.transform='');
  });

  /* WORDMARK letters pop */
  const wm=document.getElementById('wordmark');
  if(wm){const txt=wm.textContent;wm.textContent='';[...txt].forEach((ch,i)=>{const s=document.createElement('span');s.textContent=ch;s.style.animationDelay=(i*.07)+'s';wm.appendChild(s)});}

  /* NAV scroll */
  const nav=document.getElementById('nav');
  if(nav)window.addEventListener('scroll',()=>nav.classList.toggle('is-scrolled',scrollY>30));

  /* BURGER / MOBILE MENU */
  const burger=document.getElementById('burger'),mm=document.getElementById('mobileMenu');
  if(burger&&mm){
    const toggle=open=>{burger.classList.toggle('open',open);mm.classList.toggle('open',open);document.body.classList.toggle('menu-open',open);};
    burger.addEventListener('click',()=>toggle(!mm.classList.contains('open')));
    mm.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>toggle(false)));
  }

  /* REVEAL */
  const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}}),{threshold:.12,rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  /* 72H TICKER */
  const ticker=document.getElementById('ticker');
  if(ticker){
    let total=72*3600-(Math.floor(Math.random()*30)+10);
    const pad=n=>String(n).padStart(2,'0');
    setInterval(()=>{
      total--;if(total<0)total=72*3600;
      const h=Math.floor(total/3600),m=Math.floor(total%3600/60),s=total%60;
      ticker.innerHTML=`${pad(h)}<span class="sep">:</span>${pad(m)}<span class="sep">:</span>${pad(s)}`;
    },1000);
  }

  /* COUNT-UP */
  const cio=new IntersectionObserver(es=>es.forEach(en=>{
    if(!en.isIntersecting)return;
    const el=en.target,target=+el.dataset.count,suf=el.dataset.suffix||'',dur=1300,start=performance.now();
    (function step(t){const p=Math.min((t-start)/dur,1);const v=Math.floor(target*(1-Math.pow(1-p,3)));el.textContent=v+suf;if(p<1)requestAnimationFrame(step)})(start);
    cio.unobserve(el);
  }),{threshold:.5});
  document.querySelectorAll('.stat__num[data-count]').forEach(c=>cio.observe(c));

  /* FAQ */
  document.querySelectorAll('.faq__item').forEach(item=>{
    item.querySelector('.faq__q').addEventListener('click',()=>{
      const open=item.classList.contains('open');
      document.querySelectorAll('.faq__item').forEach(i=>i.classList.remove('open'));
      if(!open)item.classList.add('open');
    });
  });

  /* PROJET FILTERS */
  const fbtns=document.querySelectorAll('.filter-btn');
  if(fbtns.length){
    fbtns.forEach(btn=>btn.addEventListener('click',()=>{
      fbtns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f=btn.dataset.filter;
      document.querySelectorAll('.projet').forEach(card=>{
        card.style.display=(f==='all'||card.dataset.type===f)?'':'none';
      });
    }));
  }

  /* CONTACT FORM — Formspree */
  const form=document.querySelector('.contact-form');
  if(form){
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      const btn=form.querySelector('.form-submit'),ok=form.querySelector('.form-success');
      const label=btn.textContent;
      btn.disabled=true;btn.textContent='Envoi en cours…';
      try{
        const res=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{'Accept':'application/json'}});
        if(res.ok){
          btn.style.display='none';if(ok)ok.style.display='block';form.reset();
          setTimeout(()=>{btn.style.display='';btn.disabled=false;btn.textContent=label;if(ok)ok.style.display='none';},6000);
        }else{btn.disabled=false;btn.textContent='Réessayer →';}
      }catch{btn.disabled=false;btn.textContent='Réessayer →';}
    });
  }
})();
