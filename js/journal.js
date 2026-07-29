import { S, saveEntryRecord } from './data.js';
import { esc, fmtDate, toast, statusPill, renderEntryImgs, resizeImageToLimit } from './utils.js';
import { renderAnnotatedText } from './annotations.js';

export function renderJournalList(){
  closeEntryRead(); closeEditor();
  var mine=S.entries.filter(function(e){return e.author===S.user||S.user==='Alex';});
  document.getElementById('journal-list').innerHTML=mine.length?mine.map(function(e){
    return '<div class="journal-card" onclick="openEntry(\''+e.id+'\')">'+'<div class="jc-title">'+esc(e.title)+'</div>'+'<div class="jc-preview">'+esc(e.body.slice(0,80))+(e.body.length>80?'…':'')+'</div>'+'<div class="jc-foot"><div class="jc-date">'+fmtDate(e.date)+'</div>'+statusPill(e.status)+'</div>'+'</div>';
  }).join(''):'<div class="empty-msg">No entries yet. Write your first entry!</div>';
}
/* ── Journal image helpers ── */
var jImgs=[];
export function handleJournalImages(input){
  var skipped=0;
  var files=Array.from(input.files);
  files.forEach(function(file){
    /* Reject files that are wildly oversized even before compression (>15 MB) */
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
        jImgs.push(resized);
        renderJImgStrip();
      });
    };
    reader.readAsDataURL(file);
  });
  input.value='';
}
export function renderJImgStrip(){
  var strip=document.getElementById('journal-img-strip');
  if(!strip) return;
  strip.innerHTML=jImgs.map(function(src,i){
    return '<div class="jimg-thumb"><img src="'+src+'"><button class="jimg-rm" onclick="removeJImg('+i+')">×</button></div>';
  }).join('');
}
export function removeJImg(i){jImgs.splice(i,1);renderJImgStrip();}
export function viewImg(src){
  document.getElementById('img-viewer-img').src=src;
  document.getElementById('img-viewer').classList.add('open');
}
export function closeImgViewer(){document.getElementById('img-viewer').classList.remove('open');}

export function openEditor(){
  jImgs=[];
  renderJImgStrip();
  document.getElementById('journal-list-area').style.display='none';
  document.getElementById('entry-read').classList.remove('open');
  document.getElementById('entry-editor').classList.add('open');
  document.getElementById('entry-title-in').value='';
  document.getElementById('entry-body-in').value='';
}
export function closeEditor(){
  document.getElementById('entry-editor').classList.remove('open');
  document.getElementById('journal-list-area').style.display='';
}
export function saveDraft(){
  var title=document.getElementById('entry-title-in').value.trim();
  var body=document.getElementById('entry-body-in').value.trim();
  if(!title||!body){toast('Please fill in title and body');return;}
  var newEntry={id:'j'+Date.now(),author:S.user,authorDisplay:S.user,title:title,body:body,images:jImgs.slice(),date:new Date().toISOString().slice(0,10),status:'draft',annotations:[],nitaComment:''};
  S.entries.push(newEntry);
  saveEntryRecord(newEntry); closeEditor(); renderJournalList(); toast('Draft saved!');
}
export function submitJournal(){
  var title=document.getElementById('entry-title-in').value.trim();
  var body=document.getElementById('entry-body-in').value.trim();
  if(!title||!body){toast('Please fill in title and body');return;}
  var newEntry={id:'j'+Date.now(),author:S.user,authorDisplay:S.user,title:title,body:body,images:jImgs.slice(),date:new Date().toISOString().slice(0,10),status:'submitted',annotations:[],nitaComment:''};
  S.entries.push(newEntry);
  saveEntryRecord(newEntry); closeEditor(); renderJournalList(); toast('Submitted to Kru Nita!');
}
var currentJournalId=null;
export function openEntry(id){
  currentJournalId=id;
  var e=S.entries.find(function(x){return x.id===id;});
  if(!e) return;
  document.getElementById('journal-list-area').style.display='none';
  document.getElementById('entry-editor').classList.remove('open');
  document.getElementById('entry-read').classList.add('open');
  document.getElementById('er-title').textContent=e.title;
  document.getElementById('er-meta').textContent=fmtDate(e.date);
  renderEntryImgs(e.images,'er-images');
  document.getElementById('er-body').innerHTML=renderAnnotatedText(e.body,e.annotations,{interactive:false});
  var fb=document.getElementById('er-feedback');
  if(e.status==='reviewed'&&e.nitaComment){
    fb.innerHTML='<div class="feedback-box"><div class="feedback-lbl">👩‍🏫 Nita\'s Feedback</div><div class="feedback-txt">'+esc(e.nitaComment)+'</div></div>';
  } else if(e.status==='submitted'){
    fb.innerHTML='<div class="pending-notice">📤 Submitted — waiting for Kru Nita\'s review</div>';
  } else {fb.innerHTML='';}
}
function addWatermark(b64,cb){
  var img=new Image();
  img.onload=function(){
    var c=document.createElement('canvas');
    c.width=img.width; c.height=img.height;
    var ctx=c.getContext('2d');
    ctx.drawImage(img,0,0);
    /* Watermark sizing */
    var fs=Math.max(18,Math.round(img.width/26));
    var pad=Math.round(fs*0.55);
    var label='Easy Thai With Nita  ·  @easythaiwithnita';
    ctx.font='bold '+fs+'px sans-serif';
    var tw=ctx.measureText(label).width;
    var bw=tw+pad*2.5, bh=fs+pad*1.6;
    var bx=img.width-bw-pad*1.5, by=img.height-bh-pad*1.5;
    /* Pill background */
    ctx.save();
    ctx.globalAlpha=0.52;
    ctx.fillStyle='#000';
    ctx.beginPath();
    var r=bh/2;
    ctx.moveTo(bx+r,by); ctx.lineTo(bx+bw-r,by);
    ctx.arcTo(bx+bw,by,bx+bw,by+bh,r);
    ctx.lineTo(bx+bw,by+bh-r);
    ctx.arcTo(bx+bw,by+bh,bx+bw-r,by+bh,r);
    ctx.lineTo(bx+r,by+bh);
    ctx.arcTo(bx,by+bh,bx,by+bh-r,r);
    ctx.lineTo(bx,by+r);
    ctx.arcTo(bx,by,bx+r,by,r);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    /* Gold text */
    ctx.globalAlpha=1;
    ctx.fillStyle='#84CC16';
    ctx.font='bold '+fs+'px sans-serif';
    ctx.textBaseline='middle';
    ctx.textAlign='left';
    ctx.fillText(label,bx+pad*1.25,by+bh/2);
    cb(c.toDataURL('image/jpeg',0.88));
  };
  img.src=b64;
}
function b64toFile(b64,name){
  var parts=b64.split(','),mime=parts[0].match(/:(.*?);/)[1];
  var bin=atob(parts[1]),len=bin.length,arr=new Uint8Array(len);
  for(var j=0;j<len;j++) arr[j]=bin.charCodeAt(j);
  return new File([arr],name,{type:mime});
}
export function shareJournal(){
  var e=S.entries.find(function(x){return x.id===currentJournalId;});
  if(!e) return;
  var caption=e.title+'\n\n'+e.body+'\n\n#EasyThaiWithNita #เรียนภาษาไทย #ThaiLanguage #HuaHin\n\nLearn Thai with us → easythaiwithnita.online';
  var images=e.images||[];
  if(!images.length){
    /* Text-only share */
    if(navigator.share){navigator.share({title:e.title,text:caption}).catch(function(){});}
    else{navigator.clipboard&&navigator.clipboard.writeText(caption);toast('Caption copied!');}
    return;
  }
  toast('Preparing images…');
  /* Watermark all images async then share */
  var watermarked=[],done=0;
  images.forEach(function(b64,i){
    addWatermark(b64,function(wm){
      watermarked[i]=wm;
      done++;
      if(done===images.length){
        var files=watermarked.map(function(w,k){return b64toFile(w,'nita-journal-'+(k+1)+'.jpg');});
        if(navigator.canShare&&navigator.canShare({files:files})){
          navigator.share({files:files,text:caption,title:e.title})
            .catch(function(err){if(err.name!=='AbortError') toast('Could not open share sheet');});
        } else if(navigator.share){
          navigator.share({title:e.title,text:caption}).catch(function(){});
        } else {
          var url=URL.createObjectURL(files[0]);
          var a=document.createElement('a');a.href=url;a.download=files[0].name;a.click();
          setTimeout(function(){URL.revokeObjectURL(url);},1000);
          navigator.clipboard&&navigator.clipboard.writeText(caption);
          toast('Image saved & caption copied!');
        }
      }
    });
  });
}
export function closeEntryRead(){
  document.getElementById('entry-read').classList.remove('open');
  document.getElementById('journal-list-area').style.display='';
}
