export function esc(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
export function fmtDate(d){
  var dt=new Date(d+'T00:00:00');
  return dt.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
}
export function toast(msg){
  var t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('show');clearTimeout(t._t);
  t._t=setTimeout(function(){t.classList.remove('show');},2600);
}
export function statusPill(s){
  if(s==='reviewed') return '<span class="pill pill-v">✓ Reviewed</span>';
  if(s==='submitted') return '<span class="pill pill-g">📤 Submitted</span>';
  return '<span class="pill pill-m">Draft</span>';
}
export function renderEntryImgs(images,containerId){
  var el=document.getElementById(containerId);
  if(!el) return;
  if(!images||!images.length){el.innerHTML='';return;}
  el.innerHTML='<div class="entry-imgs">'+images.map(function(src){
    return '<img class="entry-img" src="'+src+'" onclick="viewImg(this.src)">';
  }).join('')+'</div>';
}
