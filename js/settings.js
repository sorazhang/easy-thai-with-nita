import { S } from './data.js';

export function setTheme(t){
  document.documentElement.setAttribute('data-theme',t);
  localStorage.setItem('nita_theme',t);
  document.getElementById('theme-pill-dark').classList.toggle('active',t==='dark');
  document.getElementById('theme-pill-light').classList.toggle('active',t==='light');
}
export function renderSettings(){
  var t=localStorage.getItem('nita_theme')||'light';
  document.getElementById('theme-pill-dark').classList.toggle('active',t==='dark');
  document.getElementById('theme-pill-light').classList.toggle('active',t==='light');
  document.getElementById('set-user-name').textContent=S.user||'—';
  document.getElementById('set-user-role').textContent=S.role==='teacher'?'Teacher · Kru Nita':'Student';
}
