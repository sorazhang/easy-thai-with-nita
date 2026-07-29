import { S, saveEntryRecord } from './data.js';
import { esc, fmtDate, toast, statusPill, renderEntryImgs } from './utils.js';

var currentReviewId=null;
var annCtx={journalId:null,editingId:null,selStart:0,selEnd:0,selText:''};

export function renderNitaQueue(){
  closeReview();
  var waiting=S.entries.filter(function(e){return e.status==='submitted';});
  var done=S.entries.filter(function(e){return e.status==='reviewed';});
  var html='';
  if(waiting.length){html+='<div class="queue-sec"><div class="queue-lbl">⏳ Waiting for Review ('+waiting.length+')</div>';html+=waiting.map(reviewCard).join('');html+='</div>';}
  if(done.length){html+='<div class="queue-sec"><div class="queue-lbl">✓ Already Reviewed ('+done.length+')</div>';html+=done.map(reviewCard).join('');html+='</div>';}
  if(!waiting.length&&!done.length) html='<div class="empty-msg">No journal entries submitted yet.</div>';
  document.getElementById('review-queue').innerHTML=html;
}
function reviewCard(e){
  return '<div class="journal-card" onclick="openReview(\''+e.id+'\')">'+'<div class="jc-title">'+esc(e.title)+'</div>'+'<div class="jc-preview">By '+esc(e.authorDisplay)+' &mdash; '+esc(e.body.slice(0,60))+'…</div>'+'<div class="jc-foot"><div class="jc-date">'+fmtDate(e.date)+'</div>'+statusPill(e.status)+'</div>'+'</div>';
}
export function openReview(id){
  var e=S.entries.find(function(x){return x.id===id;});
  if(!e) return;
  currentReviewId=id;
  annCtx.journalId=id; annCtx.editingId=null;
  document.getElementById('review-list-area').style.display='none';
  document.getElementById('review-editor').style.display='block';
  document.getElementById('rv-title').textContent=e.title;
  document.getElementById('rv-meta').textContent='By '+e.authorDisplay+' · '+fmtDate(e.date);
  document.getElementById('rv-comment').value=e.nitaComment||'';
  renderReviewBody(e);
  renderEntryImgs(e.images,'rv-images');
  var body=document.getElementById('rv-body');
  body.onmouseup=onPossibleSelection;
  body.ontouchend=onPossibleSelection;
}
export function renderReviewBody(e){
  document.getElementById('rv-body').innerHTML=renderAnnotatedText(e.body,e.annotations,{interactive:true,journalId:e.id});
}
export function closeReview(){
  currentReviewId=null; annCtx.journalId=null;
  document.getElementById('review-editor').style.display='none';
  document.getElementById('review-list-area').style.display='';
  closeAnnotPopup();
}
export function sendReview(){
  var id=currentReviewId;
  var e=S.entries.find(function(x){return x.id===id;});
  if(!e) return;
  e.status='reviewed';
  e.nitaComment=document.getElementById('rv-comment').value.trim();
  saveEntryRecord(e); closeReview(); renderNitaQueue(); toast('Feedback sent!');
}
export function renderAnnotatedText(body,annotations,opts){
  opts=opts||{};
  var interactive=opts.interactive||false;
  var jid=opts.journalId||null;
  var anns=(annotations||[]).slice().sort(function(a,b){return a.start-b.start;});
  var result='';var cursor=0;
  anns.forEach(function(a){
    if(a.start>cursor) result+=mkSeg(body.slice(cursor,a.start),cursor,interactive);
    result+=renderChip(a,{interactive:interactive,journalId:jid});
    cursor=a.end;
  });
  if(cursor<body.length) result+=mkSeg(body.slice(cursor),cursor,interactive);
  return result;
}
function mkSeg(text,start,interactive){
  if(!text) return '';
  return '<span class="seg" data-start="'+start+'">'+esc(text)+'</span>';
}
function renderChip(a,opts){
  var interactive=opts&&opts.interactive;
  var jid=opts&&opts.journalId;
  var click=interactive?' onclick="editAnnotation(\''+jid+'\',\''+a.id+'\')"':'';
  var noteHtml=a.note?'<button class="chip-nb" onclick="toggleNote(\''+a.id+'\');event.stopPropagation()">💬</button>'+'<span class="chip-note" id="cn-'+a.id+'">'+esc(a.note)+'</span>':'';
  return '<span class="chip"'+click+'>'+'<span class="chip-orig">'+esc(a.original)+'</span>'+'<span class="chip-arrow">→</span>'+'<span class="chip-corr">'+esc(a.correction)+'</span>'+noteHtml+'</span>';
}
export function toggleNote(id){var el=document.getElementById('cn-'+id);if(el) el.classList.toggle('open');}
function onPossibleSelection(){
  setTimeout(function(){
    var sel=window.getSelection();
    if(!sel||sel.isCollapsed||!sel.toString().trim()) return;
    var range=sel.getRangeAt(0);
    var startSeg=findSeg(range.startContainer);
    var endSeg=findSeg(range.endContainer);
    if(!startSeg||!endSeg) return;
    var ss=parseInt(startSeg.dataset.start,10);
    var es=parseInt(endSeg.dataset.start,10);
    var absStart=ss+range.startOffset;
    var absEnd=es+range.endOffset;
    if(absStart>=absEnd) return;
    var e=S.entries.find(function(x){return x.id===annCtx.journalId;});
    if(!e) return;
    annCtx.editingId=null;
    annCtx.selStart=absStart;
    annCtx.selEnd=absEnd;
    annCtx.selText=e.body.slice(absStart,absEnd);
    var rect=range.getBoundingClientRect();
    sel.removeAllRanges();
    openAnnotPopup(rect);
  },10);
}
function findSeg(node){
  var n=node;
  while(n&&n!==document.body){
    if(n.nodeType===1&&n.classList&&n.classList.contains('seg')) return n;
    n=n.parentNode;
  }
  return null;
}
function openAnnotPopup(rect){
  var popup=document.getElementById('annot-popup');
  document.getElementById('pop-sel').textContent=annCtx.selText;
  document.getElementById('pop-corr').value=annCtx.editingId?(function(){var e=S.entries.find(function(x){return x.id===annCtx.journalId;});var a=e&&e.annotations.find(function(a){return a.id===annCtx.editingId;});return a?a.correction:'';}()):'';
  document.getElementById('pop-note').value=annCtx.editingId?(function(){var e=S.entries.find(function(x){return x.id===annCtx.journalId;});var a=e&&e.annotations.find(function(a){return a.id===annCtx.editingId;});return a&&a.note?a.note:'';}()):'';
  document.getElementById('pop-del').style.display=annCtx.editingId?'':'none';
  var pw=Math.min(320,window.innerWidth*0.9);
  var top=rect?(rect.bottom+window.scrollY+8):(window.innerHeight/2);
  var left=rect?rect.left:Math.max(8,(window.innerWidth-pw)/2);
  if(left+pw>window.innerWidth-8) left=window.innerWidth-pw-8;
  if(top+220>window.innerHeight+window.scrollY&&rect) top=rect.top+window.scrollY-228;
  popup.style.top=Math.max(8,top)+'px';
  popup.style.left=Math.max(8,left)+'px';
  popup.classList.add('open');
  document.getElementById('pop-corr').focus();
}
export function closeAnnotPopup(){document.getElementById('annot-popup').classList.remove('open');annCtx.editingId=null;}
export function saveAnnotation(){
  var corr=document.getElementById('pop-corr').value.trim();
  if(!corr){toast('Please enter a correction');return;}
  var note=document.getElementById('pop-note').value.trim();
  var e=S.entries.find(function(x){return x.id===annCtx.journalId;});
  if(!e) return;
  if(annCtx.editingId){
    var ann=e.annotations.find(function(a){return a.id===annCtx.editingId;});
    if(ann){ann.correction=corr;ann.note=note;}
  } else {
    e.annotations.push({id:'a'+Date.now(),start:annCtx.selStart,end:annCtx.selEnd,original:annCtx.selText,correction:corr,note:note});
  }
  saveEntryRecord(e); closeAnnotPopup(); renderReviewBody(e); toast('Annotation saved!');
}
export function deleteAnnotation(){
  if(!annCtx.editingId) return;
  var e=S.entries.find(function(x){return x.id===annCtx.journalId;});
  if(!e) return;
  e.annotations=e.annotations.filter(function(a){return a.id!==annCtx.editingId;});
  saveEntryRecord(e); closeAnnotPopup(); renderReviewBody(e); toast('Annotation removed');
}
export function editAnnotation(journalId,annId){
  var e=S.entries.find(function(x){return x.id===journalId;});
  if(!e) return;
  var ann=e.annotations.find(function(a){return a.id===annId;});
  if(!ann) return;
  annCtx.journalId=journalId;annCtx.editingId=annId;
  annCtx.selText=ann.original;annCtx.selStart=ann.start;annCtx.selEnd=ann.end;
  var cx=window.innerWidth/2;var cy=window.innerHeight/2;
  openAnnotPopup({bottom:cy+20,left:cx-140,top:cy-200});
}
