import { S, saveCards } from './data.js';
import { esc, toast } from './utils.js';

var studyQ=[], studyIdx=0;

export function renderCards(){
  document.getElementById('card-count').textContent='('+S.cards.length+')';
  document.getElementById('cards-grid').innerHTML=S.cards.map(function(c){
    var sentenceHtml=c.sentence?'<div class="ci-sentence">'+esc(c.sentence)+'</div>':'';
    return '<div class="card-item'+(c.status==='known'?' known':'')+'" onclick="toggleCardStatus(\''+c.id+'\')">'
      +'<div class="known-mark">✓</div>'
      +'<div class="ci-thai">'+esc(c.thai)+'</div>'
      +'<div class="ci-rom">'+esc(c.rom)+'</div>'
      +'<div class="ci-en">'+esc(c.en)+'</div>'
      +sentenceHtml
      +'<div class="ci-cat"><span class="pill pill-g">'+esc(c.cat)+'</span></div>'
      +'</div>';
  }).join('');
}
export function toggleCardStatus(id){
  var c=S.cards.find(function(x){return x.id===id;});
  if(!c) return;
  c.status=c.status==='known'?'learning':'known';
  saveCards(); renderCards();
}
export function toggleAddCard(){document.getElementById('add-card-form').classList.toggle('open');}
export function saveNewCard(){
  var thai=document.getElementById('cf-thai').value.trim();
  var rom=document.getElementById('cf-rom').value.trim();
  var en=document.getElementById('cf-en').value.trim();
  var cat=document.getElementById('cf-cat').value.trim();
  if(!thai||!en){toast('Thai and English fields are required');return;}
  S.cards.push({id:'c'+Date.now(),thai:thai,rom:rom,en:en,cat:cat||'General',status:'new'});
  saveCards();
  ['cf-thai','cf-rom','cf-en','cf-cat'].forEach(function(id){document.getElementById(id).value='';});
  document.getElementById('add-card-form').classList.remove('open');
  renderCards(); toast('Card added!');
}
export function startStudy(){
  studyQ=S.cards.filter(function(c){return c.status!=='known';});
  if(!studyQ.length) studyQ=S.cards.slice();
  if(!studyQ.length){toast('No cards to study!');return;}
  for(var i=studyQ.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var tmp=studyQ[i];studyQ[i]=studyQ[j];studyQ[j]=tmp;}
  studyIdx=0;
  document.getElementById('study-mode').classList.add('open');
  loadStudyCard();
}
function loadStudyCard(){
  var total=studyQ.length;
  document.getElementById('study-prog').style.width=((studyIdx/total)*100)+'%';
  document.getElementById('study-ct').textContent=(studyIdx+1)+'/'+total;
  var c=studyQ[studyIdx];
  document.getElementById('flip-thai').textContent=c.thai;
  document.getElementById('flip-rom-front').textContent=c.rom;
  document.getElementById('flip-en').textContent=c.en;
  document.getElementById('flip-rom').textContent=c.rom;
  document.getElementById('flip-card').classList.remove('flipped');
}
export function flipCard(){document.getElementById('flip-card').classList.toggle('flipped');}
export function studyNext(ok){
  if(ok){var c=S.cards.find(function(x){return x.id===studyQ[studyIdx].id;});if(c){c.status='known';saveCards();}}
  studyIdx++;
  if(studyIdx>=studyQ.length){endStudy();renderCards();toast('Study session complete!');return;}
  loadStudyCard();
}
export function endStudy(){document.getElementById('study-mode').classList.remove('open');}
