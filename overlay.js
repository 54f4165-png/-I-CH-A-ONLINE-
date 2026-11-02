const scene=document.getElementById('scene');function resize(){scene.style.transform=`scale(${Math.min(innerWidth/1080,innerHeight/1920)})`}window.addEventListener('resize',resize);resize();function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}let previous=0;LiveStore.subscribe(s=>{const rank=Object.entries(s.gifts).sort((a,b)=>b[1]-a[1]).slice(0,5);document.getElementById('topFlowers').innerHTML=rank.map(([n,c],i)=>`<div class="rank"><span>${i+1}. ${escapeHtml(n)}</span><span>🪷${c}</span></div>`).join('')||'<div class="rank">Chưa có quà tặng</div>';document.getElementById('thanks').innerHTML=s.thanks.map(t=>`<div class="rank">${escapeHtml(t)}</div>`).join('')||'Chào mừng quý Phật tử';document.getElementById('comments').innerHTML=s.comments.slice(-5).map(c=>`<div class="comment"><strong>${escapeHtml(c.name)}:</strong> ${escapeHtml(c.text)}</div>`).join('');const latest=s.events.at(-1);if(latest&&latest.id!==previous){previous=latest.id;if(latest.type==='gift'){const banner=document.getElementById('giftBanner');banner.textContent=`🪷 ${latest.name} tặng ${latest.count} Hoa Sen!`;setTimeout(()=>{if(banner.textContent.includes(latest.name))banner.textContent=''},5000)}if(latest.type==='join'||latest.type==='comment'){window.Temple3D?.arrive(latest.name)}}});setInterval(()=>{let s=LiveStore.read();if(!s.connected)return;},2000);
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

