import { S, saveAssignmentRecord } from './data.js';
import { esc, fmtDate, toast } from './utils.js';

var currentAssignmentId=null;
var currentReviewStudent=null;
var newSentences=[''];
var newAssignStudents=[];
var markCtx={sentenceIdx:null,editingId:null,selStart:0,selEnd:0,selText:''};

function knownStudentNames(){
  var names={};
  S.entries.forEach(function(e){ if(e.author) names[e.author]=true; });
  S.assignments.forEach(function(a){ (a.assignedTo||[]).forEach(function(n){ names[n]=true; }); });
  return Object.keys(names).sort();
}
function asgStatusPill(status){
  if(status==='reviewed') return '<span class="pill pill-v">✓ Reviewed</span>';
  if(status==='submitted') return '<span class="pill pill-g">📤 Submitted</span>';
  return '<span class="pill pill-r">🆕 New</span>';
}
export function unseenReviewedCount(){
  var n=0;
  S.assignments.forEach(function(a){
    var sub=a.submissions[S.user];
    if(sub&&sub.status==='reviewed'&&!sub.seenReview) n++;
  });
  return n;
}
export function updateAssignmentBadge(){
  var el=document.getElementById('sn-assign-badge');
  if(!el) return;
  var n=S.role==='teacher'?0:unseenReviewedCount();
  if(n>0){ el.textContent=n; el.style.display='inline-block'; }
  else { el.style.display='none'; }
}

/* ── Simple highlight+note marking (student's own working notes on a sentence) ── */
function renderMarkedText(text,marks,opts){
  opts=opts||{};
  var interactive=opts.interactive||false;
  var ms=(marks||[]).slice().sort(function(a,b){return a.start-b.start;});
  var result='';var cursor=0;
  ms.forEach(function(m){
    if(m.start>cursor) result+=mkMarkSeg(text.slice(cursor,m.start),cursor);
    result+=renderMark(m,interactive);
    cursor=m.end;
  });
  if(cursor<text.length) result+=mkMarkSeg(text.slice(cursor),cursor);
  return result;
}
function mkMarkSeg(text,start){
  if(!text) return '';
  return '<span class="mseg" data-start="'+start+'">'+esc(text)+'</span>';
}
function renderMark(m,interactive){
  var click=interactive?' onclick="editMark('+m.sentenceIdx+',\''+m.id+'\')"':'';
  var noteHtml=m.note?'<button class="chip-nb" onclick="toggleMarkNote(\''+m.id+'\');event.stopPropagation()">💬</button><span class="chip-note" id="mn-'+m.id+'">'+esc(m.note)+'</span>':'';
  return '<span class="mark"'+click+'>'+esc(m.text)+noteHtml+'</span>';
}
export function toggleMarkNote(id){var el=document.getElementById('mn-'+id);if(el) el.classList.toggle('open');}
function findMarkSeg(node){
  var n=node;
  while(n&&n!==document.body){
    if(n.nodeType===1&&n.classList&&n.classList.contains('mseg')) return n;
    n=n.parentNode;
  }
  return null;
}
export function onSentenceMouseUp(idx){
  setTimeout(function(){
    var sel=window.getSelection();
    if(!sel||sel.isCollapsed||!sel.toString().trim()) return;
    var range=sel.getRangeAt(0);
    var startSeg=findMarkSeg(range.startContainer);
    var endSeg=findMarkSeg(range.endContainer);
    if(!startSeg||!endSeg) return;
    var ss=parseInt(startSeg.dataset.start,10);
    var es=parseInt(endSeg.dataset.start,10);
    var absStart=ss+range.startOffset;
    var absEnd=es+range.endOffset;
    if(absStart>=absEnd) return;
    var asg=S.assignments.find(function(x){return x.id===currentAssignmentId;});
    if(!asg) return;
    var sentence=asg.sentences[idx].th;
    markCtx.sentenceIdx=idx;
    markCtx.editingId=null;
    markCtx.selStart=absStart;
    markCtx.selEnd=absEnd;
    markCtx.selText=sentence.slice(absStart,absEnd);
    var rect=range.getBoundingClientRect();
    sel.removeAllRanges();
    openMarkPopup(rect);
  },10);
}
function currentAnswers(){
  var asg=S.assignments.find(function(x){return x.id===currentAssignmentId;});
  var sub=asg&&asg.submissions[S.user];
  return sub?sub.answers:null;
}
function openMarkPopup(rect){
  var popup=document.getElementById('mark-popup');
  document.getElementById('mark-pop-sel').textContent=markCtx.selText;
  var existingNote='';
  if(markCtx.editingId){
    var answers=currentAnswers();
    var ann=answers&&answers[markCtx.sentenceIdx].annotations.find(function(x){return x.id===markCtx.editingId;});
    existingNote=ann&&ann.note?ann.note:'';
  }
  document.getElementById('mark-pop-note').value=existingNote;
  document.getElementById('mark-pop-del').style.display=markCtx.editingId?'':'none';
  var pw=Math.min(300,window.innerWidth*0.9);
  var top=rect?(rect.bottom+window.scrollY+8):(window.innerHeight/2);
  var left=rect?rect.left:Math.max(8,(window.innerWidth-pw)/2);
  if(left+pw>window.innerWidth-8) left=window.innerWidth-pw-8;
  if(top+180>window.innerHeight+window.scrollY&&rect) top=rect.top+window.scrollY-190;
  popup.style.top=Math.max(8,top)+'px';
  popup.style.left=Math.max(8,left)+'px';
  popup.classList.add('open');
  document.getElementById('mark-pop-note').focus();
}
export function closeMarkPopup(){
  var el=document.getElementById('mark-popup');
  if(el) el.classList.remove('open');
  markCtx.editingId=null;
}
function renderSentenceMarkedText(idx){
  var asg=S.assignments.find(function(x){return x.id===currentAssignmentId;});
  var answers=currentAnswers();
  if(!asg||!answers) return;
  var sentence=asg.sentences[idx].th;
  var marks=(answers[idx].annotations||[]).map(function(m){ m.sentenceIdx=idx; return m; });
  var el=document.getElementById('asg-sent-'+idx);
  if(el) el.innerHTML=renderMarkedText(sentence,marks,{interactive:true});
}
export function saveMark(){
  var note=document.getElementById('mark-pop-note').value.trim();
  var answers=currentAnswers();
  if(!answers) return;
  var ans=answers[markCtx.sentenceIdx];
  if(markCtx.editingId){
    var m=ans.annotations.find(function(x){return x.id===markCtx.editingId;});
    if(m) m.note=note;
  } else {
    ans.annotations.push({id:'m'+Date.now(),start:markCtx.selStart,end:markCtx.selEnd,text:markCtx.selText,note:note});
  }
  var idx=markCtx.sentenceIdx;
  closeMarkPopup();
  renderSentenceMarkedText(idx);
}
export function deleteMark(){
  if(!markCtx.editingId) return;
  var answers=currentAnswers();
  if(!answers) return;
  var ans=answers[markCtx.sentenceIdx];
  ans.annotations=ans.annotations.filter(function(x){return x.id!==markCtx.editingId;});
  var idx=markCtx.sentenceIdx;
  closeMarkPopup();
  renderSentenceMarkedText(idx);
}
export function editMark(sentenceIdx,markId){
  markCtx.sentenceIdx=sentenceIdx;
  markCtx.editingId=markId;
  var answers=currentAnswers();
  var ans=answers&&answers[sentenceIdx];
  var m=ans&&ans.annotations.find(function(x){return x.id===markId;});
  markCtx.selText=m?m.text:'';
  var cx=window.innerWidth/2;var cy=window.innerHeight/2;
  openMarkPopup({bottom:cy+20,left:cx-140,top:cy-200});
}

/* ── Teacher: create + publish ── */
export function toggleAddAssignment(){
  var form=document.getElementById('add-assignment-form');
  var opening=!form.classList.contains('open');
  form.classList.toggle('open');
  if(opening){
    newSentences=[''];
    newAssignStudents=[];
    renderSentenceFields();
    renderStudentPicker();
  }
}
function renderSentenceFields(){
  var el=document.getElementById('asg-sentences-list');
  el.innerHTML=newSentences.map(function(s,i){
    return '<div class="form-row" style="display:flex;gap:.4rem;align-items:center">'
      +'<input class="form-input" style="flex:1" value="'+esc(s)+'" oninput="updateSentenceField('+i+',this.value)" placeholder="Sentence '+(i+1)+' in Thai">'
      +(newSentences.length>1?'<button class="jimg-rm" onclick="removeSentenceField('+i+')">×</button>':'')
      +'</div>';
  }).join('');
}
export function updateSentenceField(i,val){ newSentences[i]=val; }
export function addSentenceField(){ newSentences.push(''); renderSentenceFields(); }
export function removeSentenceField(i){ newSentences.splice(i,1); renderSentenceFields(); }
function renderStudentPicker(){
  var el=document.getElementById('asg-student-picker');
  var names=knownStudentNames();
  if(!names.length){ el.innerHTML='<div class="empty-msg" style="padding:.5rem 0">No students yet — they need to log in or submit a journal entry first.</div>'; return; }
  el.innerHTML=names.map(function(n){
    var checked=newAssignStudents.indexOf(n)!==-1;
    return '<label style="display:flex;align-items:center;gap:.5rem;padding:.35rem 0">'
      +'<input type="checkbox" '+(checked?'checked':'')+' onchange="toggleAssignStudent(\''+n+'\')"> '+esc(n)
      +'</label>';
  }).join('');
}
export function toggleAssignStudent(name){
  var i=newAssignStudents.indexOf(name);
  if(i===-1) newAssignStudents.push(name); else newAssignStudents.splice(i,1);
}
export function publishAssignment(){
  var sentences=newSentences.map(function(s){return s.trim();}).filter(Boolean);
  if(!sentences.length){ toast('Add at least one sentence'); return; }
  if(!newAssignStudents.length){ toast('Select at least one student'); return; }
  var submissions={};
  newAssignStudents.forEach(function(name){
    submissions[name]={status:'assigned',answers:sentences.map(function(){return {answer:'',annotations:[]};}),comment:'',seenReview:false,submittedDate:null,reviewedDate:null};
  });
  var newAssignment={
    id:'asg'+Date.now(),type:'translation',
    sentences:sentences.map(function(th){return {th:th};}),
    assignedTo:newAssignStudents.slice(),
    createdDate:new Date().toISOString().slice(0,10),
    submissions:submissions
  };
  S.assignments.unshift(newAssignment);
  saveAssignmentRecord(newAssignment);
  document.getElementById('add-assignment-form').classList.remove('open');
  renderAssignmentsTeacher();
  toast('Assignment published!');
}

/* ── Teacher: list + review ── */
export function renderAssignmentsTeacher(){
  closeAssignmentDetailTeacher();
  var el=document.getElementById('assignment-list-teacher');
  if(!el) return;
  if(!S.assignments.length){ el.innerHTML='<div class="empty-msg">No assignments yet.</div>'; return; }
  el.innerHTML=S.assignments.slice().sort(function(a,b){return a.createdDate<b.createdDate?1:-1;}).map(function(a){
    var subs=(a.assignedTo||[]).map(function(name){
      var s=a.submissions[name]||{status:'assigned'};
      return esc(name)+' '+asgStatusPill(s.status);
    }).join(' &nbsp; ');
    return '<div class="journal-card" onclick="openAssignmentTeacher(\''+a.id+'\')">'
      +'<div class="jc-title">'+a.sentences.length+' sentence'+(a.sentences.length>1?'s':'')+' — Translation</div>'
      +'<div class="jc-preview">'+subs+'</div>'
      +'<div class="jc-foot"><div class="jc-date">'+fmtDate(a.createdDate)+'</div></div>'
      +'</div>';
  }).join('');
}
export function openAssignmentTeacher(id){
  var asg=S.assignments.find(function(x){return x.id===id;});
  if(!asg) return;
  currentAssignmentId=id;
  currentReviewStudent=null;
  document.getElementById('assignment-list-area-teacher').style.display='none';
  document.getElementById('assignment-detail-teacher').style.display='block';
  renderTeacherStudentList(asg);
}
function renderTeacherStudentList(asg){
  document.getElementById('asg-t-title').textContent=asg.sentences.length+' sentence'+(asg.sentences.length>1?'s':'')+' — Translation';
  document.getElementById('asg-t-meta').textContent='Assigned '+fmtDate(asg.createdDate);
  document.getElementById('asg-t-sentences-ref').innerHTML=asg.sentences.map(function(s,i){
    return '<div class="phrase-item"><div class="ph-th">'+(i+1)+'. '+esc(s.th)+'</div></div>';
  }).join('');
  document.getElementById('asg-t-students').innerHTML=(asg.assignedTo||[]).map(function(name){
    var sub=asg.submissions[name]||{status:'assigned'};
    var canReview=sub.status==='submitted'||sub.status==='reviewed';
    return '<div class="session-card" '+(canReview?'onclick="openStudentSubmission(\''+name+'\')"':'style="opacity:.55;cursor:default"')+'>'
      +'<div class="sc-topic">'+esc(name)+'</div>'
      +'<div class="sc-pills">'+asgStatusPill(sub.status)+(canReview?'':' <span class="pill pill-m">waiting for submission</span>')+'</div>'
      +'</div>';
  }).join('');
  document.getElementById('asg-t-review-panel').style.display='none';
}
export function closeAssignmentDetailTeacher(){
  currentAssignmentId=null; currentReviewStudent=null;
  var d=document.getElementById('assignment-detail-teacher'); if(d) d.style.display='none';
  var l=document.getElementById('assignment-list-area-teacher'); if(l) l.style.display='';
}
export function openStudentSubmission(name){
  var asg=S.assignments.find(function(x){return x.id===currentAssignmentId;});
  if(!asg) return;
  var sub=asg.submissions[name];
  if(!sub) return;
  currentReviewStudent=name;
  document.getElementById('asg-t-review-title').textContent=name+"'s Answers";
  document.getElementById('asg-t-review-body').innerHTML=asg.sentences.map(function(s,i){
    var ans=sub.answers[i]||{answer:'',annotations:[]};
    var marks=(ans.annotations||[]).map(function(m){ m.sentenceIdx=i; return m; });
    var markedHtml=renderMarkedText(s.th,marks,{interactive:false});
    return '<div class="section-label">Sentence '+(i+1)+'</div>'
      +'<div class="ann-text">'+markedHtml+'</div>'
      +'<div class="entry-field" style="white-space:pre-wrap;background:var(--card2)">'+esc(ans.answer||'(no answer)')+'</div>';
  }).join('');
  document.getElementById('asg-t-comment').value=sub.comment||'';
  document.getElementById('asg-t-review-panel').style.display='block';
}
export function sendAssignmentReview(){
  var asg=S.assignments.find(function(x){return x.id===currentAssignmentId;});
  if(!asg||!currentReviewStudent) return;
  var sub=asg.submissions[currentReviewStudent];
  if(!sub) return;
  sub.comment=document.getElementById('asg-t-comment').value.trim();
  sub.status='reviewed';
  sub.seenReview=false;
  sub.reviewedDate=new Date().toISOString().slice(0,10);
  saveAssignmentRecord(asg);
  var student=currentReviewStudent;
  renderTeacherStudentList(asg);
  toast('Feedback sent to '+student+'!');
}

/* ── Student: queue + open + submit ── */
export function renderAssignmentsStudent(){
  closeAssignmentDetailStudent();
  var mine=S.assignments.filter(function(a){return (a.assignedTo||[]).indexOf(S.user)!==-1;});
  var el=document.getElementById('assignment-list-student');
  if(el){
    if(!mine.length){ el.innerHTML='<div class="empty-msg">No assignments yet.</div>'; }
    else {
      el.innerHTML=mine.slice().sort(function(a,b){return a.createdDate<b.createdDate?1:-1;}).map(function(a){
        var sub=a.submissions[S.user]||{status:'assigned'};
        return '<div class="journal-card" onclick="openAssignmentStudent(\''+a.id+'\')">'
          +'<div class="jc-title">'+a.sentences.length+' sentence'+(a.sentences.length>1?'s':'')+' — Translation</div>'
          +'<div class="jc-preview">'+esc(a.sentences[0].th)+(a.sentences.length>1?'…':'')+'</div>'
          +'<div class="jc-foot"><div class="jc-date">'+fmtDate(a.createdDate)+'</div>'+asgStatusPill(sub.status)+'</div>'
          +'</div>';
      }).join('');
    }
  }
  updateAssignmentBadge();
}
export function closeAssignmentDetailStudent(){
  currentAssignmentId=null;
  var d=document.getElementById('assignment-detail'); if(d) d.style.display='none';
  var l=document.getElementById('assignment-list-area'); if(l) l.style.display='';
}
export function openAssignmentStudent(id){
  var asg=S.assignments.find(function(x){return x.id===id;});
  if(!asg) return;
  var sub=asg.submissions[S.user];
  if(!sub) return;
  currentAssignmentId=id;
  document.getElementById('assignment-list-area').style.display='none';
  document.getElementById('assignment-detail').style.display='block';
  document.getElementById('asg-meta').textContent=fmtDate(asg.createdDate)+' · '+asg.sentences.length+' sentence'+(asg.sentences.length>1?'s':'');
  var readOnly=sub.status!=='assigned';
  document.getElementById('asg-sentences').innerHTML=asg.sentences.map(function(s,i){
    var ans=sub.answers[i]||{answer:'',annotations:[]};
    var marks=(ans.annotations||[]).map(function(m){ m.sentenceIdx=i; return m; });
    var markedHtml=renderMarkedText(s.th,marks,{interactive:!readOnly});
    var mouseHandlers=readOnly?'':' onmouseup="onSentenceMouseUp('+i+')" ontouchend="onSentenceMouseUp('+i+')"';
    return '<div class="section-label">Sentence '+(i+1)+'</div>'
      +'<div class="ann-text'+(readOnly?'':' interactive')+'" id="asg-sent-'+i+'"'+mouseHandlers+'>'+markedHtml+'</div>'
      +(readOnly
        ?'<div class="entry-field" style="white-space:pre-wrap;background:var(--card2)">'+esc(ans.answer||'(no answer)')+'</div>'
        :'<textarea class="entry-field" id="asg-answer-'+i+'" placeholder="Your English translation…">'+esc(ans.answer)+'</textarea>');
  }).join('');
  document.getElementById('asg-submit-btn').style.display=sub.status==='assigned'?'':'none';
  var fb=document.getElementById('asg-feedback');
  if(sub.status==='submitted'){
    fb.innerHTML='<div class="pending-notice">📤 Submitted — waiting for Kru Nita\'s review</div>';
  } else if(sub.status==='reviewed'){
    fb.innerHTML='<div class="feedback-box"><div class="feedback-lbl">👩‍🏫 Nita\'s Feedback</div><div class="feedback-txt">'+esc(sub.comment||'(no comment)')+'</div></div>';
    if(!sub.seenReview){
      sub.seenReview=true;
      saveAssignmentRecord(asg);
      updateAssignmentBadge();
    }
  } else {
    fb.innerHTML='';
  }
}
export function submitAssignment(){
  var asg=S.assignments.find(function(x){return x.id===currentAssignmentId;});
  if(!asg) return;
  var sub=asg.submissions[S.user];
  if(!sub) return;
  asg.sentences.forEach(function(s,i){
    var ta=document.getElementById('asg-answer-'+i);
    if(ta) sub.answers[i].answer=ta.value.trim();
  });
  sub.status='submitted';
  sub.submittedDate=new Date().toISOString().slice(0,10);
  saveAssignmentRecord(asg);
  openAssignmentStudent(currentAssignmentId);
  renderAssignmentsStudent();
  toast('Assignment submitted!');
}
