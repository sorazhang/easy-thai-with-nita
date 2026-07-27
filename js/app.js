import { TEACHER_EMAIL, fbAuth } from './firebase.js';
import { S, loadData } from './data.js';
import { galleryMove } from './gallery.js';
import { toggleAuthMode, submitAuth, resetPassword } from './auth.js';
import { startApp, openNav, closeNav, navTo, logout, switchRole } from './nav.js';
import {
  toggleAddSession, saveSession, closeSession, addSessionCards,
  openSession, openAddWordModalByIdx, closeAddWordModal, confirmAddWord,
  handleSessionImages, removeSdImg, postSessionUpdate
} from './sessions.js';
import { toggleAddCard, startStudy, saveNewCard, toggleCardStatus, flipCard, studyNext, endStudy } from './cards.js';
import {
  handleJournalImages, closeEditor, saveDraft, submitJournal, openEditor,
  shareJournal, openEntry, removeJImg, viewImg, closeImgViewer, closeEntryRead
} from './journal.js';
import {
  closeReview, sendReview, openReview, saveAnnotation, deleteAnnotation,
  closeAnnotPopup, toggleNote, editAnnotation
} from './annotations.js';
import { setTheme } from './settings.js';

/* Apply saved theme immediately so there's no flash */
(function(){
  var savedTheme=localStorage.getItem('nita_theme')||'light';
  document.documentElement.setAttribute('data-theme',savedTheme);
})();

document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){closeAnnotPopup();closeAddWordModal();}
});

fbAuth.onAuthStateChanged(function(user){
  if(user){
    var role = user.email === TEACHER_EMAIL ? 'teacher' : 'student';
    var name = user.displayName || user.email.split('@')[0];
    loadData(user.uid, function(d){
      S.sessions=d.sessions; S.cards=d.cards; S.entries=d.entries;
      startApp(name, role);
    });
  } else {
    S.user=null; S.role=null;
    document.getElementById('app').classList.remove('visible');
    document.getElementById('welcome').classList.remove('out');
    document.getElementById('wl-email').value='';
    document.getElementById('wl-password').value='';
    document.getElementById('wl-err').textContent='';
  }
});

/* Expose functions referenced by inline HTML event handlers (onclick, onchange) */
Object.assign(window, {
  galleryMove,
  toggleAuthMode, submitAuth, resetPassword,
  openNav, closeNav, navTo, logout, switchRole,
  toggleAddSession, saveSession, closeSession, addSessionCards,
  openSession, openAddWordModalByIdx, closeAddWordModal, confirmAddWord,
  handleSessionImages, removeSdImg, postSessionUpdate,
  toggleAddCard, startStudy, saveNewCard, toggleCardStatus, flipCard, studyNext, endStudy,
  handleJournalImages, closeEditor, saveDraft, submitJournal, openEditor,
  shareJournal, openEntry, removeJImg, viewImg, closeImgViewer, closeEntryRead,
  closeReview, sendReview, openReview, saveAnnotation, deleteAnnotation,
  closeAnnotPopup, toggleNote, editAnnotation,
  setTheme
});
