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

export var S = {user:'',role:'student',sessions:[],cards:[],entries:[],assignments:[]};

/* Sessions, journal entries, and assignments are shared across every account
   (Kru Nita's session notes, every student's journal submissions, and
   assignments all need to be visible to each other) — only vocab cards are
   private per student. Older per-user session/entry data from before this
   split is read once as a fallback so nothing already saved gets silently
   lost. */
export function loadData(uid, callback){
  var seedSessions = JSON.parse(JSON.stringify(SEED.sessions));
  var seedEntries = JSON.parse(JSON.stringify(SEED.entries));
  Promise.all([
    fbDb.ref('sessions').once('value'),
    fbDb.ref('entries').once('value'),
    fbDb.ref('assignments').once('value'),
    fbDb.ref('users/' + uid).once('value')
  ]).then(function(snaps){
    var legacy = snaps[3].val() || {};
    var sessions = snaps[0].val() || legacy.sessions || seedSessions;
    var ids = sessions.map(function(s){return s.id;});
    seedSessions.forEach(function(s){ if(ids.indexOf(s.id)===-1) sessions.push(s); });
    var entries = snaps[1].val() || legacy.entries || seedEntries;
    var assignments = snaps[2].val() || [];
    callback({sessions:sessions, entries:entries, cards:legacy.cards||[], assignments:assignments});
  }).catch(function(){ callback({sessions:seedSessions, entries:seedEntries, cards:[], assignments:[]}); });
}

export function saveSessions(){
  fbDb.ref('sessions').set(S.sessions);
}
export function saveEntries(){
  fbDb.ref('entries').set(S.entries);
}
export function saveAssignments(){
  fbDb.ref('assignments').set(S.assignments);
}
export function saveCards(){
  var uid = fbAuth.currentUser ? fbAuth.currentUser.uid : null;
  if(!uid) return;
  fbDb.ref('users/' + uid + '/cards').set(S.cards);
}
