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
export var MAX_IMG_BYTES=2*1024*1024; /* 2 MB limit per image */
export function resizeImageToLimit(src,cb){
  var img=new Image();
  img.onload=function(){
    var maxW=1200,w=img.width,h=img.height;
    if(w>maxW){h=Math.round(h*maxW/w);w=maxW;}
    var c=document.createElement('canvas');
    c.width=w;c.height=h;
    c.getContext('2d').drawImage(img,0,0,w,h);
    /* Try reducing quality until output is under MAX_IMG_BYTES */
    var quality=0.78;
    var result;
    while(quality>=0.3){
      result=c.toDataURL('image/jpeg',quality);
      /* base64 overhead: actual bytes ≈ length * 0.75 */
      if(result.length*0.75<=MAX_IMG_BYTES) break;
      quality=Math.round((quality-0.1)*10)/10;
    }
    cb(result.length*0.75<=MAX_IMG_BYTES?result:null);
  };
  img.src=src;
}
