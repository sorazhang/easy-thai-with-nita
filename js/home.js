import { S } from './data.js';
import { esc, fmtDate } from './utils.js';

export function renderHome(){
  var today=new Date().toISOString().slice(0,10);
  var hr=new Date().getHours();
  var greet=hr<12?'Good morning':hr<17?'Good afternoon':'Good evening';
  document.getElementById('dash-hi').textContent=greet+', '+S.user+'! 👋';
  document.getElementById('dash-sub').textContent='Keep up the great work with your Thai 🌟';
  var upcoming=S.sessions.filter(function(s){return s.date>=today;})
    .sort(function(a,b){return a.date<b.date?-1:1;})[0];
  var nxt=document.getElementById('dash-next-session');
  if(upcoming){
    nxt.innerHTML='<div class="dash-next" onclick="navTo(\'notes\')">'
      +'<div class="dash-next-date">📅 '+esc(fmtDate(upcoming.date))+'</div>'
      +'<div class="dash-next-topic">'+esc(upcoming.topicEn)+'</div>'
      +'<div class="dash-next-loc">'+esc(upcoming.location)+'</div>'
      +'</div>';
  } else {
    nxt.innerHTML='<div class="dash-next-none">No upcoming sessions — check back soon!</div>';
  }
  var pastCount=S.sessions.filter(function(s){return s.date<today;}).length;
  document.getElementById('stat-sessions').textContent=pastCount;
  document.getElementById('stat-words').textContent=S.cards.length;
  document.getElementById('stat-entries').textContent=S.entries.length;
}
