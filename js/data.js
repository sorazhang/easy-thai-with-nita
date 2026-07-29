import { fbAuth, fbDb } from './firebase.js';

export const SEED = {
  sessions:[
    {
      id:'s1',date:'2025-07-05',location:'Mango Café',
      topicEn:'Greetings & Introduction',topicTh:'การทักทายและการแนะนำตัว',
      vocab:[
        {th:'สวัสดี',rom:'sawadee',en:'Hello / Goodbye'},
        {th:'ขอบคุณ',rom:'khob khun',en:'Thank you'},
        {th:'ชื่อ',rom:'chûe',en:'Name'},
        {th:'ยินดีที่ได้รู้จัก',rom:'yin dee thi dai ruu jak',en:'Nice to meet you'},
        {th:'มาจากไหน',rom:'maa jaak nai',en:'Where are you from?'}
      ],
      phrases:[
        {th:'ผม/ฉันชื่อ…',en:'My name is…'},
        {th:'คุณชื่ออะไร?',en:'What\'s your name?'},
        {th:'ยินดีที่ได้รู้จักครับ/ค่ะ',en:'Nice to meet you (polite)'}
      ],
      note:'Remember to add ครับ (men) or ค่ะ (women) at the end of sentences to sound polite. Thai politeness particles are not optional in formal situations — Thais will immediately notice their absence!'
    },
    {
      id:'s2',date:'2025-07-12',location:'The Bean Café',
      topicEn:'Ordering at the Café',topicTh:'การสั่งอาหารที่คาเฟ่',
      vocab:[
        {th:'กาแฟ',rom:'gaa-fae',en:'Coffee'},
        {th:'น้ำ',rom:'náam',en:'Water'},
        {th:'อร่อย',rom:'a-roi',en:'Delicious'},
        {th:'เผ็ด',rom:'pèt',en:'Spicy'},
        {th:'เท่าไหร่',rom:'tao rai',en:'How much?'}
      ],
      phrases:[
        {th:'ขอ… หนึ่งแก้วครับ/ค่ะ',en:'One … please'},
        {th:'เผ็ดน้อยได้ไหม?',en:'Can you make it less spicy?'},
        {th:'อร่อยมากเลยครับ/ค่ะ',en:'This is very delicious!'}
      ],
      note:'Thai uses classifiers (ลักษณนาม) after numbers — e.g. หนึ่งแก้ว (one glass), สองจาน (two plates). The classifier changes depending on the type of object. This takes practice!'
    },
    {
      id:'s3',date:'2025-07-19',location:'Bloom Coffee',
      topicEn:'Numbers & Time',topicTh:'ตัวเลขและเวลา',
      vocab:[
        {th:'หนึ่ง',rom:'nùeng',en:'One'},
        {th:'สอง',rom:'sǒng',en:'Two'},
        {th:'สาม',rom:'sǎam',en:'Three'},
        {th:'ตอนนี้',rom:'dton née',en:'Right now / Currently'},
        {th:'วันนี้',rom:'wan née',en:'Today'}
      ],
      phrases:[
        {th:'ตอนนี้กี่โมง?',en:'What time is it now?'},
        {th:'วันนี้วันอะไร?',en:'What day is it today?'},
        {th:'เจอกันพรุ่งนี้นะ',en:'See you tomorrow!'}
      ],
      note:'Thai has two time systems: the formal 24-hour clock (นาฬิกา) and an informal 6-hour cycle system. Locals use the informal system daily — e.g. บ่ายสองโมง = 2 PM (literally "afternoon two bells").'
    },
    {
      id:'s4',date:'2026-07-19',location:'Loop Café & Stay',
      topicEn:'Colors & Descriptions',topicTh:'สีและการบรรยาย',
      vocab:[
        {th:'สีแดง',rom:'sǐi daeng',en:'Red'},
        {th:'สีน้ำเงิน',rom:'sǐi nám ngern',en:'Blue'},
        {th:'สีเขียว',rom:'sǐi khǐao',en:'Green'},
        {th:'สวย',rom:'sǔay',en:'Beautiful'},
        {th:'ใหญ่',rom:'yài',en:'Big'},
        {th:'เล็ก',rom:'lék',en:'Small'}
      ],
      phrases:[
        {th:'นั่นสวยมากเลย',en:'That\'s so beautiful!'},
        {th:'เสื้อสีอะไร?',en:'What color is the shirt?'},
        {th:'ใหญ่หรือเล็ก?',en:'Big or small?'},
        {th:'ฉันชอบสีนี้',en:'I like this color'}
      ],
      note:'Colors in Thai use the word สี (sǐi) meaning "color" before each hue — สีแดง (red), สีน้ำเงิน (blue). You can drop สี in casual speech once the context is clear, just like English. Adjectives in Thai always come AFTER the noun: กาแฟร้อน = coffee hot = hot coffee.'
    },
    {
      id:'s5',date:'2026-07-26',location:'Mango Café',
      topicEn:'At the Market',topicTh:'ที่ตลาด',
      vocab:[
        {th:'ตลาด',rom:'dtalàat',en:'Market'},
        {th:'ราคา',rom:'raa-khaa',en:'Price'},
        {th:'ถูก',rom:'thùuk',en:'Cheap'},
        {th:'แพง',rom:'phaeng',en:'Expensive'},
        {th:'ต่อรอง',rom:'dtò-rong',en:'To negotiate'},
        {th:'ผัก',rom:'phàk',en:'Vegetables'}
      ],
      phrases:[
        {th:'ราคาเท่าไหร่?',en:'How much is this?'},
        {th:'ลดราคาได้ไหม?',en:'Can you lower the price?'},
        {th:'ถูกกว่านี้ได้ไหม?',en:'Can it be any cheaper?'},
        {th:'แพงไปหน่อยนะ',en:'That\'s a bit expensive'}
      ],
      note:'Bargaining is totally normal and expected at Thai markets — the vendor sets a starting price and expects negotiation. Always smile and stay friendly! Start by offering about 60–70% of the asking price and meet somewhere in the middle. Never bargain aggressively; a light, playful tone goes a long way.'
    },
    {
      id:'s6',date:'2026-08-02',location:'The Bean Café',
      topicEn:'Directions & Getting Around',topicTh:'ทิศทางและการเดินทาง',
      vocab:[
        {th:'ซ้าย',rom:'sáai',en:'Left'},
        {th:'ขวา',rom:'khwǎa',en:'Right'},
        {th:'ตรงไป',rom:'trong pai',en:'Straight ahead'},
        {th:'ใกล้',rom:'glâi',en:'Near'},
        {th:'ไกล',rom:'glai',en:'Far'},
        {th:'สี่แยก',rom:'sìi yàek',en:'Intersection / Crossroads'}
      ],
      phrases:[
        {th:'ไปที่นั่นยังไง?',en:'How do I get there?'},
        {th:'ใกล้แค่ไหน?',en:'How near is it?'},
        {th:'เลี้ยวซ้าย/ขวาตรงนี้',en:'Turn left/right here'},
        {th:'ขอถามหน่อยได้ไหม?',en:'Excuse me, may I ask?'}
      ],
      note:'ใกล้ (near) and ไกล (far) sound deceptively similar to learners — the key is the tone. ใกล้ has a falling tone and ไกล has a mid tone. A good trick: think of ไกล rhyming with "glide" — you glide far away. Practice tones carefully or you might accidentally tell someone your destination is far when you mean near!'
    }
  ],
  cards:[
    {id:'c1',thai:'สวัสดี',rom:'sawadee',en:'Hello / Goodbye',cat:'Greetings',status:'known'},
    {id:'c2',thai:'ขอบคุณ',rom:'khob khun',en:'Thank you',cat:'Greetings',status:'known'},
    {id:'c3',thai:'กาแฟ',rom:'gaa-fae',en:'Coffee',cat:'Café',status:'learning'},
    {id:'c4',thai:'อร่อย',rom:'a-roi',en:'Delicious',cat:'Café',status:'learning'},
    {id:'c5',thai:'เท่าไหร่',rom:'tao rai',en:'How much?',cat:'Shopping',status:'new'},
    {id:'c6',thai:'หนึ่ง',rom:'nùeng',en:'One',cat:'Numbers',status:'known'},
    {id:'c7',thai:'สอง',rom:'sǒng',en:'Two',cat:'Numbers',status:'learning'},
    {id:'c8',thai:'วันนี้',rom:'wan née',en:'Today',cat:'Time',status:'new'}
  ],
  entries:[
    {
      id:'j1',author:'Alex',authorDisplay:'Alex',title:'วันแรกที่คาเฟ่',
      date:'2025-07-06',
      body:'วันนี้ฉันไปคาเฟ่กับเพื่อน ฉันสั่งกาแฟหนึ่งแก้ว กาแฟอร่อยมาก ฉันพูดภาษาไทยกับพนักงาน เขาใจดีมาก',
      status:'reviewed',
      annotations:[
        {id:'a1',start:42,end:50,original:'พูดภาษา',correction:'พูดภาษาไทย',note:'Always include ไทย after พูดภาษา to specify the language'},
        {id:'a2',start:61,end:63,original:'เขา',correction:'พนักงาน',note:'Use พนักงาน (staff/employee) instead of เขา (he) for clarity'}
      ],
      nitaComment:'Very good first entry Alex! Your sentence structure is natural and easy to follow. Keep practising the polite particles ครับ/ค่ะ at the end of your sentences — it will make a big difference!'
    },
    {
      id:'j2',author:'Alex',authorDisplay:'Alex',title:'ฉันชอบอาหารไทย',
      date:'2025-07-13',
      body:'ฉันชอบอาหารไทยมาก อาหารไทยอร่อยและเผ็ด วันนี้ฉันกินส้มตำกับข้าวเหนียว ฉันกินเผ็ดมากไม่ได้ แต่ฉันพยายาม',
      status:'submitted',
      annotations:[],
      nitaComment:''
    }
  ]
};

export var S = {user:'',role:'student',uid:null,sessions:[],cards:[],entries:[],assignments:[]};

function toKeyedObject(arr){
  var obj={};
  (arr||[]).forEach(function(x){ obj[x.id]=x; });
  return obj;
}
function toArray(obj){
  return obj?Object.keys(obj).map(function(k){return obj[k];}):[];
}

function flattenUidKeyed(obj){
  var result=[];
  Object.keys(obj||{}).forEach(function(uid){
    Object.keys(obj[uid]||{}).forEach(function(itemId){
      var item=obj[uid][itemId];
      item.uid=uid;
      result.push(item);
    });
  });
  return result;
}
function looksLikeEntry(x){ return !!x && typeof x==='object' && typeof x.body==='string'; }
/* Migrates entries from the older flat shape (one entry per id, straight
   under `entries`, from before per-student read isolation existed) into
   entries/{uid}/{entryId}. Only ever called from the teacher's load, since
   only she has write access to the `entries` root -- see database.rules.json. */
function migrateEntriesIfNeeded(entriesRaw){
  if(!entriesRaw) return [];
  var keys=Object.keys(entriesRaw);
  var isOldFlatShape=Array.isArray(entriesRaw)||(keys.length&&looksLikeEntry(entriesRaw[keys[0]]));
  if(!isOldFlatShape) return flattenUidKeyed(entriesRaw);
  var flat=Array.isArray(entriesRaw)?entriesRaw:toArray(entriesRaw);
  var byUid={};
  flat.forEach(function(e){
    var owner=e.uid||'_unclaimed';
    byUid[owner]=byUid[owner]||{};
    byUid[owner][e.id]=e;
  });
  fbDb.ref('entries').set(byUid);
  return flattenUidKeyed(byUid);
}
/* Migrates assignments from the older shape where each assignment carried
   every assigned student's submission nested inside it, into the separate
   assignmentSubmissions/{uid}/{assignmentId} collection -- needed for the
   same per-student read isolation. Returns null when nothing needed
   migrating, so the caller knows to use the normal (already-separate)
   read path instead. */
function migrateAssignmentsIfNeeded(assignmentsRaw){
  var assignments=assignmentsRaw?toArray(assignmentsRaw):[];
  var needsMigration=assignments.some(function(a){ return a.submissions; });
  if(!needsMigration) return null;
  var subsByUid={};
  assignments.forEach(function(a){
    Object.keys(a.submissions||{}).forEach(function(uid){
      subsByUid[uid]=subsByUid[uid]||{};
      subsByUid[uid][a.id]=a.submissions[uid];
    });
    delete a.submissions;
  });
  fbDb.ref('assignments').set(toKeyedObject(assignments));
  fbDb.ref('assignmentSubmissions').set(subsByUid);
  return {assignments:assignments,subsByUid:subsByUid};
}

/* Sessions are shared and readable by everyone (there's nothing private in
   a class session). Journal entries and assignment submissions are
   personal, so each is stored per-student under its own uid
   (entries/{uid}/{entryId}, assignmentSubmissions/{uid}/{assignmentId}) —
   a student's read request can then be scoped to just their own subtree,
   so another student's data is never even sent to their browser (not just
   hidden by the UI). The teacher's load instead reads each collection's
   root to see everyone's. Vocab cards stay private per student under
   users/{uid}/cards, unchanged.

   Assignment CONTENT (sentences etc.) is stored separately from
   submissions, at assignments/{id} — readable by anyone, since it holds
   no personal data — and merged back into each assignment's in-memory
   .submissions here so the rest of the app doesn't need to know about the
   split.

   Older shapes (the shared-array collections, and assignments with
   submissions nested inline) are migrated automatically the first time
   the teacher logs in after this change ships; a student logging in
   before that migration runs will temporarily see their own older data as
   missing, until the teacher's next login fixes it. */
export function loadData(uid, role, callback){
  var seedSessions = JSON.parse(JSON.stringify(SEED.sessions));
  var isTeacher = role==='teacher';
  Promise.all([
    fbDb.ref('sessions').once('value'),
    (isTeacher ? fbDb.ref('entries') : fbDb.ref('entries/' + uid)).once('value'),
    fbDb.ref('assignments').once('value'),
    (isTeacher ? fbDb.ref('assignmentSubmissions') : fbDb.ref('assignmentSubmissions/' + uid)).once('value'),
    fbDb.ref('users/' + uid).once('value')
  ]).then(function(snaps){
    var legacy = snaps[4].val() || {};

    var sessionsRaw = snaps[0].val();
    var sessions;
    if(Array.isArray(sessionsRaw)){
      sessions = sessionsRaw;
      fbDb.ref('sessions').set(toKeyedObject(sessions));
    } else {
      sessions = sessionsRaw ? toArray(sessionsRaw) : (legacy.sessions || seedSessions);
    }
    var ids = sessions.map(function(s){return s.id;});
    seedSessions.forEach(function(s){ if(ids.indexOf(s.id)===-1) sessions.push(s); });

    var entriesRaw = snaps[1].val();
    var entries;
    if(isTeacher){
      entries = migrateEntriesIfNeeded(entriesRaw);
    } else {
      entries = entriesRaw ? Object.keys(entriesRaw).map(function(id){ var e=entriesRaw[id]; e.uid=uid; return e; }) : (legacy.entries || []);
    }

    var assignmentsRaw = snaps[2].val();
    var migrated = migrateAssignmentsIfNeeded(assignmentsRaw);
    var assignments, subsRaw;
    if(migrated){
      assignments = migrated.assignments;
      subsRaw = isTeacher ? migrated.subsByUid : (migrated.subsByUid[uid] || {});
    } else {
      assignments = assignmentsRaw ? toArray(assignmentsRaw) : [];
      subsRaw = snaps[3].val() || {};
    }
    if(isTeacher){
      var byAssignment={};
      Object.keys(subsRaw).forEach(function(u){
        Object.keys(subsRaw[u]||{}).forEach(function(aid){
          byAssignment[aid]=byAssignment[aid]||{};
          byAssignment[aid][u]=subsRaw[u][aid];
        });
      });
      assignments.forEach(function(a){ a.submissions=byAssignment[a.id]||{}; });
    } else {
      assignments.forEach(function(a){
        a.submissions={};
        if(subsRaw[a.id]) a.submissions[uid]=subsRaw[a.id];
      });
    }

    callback({sessions:sessions, entries:entries, cards:legacy.cards||[], assignments:assignments});
  }).catch(function(){ callback({sessions:seedSessions, entries:[], cards:[], assignments:[]}); });
}

export function saveSessionRecord(session){
  fbDb.ref('sessions/' + session.id).set(session);
}
export function saveEntryRecord(entry){
  fbDb.ref('entries/' + entry.uid + '/' + entry.id).set(entry);
}
export function saveAssignmentRecord(assignment){
  var content={};
  Object.keys(assignment).forEach(function(k){ if(k!=='submissions') content[k]=assignment[k]; });
  fbDb.ref('assignments/' + assignment.id).set(content);
}
/* A student's own submission is saved to its own path so submitting or
   marking feedback seen only ever touches that one student's data, never
   any other student's -- required for the security rule that lets a
   student write (and read) their own submission without needing access
   to everyone else's. */
export function saveSubmissionRecord(assignmentId,uid,submission){
  fbDb.ref('assignmentSubmissions/' + uid + '/' + assignmentId).set(submission);
}
export function saveCards(){
  var uid = fbAuth.currentUser ? fbAuth.currentUser.uid : null;
  if(!uid) return;
  fbDb.ref('users/' + uid + '/cards').set(S.cards);
}
