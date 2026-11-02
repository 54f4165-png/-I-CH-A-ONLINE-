const scene=document.getElementById('scene');function resize(){scene.style.transform=`scale(${Math.min(innerWidth/1080,innerHeight/1920)})`}window.addEventListener('resize',resize);resize();const crowd=document.getElementById('crowd');const persons=[];for(let row=0;row<7;row++)for(let col=0;col<10;col++){if(col===4||col===5)continue;let p=document.createElement('div');p.className='person';p.style.left=`${col*107+(row%2)*12}px`;p.style.top=`${row*105}px`;p.style.transform=`scale(${.58+row*.085})`;p.style.animationDelay=`-${Math.random()*6}s`;p.innerHTML='<div class="head"></div><div class="robe"></div><div class="name" hidden></div>';crowd.append(p);persons.push(p)}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}let previous=0;LiveStore.subscribe(s=>{const rank=Object.entries(s.gifts).sort((a,b)=>b[1]-a[1]).slice(0,5);document.getElementById('topFlowers').innerHTML=rank.map(([n,c],i)=>`<div class="rank"><span>${i+1}. ${escapeHtml(n)}</span><span>🪷${c}</span></div>`).join('')||'<div class="rank">Chưa có quà tặng</div>';document.getElementById('thanks').innerHTML=s.thanks.map(t=>`<div class="rank">${escapeHtml(t)}</div>`).join('')||'Chào mừng quý Phật tử';document.getElementById('comments').innerHTML=s.comments.slice(-5).map(c=>`<div class="comment"><strong>${escapeHtml(c.name)}:</strong> ${escapeHtml(c.text)}</div>`).join('');const latest=s.events.at(-1);if(latest&&latest.id!==previous){previous=latest.id;if(latest.type==='gift'){const banner=document.getElementById('giftBanner');banner.textContent=`🪷 ${latest.name} tặng ${latest.count} Hoa Sen!`;setTimeout(()=>{if(banner.textContent.includes(latest.name))banner.textContent=''},5000)}if(latest.type==='join'||latest.type==='comment'){const p=persons[Math.floor(Math.random()*persons.length)];pilgrimArrives(latest.name)}}});setInterval(()=>{let s=LiveStore.read();if(!s.connected)return;},2000);
// Voice in the LIVE overlay itself so LIVE Studio can capture its audio.
// Browser autoplay policy may require clicking the overlay once to unlock speech.
let lastSpokenId=0, speechQueue=[], speaking=false;
function sayNext(){
  if(speaking||!speechQueue.length||!('speechSynthesis' in window))return;
  speaking=true;
  const u=new SpeechSynthesisUtterance(speechQueue.shift());
  u.lang='vi-VN';u.rate=.96;u.volume=Math.min(1,Math.max(0,LiveStore.read().volume??.9));
  u.voice=speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith('vi'))||null;
  u.onend=u.onerror=()=>{speaking=false;sayNext()};
  speechSynthesis.speak(u);
}
let initializedSpeech=false;
LiveStore.subscribe(s=>{
  if(!initializedSpeech){initializedSpeech=true;lastSpokenId=Math.max(0,...s.events.map(e=>Number(e.id)||0));return;}
  for(const e of s.events){
    if(Number(e.id)<=lastSpokenId)continue;
    if(e.type==='comment'&&s.tts){
      const content=String(e.text||'').replace(/https?:\/\/\S+/g,'').slice(0,140);
      if(content&&speechQueue.length<8)speechQueue.push(`${e.name} bình luận: ${content}`);
    }
    lastSpokenId=Math.max(lastSpokenId,Number(e.id)||0);
  }
  sayNext();
});
document.addEventListener('click',()=>{try{speechSynthesis.resume();sayNext()}catch{}});

// A 2.5D pilgrim cycle: arrive through the aisle, turn toward altar, bow, depart.
const walkerLayer=document.getElementById('walkerLayer');
let nextSlot=0, activePilgrims=0;
function pilgrimArrives(name='Phật tử'){
  if(activePilgrims>=8)return;
  activePilgrims++;
  const slot=persons[nextSlot++%persons.length];
  const targetX=Number.parseFloat(slot.style.left)+12;
  const targetY=1020+Number.parseFloat(slot.style.top);
  const w=document.createElement('div');w.className='walker walking';
  w.style.left='487px';w.style.top='1760px';
  const head=document.createElement('div');head.className='head';
  const robe=document.createElement('div');robe.className='robe';
  const label=document.createElement('div');label.className='name';label.textContent=String(name).slice(0,32);
  w.append(head,robe,label);walkerLayer.append(w);
  // Two-stage path: up the central aisle, then turn into the chosen row.
  setTimeout(()=>{w.style.top=Math.max(1090,targetY)+'px'},100);
  setTimeout(()=>{w.style.left=targetX+'px';w.style.top=targetY+'px'},2650);
  setTimeout(()=>{w.classList.remove('walking');w.classList.add('bowing')},5200);
  setTimeout(()=>{w.classList.remove('bowing');w.classList.add('walking')},8300);
  setTimeout(()=>{w.style.left='487px';w.style.top=Math.max(1090,targetY)+'px'},8600);
  setTimeout(()=>{w.style.top='1810px'},11200);
  setTimeout(()=>{w.style.opacity='0'},13500);
  setTimeout(()=>{w.remove();activePilgrims--},14300);
}
// Autonomous arrivals make the temple feel alive even without live viewers.
const sampleNames=['Diệu Tâm','Thiện An','Minh Đức','Tịnh Liên','Phúc An','Tâm Bình','Diệu Hương','Thiện Nhân'];
let demoIndex=0;
setTimeout(()=>pilgrimArrives(sampleNames[demoIndex++%sampleNames.length]),1600);
setInterval(()=>{if(activePilgrims<5)pilgrimArrives(sampleNames[demoIndex++%sampleNames.length])},5200);
