import { fbAuth } from './firebase.js';

var authMode = 'login'; // 'login' or 'signup'
export function toggleAuthMode(){
  authMode = authMode === 'login' ? 'signup' : 'login';
  document.getElementById('wl-title').textContent = authMode === 'login' ? 'Welcome back' : 'Create account';
  document.getElementById('wl-submit-btn').textContent = authMode === 'login' ? 'Log In' : 'Sign Up';
  document.getElementById('wl-toggle').innerHTML = authMode === 'login'
    ? 'New here? <a onclick="toggleAuthMode()">Create account</a>'
    : 'Already have an account? <a onclick="toggleAuthMode()">Log in</a>';
  document.getElementById('wl-err').textContent = '';
  document.getElementById('wl-password').setAttribute('autocomplete', authMode === 'login' ? 'current-password' : 'new-password');
}
export function submitAuth(){
  var email = document.getElementById('wl-email').value.trim();
  var pass = document.getElementById('wl-password').value;
  var errEl = document.getElementById('wl-err');
  errEl.textContent = '';
  if(!email || !pass){ errEl.textContent = 'Please enter email and password.'; return; }
  var p = authMode === 'login'
    ? fbAuth.signInWithEmailAndPassword(email, pass)
    : fbAuth.createUserWithEmailAndPassword(email, pass);
  p.catch(function(err){
    var msgs = {
      'auth/user-not-found':'No account with that email.',
      'auth/wrong-password':'Incorrect password.',
      'auth/email-already-in-use':'Email already registered — try logging in.',
      'auth/weak-password':'Password must be at least 6 characters.',
      'auth/invalid-email':'Please enter a valid email.'
    };
    errEl.textContent = msgs[err.code] || 'Something went wrong. Please try again.';
  });
}
export function resetPassword(){
  var email = document.getElementById('wl-email').value.trim();
  var errEl = document.getElementById('wl-err');
  if(!email){ errEl.textContent = 'Enter your email above first.'; return; }
  fbAuth.sendPasswordResetEmail(email).then(function(){
    errEl.style.color = 'var(--green)';
    errEl.textContent = 'Reset link sent — check your inbox.';
  }).catch(function(err){
    errEl.style.color = 'var(--red)';
    errEl.textContent = err.code === 'auth/user-not-found' ? 'No account with that email.' : 'Could not send reset email.';
  });
}

document.getElementById('wl-password').addEventListener('keydown',function(e){if(e.key==='Enter') submitAuth();});
document.getElementById('wl-email').addEventListener('keydown',function(e){if(e.key==='Enter') document.getElementById('wl-password').focus();});
