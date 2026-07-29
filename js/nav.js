import { S } from './data.js';
import { fbAuth } from './firebase.js';
import { toast } from './utils.js';
import { renderHome } from './home.js';
import { renderSessions } from './sessions.js';
import { renderCards } from './cards.js';
import { renderJournalList } from './journal.js';
import { renderNitaQueue, closeAnnotPopup } from './annotations.js';
import { renderSettings } from './settings.js';
import { renderAssignmentsTeacher, renderAssignmentsStudent, updateAssignmentBadge, closeMarkPopup } from './assignments.js';

export function startApp(user,role){
  S.user=user; S.role=role;
  document.getElementById('welcome').classList.add('out');
  document.getElementById('app').classList.add('visible');
  updateBadge(); applyRoleUI(); updateSideNav(); navTo(role==='student'?'home':'notes');
}
export function switchRole(){
  var nr=S.role==='teacher'?'student':'teacher';
  S.role=nr;
  updateBadge(); applyRoleUI(); updateSideNav(); navTo(nr==='student'?'home':'notes');
  toast('Switched to '+(nr==='teacher'?'teacher':'student')+' view');
}
export function openNav(){
  document.getElementById('sidenav').classList.add('open');
  document.getElementById('nav-backdrop').classList.add('open');
}
export function closeNav(){
  document.getElementById('sidenav').classList.remove('open');
  document.getElementById('nav-backdrop').classList.remove('open');
}
export function updateSideNav(){
  var isT=S.role==='teacher';
  document.getElementById('sn-name').textContent=S.user||'';
  document.getElementById('sn-role-lbl').textContent=isT?'Teacher · Kru Nita':'Student';
  document.getElementById('sn-avatar').textContent=isT?'🌸':'🎓';
  document.getElementById('sn-j-lbl').textContent=isT?'Reviews':'My Journal';
  updateAssignmentBadge();
}
export function logout(){
  closeNav();
  fbAuth.signOut();
}
export function updateBadge(){
  document.getElementById('role-badge').textContent=S.role==='teacher'?'👩‍🏫 Kru Nita':'🎓 '+S.user;
}
export function applyRoleUI(){
  var isT=S.role==='teacher';
  document.getElementById('add-session-btn').style.display=isT?'':'none';
  document.getElementById('student-journal').style.display=isT?'none':'';
  document.getElementById('teacher-reviews').style.display=isT?'':'none';
  document.getElementById('student-assignments').style.display=isT?'none':'';
  document.getElementById('teacher-assignments').style.display=isT?'':'none';
  document.getElementById('tab-j-lbl').textContent=isT?'Reviews':'Journal';
  var tabHome=document.getElementById('tab-home');
  var snHome=document.getElementById('sn-home');
  if(tabHome) tabHome.style.display=isT?'none':'';
  if(snHome) snHome.style.display=isT?'none':'';
}
export function navTo(t){
  ['home','notes','cards','journal','assignments','settings'].forEach(function(v){
    var view=document.getElementById('view-'+v); if(view) view.classList.remove('active');
    var tb=document.getElementById('tab-'+v); if(tb) tb.classList.remove('active');
    var sn=document.getElementById('sn-'+v); if(sn) sn.classList.remove('active');
  });
  var view=document.getElementById('view-'+t); if(view) view.classList.add('active');
  var tb=document.getElementById('tab-'+t); if(tb) tb.classList.add('active');
  var sn=document.getElementById('sn-'+t); if(sn) sn.classList.add('active');
  closeAnnotPopup();
  closeMarkPopup();
  if(t==='home') renderHome();
  if(t==='notes') renderSessions();
  if(t==='cards') renderCards();
  if(t==='journal'){S.role==='teacher'?renderNitaQueue():renderJournalList();}
  if(t==='assignments'){S.role==='teacher'?renderAssignmentsTeacher():renderAssignmentsStudent();}
  if(t==='settings') renderSettings();
}
