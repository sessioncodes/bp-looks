'use strict';
/* Cloud layer. Uses Firebase (Google sign-in + Firestore) when firebase-config.js has keys,
   otherwise a local demo backend so the team features can be tried on one device. */
(function(){
const cl=o=>JSON.parse(JSON.stringify(o));
const CODE_CHARS='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const genCode=()=>Array.from({length:6},()=>CODE_CHARS[Math.floor(Math.random()*CODE_CHARS.length)]).join('');
const rid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);

async function firebaseCloud(cfg){
  const B='https://www.gstatic.com/firebasejs/10.12.2/';
  const [A,AU,F]=await Promise.all([import(B+'firebase-app.js'),import(B+'firebase-auth.js'),import(B+'firebase-firestore.js')]);
  // On Firebase Hosting, use our own domain for the auth handler so sign-in works in Safari and home-screen apps.
  const onFbHost=/\.(web\.app|firebaseapp\.com)$/.test(location.hostname);
  const app=A.initializeApp(onFbHost?{...cfg,authDomain:location.host}:cfg);
  const auth=AU.getAuth(app),db=F.getFirestore(app);
  const {doc,getDoc,setDoc,updateDoc,deleteDoc,collection,query,where,onSnapshot,writeBatch,arrayUnion,arrayRemove,deleteField}=F;
  AU.getRedirectResult(auth).catch(e=>console.warn('sign-in redirect',e));
  const list=s=>s.docs.map(d=>({...d.data(),id:d.id}));
  const warn=e=>console.warn('firestore',e);
  return {
    demo:false,
    onAuth:cb=>AU.onAuthStateChanged(auth,u=>cb(u?{uid:u.uid,name:u.displayName||'',email:u.email||'',photo:u.photoURL||''}:null)),
    async signIn(){
      const p=new AU.GoogleAuthProvider();p.setCustomParameters({prompt:'select_account'});
      if(matchMedia('(display-mode: standalone)').matches||navigator.standalone)return AU.signInWithRedirect(auth,p);
      try{await AU.signInWithPopup(auth,p)}
      catch(e){
        if(['auth/popup-blocked','auth/operation-not-supported-in-this-environment','auth/web-storage-unsupported'].includes(e.code))return AU.signInWithRedirect(auth,p);
        if(e.code!=='auth/popup-closed-by-user'&&e.code!=='auth/cancelled-popup-request')throw e;
      }
    },
    signOut:()=>AU.signOut(auth),
    async getProfile(uid){const s=await getDoc(doc(db,'users',uid));return s.exists()?s.data():null},
    saveProfile:(uid,p)=>setDoc(doc(db,'users',uid),p,{merge:true}),
    async createTeam(uid,{name,profile}){
      const ref=doc(collection(db,'teams')),code=genCode(),b=writeBatch(db);
      b.set(ref,{name,code,coachUid:uid,coachName:profile.name,memberIds:[uid],members:{[uid]:{name:profile.name,age:profile.age,role:'coach',joined:Date.now()}},created:Date.now()});
      b.set(doc(db,'invites',code),{teamId:ref.id,teamName:name,coachName:profile.name});
      await b.commit();return ref.id;
    },
    async findInvite(code){const s=await getDoc(doc(db,'invites',code.toUpperCase()));return s.exists()?s.data():null},
    joinTeam:(uid,teamId,profile)=>updateDoc(doc(db,'teams',teamId),{memberIds:arrayUnion(uid),['members.'+uid]:{name:profile.name,age:profile.age,role:'player',joined:Date.now()}}),
    removeMember:(teamId,uid)=>updateDoc(doc(db,'teams',teamId),{memberIds:arrayRemove(uid),['members.'+uid]:deleteField()}),
    watchMyTeams:(uid,cb)=>onSnapshot(query(collection(db,'teams'),where('memberIds','array-contains',uid)),s=>cb(list(s)),warn),
    watchPlays:(t,cb)=>onSnapshot(collection(db,'teams',t,'plays'),s=>cb(list(s)),warn),
    watchVersions:(t,{coach,uid},cb)=>onSnapshot(coach?collection(db,'teams',t,'versions'):query(collection(db,'teams',t,'versions'),where('authorUid','==',uid)),s=>cb(list(s)),warn),
    async savePlay(t,play){
      const ref=play.id?doc(db,'teams',t,'plays',play.id):doc(collection(db,'teams',t,'plays'));
      const data=cl(play);delete data.id;delete data.kind;data.updated=Date.now();
      await setDoc(ref,data);return ref.id;
    },
    deletePlay:(t,id)=>deleteDoc(doc(db,'teams',t,'plays',id)),
    saveVersion(t,v){const data=cl(v);delete data.id;return setDoc(doc(db,'teams',t,'versions',v.id),data)},
    updateVersion:(t,id,patch)=>updateDoc(doc(db,'teams',t,'versions',id),patch)
  };
}

function localCloud(){
  const K='pb.cloud.db',ME='pb.cloud.me';
  const empty=()=>({users:{},teams:{},invites:{},plays:{},versions:{}});
  const load=()=>{try{return JSON.parse(localStorage.getItem(K))||empty()}catch(e){return empty()}};
  let db=load();const subs=new Set(),authSubs=new Set();
  const me=()=>{const id=localStorage.getItem(ME);return id&&db.users[id]?cl(db.users[id].auth):null};
  const commit=()=>{localStorage.setItem(K,JSON.stringify(db));[...subs].forEach(f=>f())};
  const emitAuth=()=>[...authSubs].forEach(f=>f(me()));
  window.addEventListener('storage',e=>{if(e.key===K){db=load();[...subs].forEach(f=>f())}if(e.key===ME)emitAuth()});
  const watch=fn=>{subs.add(fn);setTimeout(fn,0);return()=>subs.delete(fn)};
  const later=v=>new Promise(r=>setTimeout(()=>r(v),120));
  return {
    demo:true,
    onAuth(cb){authSubs.add(cb);setTimeout(()=>cb(me()),0);return()=>authSubs.delete(cb)},
    async signIn(name){
      name=(name||'Demo Coach').trim();const uid='u_'+name.toLowerCase().replace(/\W+/g,'_');
      db.users[uid]=db.users[uid]||{auth:{uid,name,email:uid.slice(2)+'@demo.local',photo:''},profile:null};
      commit();localStorage.setItem(ME,uid);emitAuth();
    },
    async signOut(){localStorage.removeItem(ME);emitAuth()},
    async getProfile(uid){return later(db.users[uid]?.profile?cl(db.users[uid].profile):null)},
    async saveProfile(uid,p){db.users[uid].profile={...(db.users[uid].profile||{}),...p};commit();return later()},
    async createTeam(uid,{name,profile}){
      const id='t'+rid(),code=genCode();
      db.teams[id]={name,code,coachUid:uid,coachName:profile.name,memberIds:[uid],members:{[uid]:{name:profile.name,age:profile.age,role:'coach',joined:Date.now()}},created:Date.now()};
      db.invites[code]={teamId:id,teamName:name,coachName:profile.name};db.plays[id]={};db.versions[id]={};commit();return later(id);
    },
    async findInvite(code){return later(db.invites[code.toUpperCase()]?cl(db.invites[code.toUpperCase()]):null)},
    async joinTeam(uid,teamId,profile){const t=db.teams[teamId];if(!t)throw new Error('missing');if(!t.memberIds.includes(uid))t.memberIds.push(uid);t.members[uid]={name:profile.name,age:profile.age,role:'player',joined:Date.now()};commit();return later()},
    async removeMember(teamId,uid){const t=db.teams[teamId];t.memberIds=t.memberIds.filter(x=>x!==uid);delete t.members[uid];commit();return later()},
    watchMyTeams:(uid,cb)=>watch(()=>cb(Object.entries(db.teams).filter(([,t])=>t.memberIds.includes(uid)).map(([id,t])=>({...cl(t),id})))),
    watchPlays:(t,cb)=>watch(()=>cb(Object.entries(db.plays[t]||{}).map(([id,p])=>({...cl(p),id})))),
    watchVersions:(t,{coach,uid},cb)=>watch(()=>cb(Object.entries(db.versions[t]||{}).map(([id,v])=>({...cl(v),id})).filter(v=>coach||v.authorUid===uid))),
    async savePlay(t,play){const id=play.id||'tp'+rid(),data=cl(play);delete data.kind;data.id=id;data.updated=Date.now();(db.plays[t]=db.plays[t]||{})[id]=data;commit();return later(id)},
    async deletePlay(t,id){delete db.plays[t][id];commit();return later()},
    async saveVersion(t,v){(db.versions[t]=db.versions[t]||{})[v.id]=cl(v);commit();return later()},
    async updateVersion(t,id,patch){Object.assign(db.versions[t][id],patch);commit();return later()}
  };
}

window.makeCloud=async()=>{
  const cfg=window.FIREBASE_CONFIG||{};
  if(cfg.apiKey){try{return await firebaseCloud(cfg)}catch(e){console.warn('Firebase failed to load, using demo mode',e)}}
  return localCloud();
};
})();
