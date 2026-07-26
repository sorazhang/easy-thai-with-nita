var galleryIdx=0,GALLERY_TOTAL=5,galleryTouchX=0;
export function galleryMove(dir){
  galleryIdx=(galleryIdx+dir+GALLERY_TOTAL)%GALLERY_TOTAL;
  var track=document.getElementById('gallery-track');
  if(track) track.style.transform='translateX(calc(-'+galleryIdx+'*100vw))';
  document.querySelectorAll('.g-dot').forEach(function(d,i){d.classList.toggle('active',i===galleryIdx);});
}
(function(){
  var g=document.querySelector('.w-gallery');
  if(!g) return;
  g.addEventListener('touchstart',function(e){galleryTouchX=e.touches[0].clientX;},{passive:true});
  g.addEventListener('touchend',function(e){
    var dx=e.changedTouches[0].clientX-galleryTouchX;
    if(Math.abs(dx)>40) galleryMove(dx<0?1:-1);
  },{passive:true});
})();
