/* おみくじ — OMIKUJI / script.js */
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const stage = document.getElementById('stage');
  const box = document.getElementById('box');
  const sticksG = document.getElementById('sticks');
  const ctaText = document.getElementById('ctaText');

  /* ---------- 籤の束 ---------- */
  function buildSticks(){
    sticksG.innerHTML = '';
    const n = 13;
    for (let i = 0; i < n; i++){
      const t = i / (n - 1);
      const ang = -22 + t * 44 + (Math.random() * 7 - 3.5);
      const x = 1040 + (t - .5) * 82 + (Math.random() * 7 - 3.5);
      const h = 44 + Math.random() * 52;
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('transform', `translate(${x.toFixed(1)} 494) rotate(${ang.toFixed(1)})`);
      const shade = 0.86 + Math.random() * 0.14;
      const r = document.createElementNS(NS, 'rect');
      r.setAttribute('x', -7); r.setAttribute('y', -h);
      r.setAttribute('width', 14); r.setAttribute('height', h + 26);
      r.setAttribute('rx', 7);
      r.setAttribute('fill', '#E9DBBE');
      r.setAttribute('opacity', shade.toFixed(2));
      g.appendChild(r);
      const edge = document.createElementNS(NS, 'rect');
      edge.setAttribute('x', 2); edge.setAttribute('y', -h);
      edge.setAttribute('width', 5); edge.setAttribute('height', h + 26);
      edge.setAttribute('rx', 3);
      edge.setAttribute('fill', '#C7B48C');
      edge.setAttribute('opacity', '.55');
      g.appendChild(edge);
      if (i % 4 === 0){
        const band = document.createElementNS(NS, 'rect');
        band.setAttribute('x', -7); band.setAttribute('y', -h + 8);
        band.setAttribute('width', 14); band.setAttribute('height', 8);
        band.setAttribute('fill', '#C8402F'); band.setAttribute('opacity', '.8');
        g.appendChild(band);
      }
      sticksG.appendChild(g);
    }
  }

  /* ---------- 星と塵 ---------- */
  function buildSky(){
    const stars = document.getElementById('stars');
    for (let i = 0; i < 44; i++){
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', (Math.random() * 1600).toFixed(0));
      c.setAttribute('cy', (Math.random() * 520).toFixed(0));
      c.setAttribute('r', (Math.random() * 1.6 + .4).toFixed(2));
      c.setAttribute('fill', '#DCE6F2');
      c.setAttribute('opacity', (Math.random() * .6 + .15).toFixed(2));
      stars.appendChild(c);
    }
    const dust = document.getElementById('dustLayer');
    for (let i = 0; i < 26; i++){
      const c = document.createElementNS(NS, 'circle');
      const size = (Math.random() * 2.2 + .8).toFixed(2);
      c.setAttribute('cx', (Math.random() * 1600).toFixed(0));
      c.setAttribute('cy', (500 + Math.random() * 380).toFixed(0));
      c.setAttribute('r', size);
      c.setAttribute('fill', Math.random() > .55 ? '#F2C889' : '#C8D4E2');
      c.setAttribute('class', 'dust');
      c.style.setProperty('--dx', (Math.random() * 80 - 40).toFixed(0) + 'px');
      c.style.animationDuration = (7 + Math.random() * 9).toFixed(1) + 's';
      c.style.animationDelay = (-Math.random() * 12).toFixed(1) + 's';
      dust.appendChild(c);
    }
  }

  /* ---------- 音 ---------- */
  let ac = null, nb = null, muted = false;
  function ensureAudio(){
    if (!ac){
      try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){ return; }
      const len = Math.floor(ac.sampleRate * .5);
      nb = ac.createBuffer(1, len, ac.sampleRate);
      const d = nb.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ac.state === 'suspended') ac.resume();
  }
  function clack(when, vol, freq){
    if (!ac || muted) return;
    const s = ac.createBufferSource(); s.buffer = nb;
    const bp = ac.createBiquadFilter(); bp.type = 'bandpass';
    bp.frequency.value = freq; bp.Q.value = 1.1;
    const g = ac.createGain();
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(vol, when + .004);
    g.gain.exponentialRampToValueAtTime(.0008, when + .085);
    s.connect(bp).connect(g).connect(ac.destination);
    s.start(when); s.stop(when + .12);
  }
  const sfx = {
    rattle(){
      ensureAudio(); if (!ac) return;
      const t = ac.currentTime;
      for (let i = 0; i < 17; i++){
        clack(t + i * .052 + Math.random() * .028, .06 + Math.random() * .05, 780 + Math.random() * 900);
      }
    },
    paper(){
      ensureAudio(); if (!ac || muted) return;
      const t = ac.currentTime;
      const s = ac.createBufferSource(); s.buffer = nb;
      const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = .8;
      bp.frequency.setValueAtTime(2600, t);
      bp.frequency.exponentialRampToValueAtTime(700, t + .4);
      const g = ac.createGain();
      g.gain.setValueAtTime(.0001, t);
      g.gain.linearRampToValueAtTime(.05, t + .05);
      g.gain.exponentialRampToValueAtTime(.0005, t + .42);
      s.connect(bp).connect(g).connect(ac.destination);
      s.start(t); s.stop(t + .45);
    },
    chime(){
      ensureAudio(); if (!ac || muted) return;
      const t = ac.currentTime;
      [880, 1320, 1760].forEach((f, i) => {
        const o = ac.createOscillator(); o.type = 'sine'; o.frequency.value = f;
        const g = ac.createGain();
        g.gain.setValueAtTime(0, t + i * .06);
        g.gain.linearRampToValueAtTime(.045 / (i + 1), t + i * .06 + .02);
        g.gain.exponentialRampToValueAtTime(.0004, t + i * .06 + 1.4);
        o.connect(g).connect(ac.destination);
        o.start(t + i * .06); o.stop(t + i * .06 + 1.5);
      });
    }
  };

  /* ---------- 御神籤データ ---------- */
  const FORTUNES = [
    {
      rank: '大吉', lead: '願いは、声に出した瞬間から動く。',
      wish: '思いがけない形で叶う', wait: '待つより、こちらから', trip: '遠くへ。道中つつがなし'
    },
    {
      rank: '中吉', lead: '急がずとも、流れはもう来ている。',
      wish: '半歩手前まで来ている', wait: '近いうちに便りあり', trip: '近場なら、なお吉'
    },
    {
      rank: '小吉', lead: '小さな決断が、のちに効いてくる。',
      wish: 'ひとつに絞ると吉', wait: '気を許せる相手と', trip: '日帰りがちょうどいい'
    },
    {
      rank: '吉', lead: '平らかな日。整えることに運がある。',
      wish: '続けていることが力になる', wait: '礼を尽くせば実りあり', trip: '支度を丁寧に'
    },
    {
      rank: '末吉', lead: '今は種をまく時。実りは少し先。',
      wish: '焦らず育てば実る', wait: '時間が味方になる', trip: '延期もまた吉'
    },
    {
      rank: '凶', lead: '止まることも、運のうち。焦らない。',
      wish: 'いったん手を放すと見える', wait: '無理に近づかず', trip: '遠出は控えめに'
    }
  ];

  const $ = id => document.getElementById(id);
  let busy = false, lastIdx = -1;

  function setFortune(f){
    const [a, b] = Array.from(f.rank);
    $('pR1').textContent = a || '';
    $('pR2').textContent = b || '';
    $('pLead').textContent = f.lead;
    $('pWish').textContent = f.wish;
    $('pWait').textContent = f.wait;
    $('pTrip').textContent = f.trip;
    const no = String(Math.floor(Math.random() * 88) + 1).padStart(2, '0');
    $('pNo').textContent = '第' + no + '番';
    const d = new Date();
    $('pDate').textContent = '引いた日 ' + d.getFullYear() + '.' +
      String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0');
  }

  const wait = ms => new Promise(r => setTimeout(r, ms));

  async function draw(){
    if (busy) return;
    busy = true;

    let idx;
    do { idx = Math.floor(Math.random() * FORTUNES.length); } while (idx === lastIdx && FORTUNES.length > 1);
    lastIdx = idx;
    const f = FORTUNES[idx];
    setFortune(f);

    stage.classList.remove('revealed', 'tipping');
    stage.classList.add('shaking');
    ctaText.textContent = '…';
    buildSticks();
    sfx.rattle();
    if (navigator.vibrate) { try { navigator.vibrate([18, 40, 22, 60, 18, 40, 30]); } catch(e){} }

    await wait(800);

    stage.classList.add('tipping');
    sfx.paper();
    await wait(300);

    stage.classList.remove('shaking', 'tipping');
    stage.classList.add('revealed');
    sfx.chime();
    spark(790, 455);
    ctaText.textContent = 'もう一度引く';

    await wait(400);
    busy = false;
  }

  function spark(cx, cy){
    for (let i = 0; i < 16; i++){
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', cx); c.setAttribute('cy', cy);
      c.setAttribute('r', (Math.random() * 3 + 1.4).toFixed(1));
      c.setAttribute('fill', Math.random() > .4 ? '#E8C77E' : '#F3ECDD');
      document.getElementById('dustLayer').appendChild(c);
      const a = Math.random() * Math.PI * 2;
      const dist = 70 + Math.random() * 230;
      c.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${Math.cos(a) * dist}px, ${Math.sin(a) * dist - 40}px) scale(.2)`, opacity: 0 }
      ], { duration: 900 + Math.random() * 700, easing: 'cubic-bezier(.15,.7,.3,1)' })
       .onfinish = () => c.remove();
    }
  }

  stage.addEventListener('click', e => {
    if (e.target.closest('#mute')) return;
    ensureAudio();
    draw();
  });
  stage.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); ensureAudio(); draw(); }
  });

  const mute = document.getElementById('mute');
  mute.addEventListener('click', e => {
    e.stopPropagation();
    muted = !muted;
    stage.classList.toggle('muted', muted);
    document.getElementById('muteSlash').setAttribute('opacity', muted ? '1' : '0');
    if (!muted){ ensureAudio(); sfx.chime(); }
  });

  /* ---------- 初期化 ---------- */
  buildSky();
  buildSticks();

  // 確認用: ?preview=result&i=0
  const q = new URLSearchParams(location.search);
  if (q.get('preview') === 'result'){
    document.documentElement.style.setProperty('--noanim', '1');
    const st = document.createElement('style');
    st.textContent = '*{transition-duration:0s !important;transition-delay:0s !important;animation-duration:0s !important;animation-delay:0s !important}';
    document.head.appendChild(st);
    setFortune(FORTUNES[Number(q.get('i') || 0) % FORTUNES.length]);
    stage.classList.add('revealed');
    ctaText.textContent = 'もう一度引く';
  }
})();