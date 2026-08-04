import { S } from './data.js';
import { esc, fmtDate } from './utils.js';
import { isPublished } from './sessions.js';

export function renderHome(){
  var today=new Date().toISOString().slice(0,10);
  var hr=new Date().getHours();
  var greet=hr<12?'Good morning':hr<17?'Good afternoon':'Good evening';
  document.getElementById('dash-hi').textContent=greet+', '+S.user+'! 👋';
  document.getElementById('dash-sub').textContent='Keep up the great work with your Thai 🌟';
  var visible=S.sessions.filter(isPublished);
  var upcoming=visible.filter(function(s){return s.date>=today;})
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
  var pastCount=visible.filter(function(s){return s.date<today;}).length;
  document.getElementById('stat-sessions').textContent=pastCount;
  document.getElementById('stat-words').textContent=S.cards.length;
  document.getElementById('stat-entries').textContent=S.entries.length;
  renderDashAssignments();
}
function dashAssignmentCard(a){
  var sub=a.submissions[S.uid];
  var unseen=sub.status==='reviewed'&&!sub.seenReview;
  return '<div class="journal-card" onclick="navTo(\'assignments\');openAssignmentStudent(\''+a.id+'\')">'
    +'<div class="jc-title">'+a.sentences.length+' sentence'+(a.sentences.length>1?'s':'')+' — Translation'+(unseen?' <span class="pill pill-r">New</span>':'')+'</div>'
    +'<div class="jc-preview">'+esc(a.sentences[0].th)+(a.sentences.length>1?'…':'')+'</div>'
    +'<div class="jc-foot"><div class="jc-date">'+fmtDate(a.createdDate)+'</div></div>'
    +'</div>';
}
function renderDashAssignments(){
  var mine=S.assignments.filter(function(a){return a.submissions&&a.submissions[S.uid];});
  var pending=mine.filter(function(a){return a.submissions[S.uid].status==='assigned';})
    .sort(function(a,b){return a.createdDate<b.createdDate?1:-1;});
  var reviewed=mine.filter(function(a){return a.submissions[S.uid].status==='reviewed';})
    .sort(function(a,b){return (a.submissions[S.uid].reviewedDate||'')<(b.submissions[S.uid].reviewedDate||'')?1:-1;});

  var pendingLbl=document.getElementById('dash-pending-lbl');
  var pendingEl=document.getElementById('dash-pending-assignments');
  if(pending.length){
    pendingLbl.style.display='';
    pendingEl.innerHTML=pending.map(dashAssignmentCard).join('');
  } else {
    pendingLbl.style.display='none';
    pendingEl.innerHTML='';
  }

  var reviewedLbl=document.getElementById('dash-reviewed-lbl');
  var reviewedEl=document.getElementById('dash-reviewed-assignments');
  if(reviewed.length){
    reviewedLbl.style.display='';
    reviewedEl.innerHTML=reviewed.slice(0,3).map(dashAssignmentCard).join('');
  } else {
    reviewedLbl.style.display='none';
    reviewedEl.innerHTML='';
  }
}
