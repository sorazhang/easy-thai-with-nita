import { S, saveSessionRecord, saveCards } from './data.js';
import { esc, fmtDate, toast, renderEntryImgs, resizeImageToLimit } from './utils.js';

var currentSessionId=null;
var pendingWord=null;
var sdImgs=[];

export function isPublished(s){ return !s.status||s.status==='published'; }
export function renderSessions(){
  document.getElementById('sessions-list').style.display='';
  document.getElementById('session-detail').style.display='none';
  var today=new Date().toISOString().slice(0,10);
  var isTeacher=S.role==='teacher';
  var visible=isTeacher?S.sessions:S.sessions.filter(isPublished);
  var sorted=visible.slice().sort(function(a,b){return a.date<b.date?1:-1;});
  document.getElementById('sessions-list').innerHTML=sorted.length?sorted.map(function(s){
    var upcoming=s.date>=today;
    var badge=upcoming?'<span class="pill pill-v" style="font-size:.63rem;vertical-align:middle;margin-left:.35rem">📅 Upcoming</span>':'';
    var statusBadge='';
    if(isTeacher&&s.status==='draft') statusBadge=' <span class="pill pill-m">📝 Draft</span>';
    if(isTeacher&&s.status==='archived') statusBadge=' <span class="pill pill-m">🗄 Archived</span>';
    return '<div class="session-card'+(upcoming?' session-upcoming':'')+'" onclick="openSession(\''+s.id+'\')">'
      +'<div class="sc-meta">'+esc(fmtDate(s.date))+' · '+esc(s.location)+badge+statusBadge+'</div>'
      +'<div class="sc-topic">'+esc(s.topicTh)+'</div>'
      +'<div class="sc-sub">'+esc(s.topicEn)+'</div>'
      +'<div class="sc-pills">'
      +'<span class="pill pill-g">'+(s.vocab||[]).length+' vocab</span>'
      +'<span class="pill pill-m">'+(s.phrases||[]).length+' phrases</span>'
      +'</div></div>';
  }).join(''):'<div class="empty-msg">No sessions yet.</div>';
}
function renderStatusActions(s){
  var el=document.getElementById('sd-status-actions');
  if(!el) return;
  if(S.role!=='teacher'){ el.style.display='none'; el.innerHTML=''; return; }
  var status=s.status||'published';
  var label=status==='draft'
    ?'<span class="pill pill-m">📝 Draft — hidden from students</span>'
    :status==='archived'
    ?'<span class="pill pill-m">🗄 Archived — hidden from students</span>'
    :'<span class="pill pill-v">✅ Published — visible to students</span>';
  var buttons='';
  if(status!=='published') buttons+='<button class="btn-sm" onclick="setSessionStatus(\'published\')">✅ Publish</button>';
  if(status!=='draft') buttons+='<button class="btn-sm" onclick="setSessionStatus(\'draft\')">📝 Draft</button>';
  if(status!=='archived') buttons+='<button class="btn-sm" onclick="setSessionStatus(\'archived\')">🗄 Archive</button>';
  el.style.display='block';
  el.innerHTML='<div style="margin-bottom:.4rem">'+label+'</div><div style="display:flex;gap:.4rem;flex-wrap:wrap">'+buttons+'</div>';
}
export function setSessionStatus(status){
  var s=S.sessions.find(function(x){return x.id===currentSessionId;});
  if(!s) return;
  s.status=status;
  saveSessionRecord(s);
  renderSessions();
  document.getElementById('sessions-list').style.display='none';
  document.getElementById('session-detail').style.display='block';
  renderStatusActions(s);
  toast(status==='published'?'Session published!':status==='draft'?'Session set to draft':'Session archived');
}
export function openSession(id){
  var s=S.sessions.find(function(x){return x.id===id;});
  if(!s) return;
  currentSessionId=id;
  document.getElementById('sessions-list').style.display='none';
  document.getElementById('session-detail').style.display='block';
  document.getElementById('sd-title').textContent=s.topicTh+' — '+s.topicEn;
  document.getElementById('sd-meta').textContent=fmtDate(s.date)+' · '+s.location;
  renderStatusActions(s);
  document.getElementById('sd-vocab').innerHTML=(s.vocab||[]).map(function(v,idx){
    var saved=!!S.cards.find(function(c){return c.thai===v.th;});
    var btnCls='vc-add-btn'+(saved?' vc-saved':'');
    var btnTxt=saved?'✓ Saved':'+ Add to Vocab';
    var btnAttr=saved?'disabled':'onclick="openAddWordModalByIdx('+idx+')"';
    return '<div class="vocab-card">'
      +'<div class="vc-th">'+esc(v.th)+'</div>'
      +'<div class="vc-rom">'+esc(v.rom)+'</div>'
      +'<div class="vc-en">'+esc(v.en)+'</div>'
      +'<button class="'+btnCls+'" '+btnAttr+'>'+btnTxt+'</button>'
      +'</div>';
  }).join('');
  document.getElementById('sd-phrases').innerHTML=(s.phrases||[]).map(function(p){
    return '<div class="phrase-item">'+'<div class="ph-th">'+esc(p.th)+'</div>'+'<div class="ph-en">'+esc(p.en)+'</div>'+'</div>';
  }).join('');
  document.getElementById('sd-note').textContent=s.note||'';
  renderEntryImgs(s.images,'sd-images');
  sdImgs=[];
  renderSdImgStrip();
  document.getElementById('sd-note-edit').value=s.note||'';
  document.getElementById('sd-teacher-edit').style.display=S.role==='teacher'?'':'none';
}
export function closeSession(){
  currentSessionId=null;
  document.getElementById('session-detail').style.display='none';
  document.getElementById('sessions-list').style.display='';
}
export function openAddWordModalByIdx(idx){
  var s=S.sessions.find(function(x){return x.id===currentSessionId;});
  if(!s||!s.vocab||!s.vocab[idx]) return;
  openAddWordModal(s.vocab[idx],s.topicEn);
}
function openAddWordModal(v,cat){
  pendingWord={v:v,cat:cat};
  document.getElementById('awm-th').textContent=v.th;
  document.getElementById('awm-rom').textContent=v.rom;
  document.getElementById('awm-en').textContent=v.en;
  document.getElementById('awm-sentence').value='';
  document.getElementById('add-word-modal').classList.add('open');
  setTimeout(function(){document.getElementById('awm-sentence').focus();},320);
}
export function closeAddWordModal(){
  document.getElementById('add-word-modal').classList.remove('open');
  pendingWord=null;
}
export function confirmAddWord(){
  if(!pendingWord) return;
  var v=pendingWord.v, cat=pendingWord.cat;
  var sentence=document.getElementById('awm-sentence').value.trim();
  if(S.cards.find(function(c){return c.thai===v.th;})){
    closeAddWordModal();
    toast('Already in your vocab!');
    return;
  }
  S.cards.push({
    id:'c'+Date.now()+'r'+Math.random().toString(36).slice(2,6),
    thai:v.th,rom:v.rom,en:v.en,cat:cat,status:'new',
    sentence:sentence||''
  });
  saveCards();
  closeAddWordModal();
  openSession(currentSessionId);
  toast('Added to your vocab!');
}
export function addSessionCards(){
  var s=S.sessions.find(function(x){return x.id===currentSessionId;});
  if(!s) return;
  var added=0;
  (s.vocab||[]).forEach(function(v){
    if(!S.cards.find(function(c){return c.thai===v.th;})){
      S.cards.push({id:'c'+Date.now()+'r'+Math.random().toString(36).slice(2,6),thai:v.th,rom:v.rom,en:v.en,cat:s.topicEn,status:'new'});
      added++;
    }
  });
  saveCards();
  toast(added?'Added '+added+' card'+(added>1?'s':'')+' to your deck!':'All vocab already in your deck');
}
export function toggleAddSession(){document.getElementById('add-session-form').classList.toggle('open');}
export function saveSession(){
  var en=document.getElementById('sf-en').value.trim();
  var th=document.getElementById('sf-th').value.trim();
  var loc=document.getElementById('sf-loc').value.trim();
  if(!en||!th){toast('Please fill in both topic fields');return;}
  var newSession={id:'s'+Date.now(),date:new Date().toISOString().slice(0,10),location:loc||'Café class',topicEn:en,topicTh:th,vocab:[],phrases:[],note:'',images:[],status:'published'};
  S.sessions.unshift(newSession);
  saveSessionRecord(newSession);
  ['sf-en','sf-th','sf-loc'].forEach(function(id){document.getElementById(id).value='';});
  document.getElementById('add-session-form').classList.remove('open');
  renderSessions(); toast('Session added! Open it to post the note and photos.');
}
/* ── Teacher: post session note + photos after class ── */
export function handleSessionImages(input){
  var skipped=0;
  var files=Array.from(input.files);
  files.forEach(function(file){
    if(file.size>15*1024*1024){skipped++;
      if(skipped===files.length) toast('Images too large to process (max ~15 MB original)');
      return;
    }
    var reader=new FileReader();
    reader.onload=function(e){
      resizeImageToLimit(e.target.result,function(resized){
        if(resized===null){
          toast('One image could not fit under 2 MB — skipped');return;
        }
        sdImgs.push(resized);
        renderSdImgStrip();
      });
    };
    reader.readAsDataURL(file);
  });
  input.value='';
}
export function renderSdImgStrip(){
  var strip=document.getElementById('sd-img-strip');
  if(!strip) return;
  strip.innerHTML=sdImgs.map(function(src,i){
    return '<div class="jimg-thumb"><img src="'+src+'"><button class="jimg-rm" onclick="removeSdImg('+i+')">×</button></div>';
  }).join('');
}
export function removeSdImg(i){sdImgs.splice(i,1);renderSdImgStrip();}
export function postSessionUpdate(){
  var s=S.sessions.find(function(x){return x.id===currentSessionId;});
  if(!s) return;
  s.note=document.getElementById('sd-note-edit').value.trim();
  s.images=(s.images||[]).concat(sdImgs);
  sdImgs=[];
  saveSessionRecord(s);
  openSession(currentSessionId);
  toast('Session posted!');
}
