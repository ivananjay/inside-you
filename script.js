const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const menuToggle = $("#menuToggle");
menuToggle.addEventListener("click", () => {
  const open = $("#navLinks").classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
$$(".nav-links a").forEach(a => a.addEventListener("click", () => {
  $("#navLinks").classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

const today = new Date();
$("#todayDate").textContent = today.toLocaleDateString("id-ID", {day:"numeric", month:"short", year:"numeric"});
const prompts = [
  "Apa satu hal kecil yang ingin kamu syukuri hari ini?",
  "Kapan terakhir kali kamu merasa bangga pada dirimu sendiri?",
  "Apa yang sedang kamu butuhkan, tetapi belum kamu berikan pada diri sendiri?",
  "Hal apa yang ingin kamu lepaskan hari ini?",
  "Jika bisa mengirim pesan untuk dirimu, apa yang ingin kamu katakan?"
];
$("#journalPrompt").textContent = prompts[today.getDate() % prompts.length];

const moodMessages = {
  Senang:"Senang mendengarnya! Nikmati momen baik ini dan izinkan dirimu merayakannya. ✨",
  Tenang:"Semoga ketenangan ini menemanimu. Tarik napas, hadir di momen sekarang. 🌿",
  Sedih:"Tidak apa-apa merasa sedih. Kamu boleh memberi ruang untuk perasaan itu. 🤍",
  Cemas:"Pelan-pelan, ya. Coba tarik napas perlahan dan fokus pada satu hal yang bisa kamu lakukan sekarang. 🫧",
  Lelah:"Kamu tidak harus produktif setiap waktu. Istirahat juga bagian dari bertumbuh. 🌙"
};
$$(".mood-option").forEach(btn => btn.addEventListener("click", () => {
  $$(".mood-option").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
  $("#moodFeedback").textContent = moodMessages[btn.dataset.mood];
  $("#journalMood").value = btn.dataset.mood;
}));

const storageKey = "insideYouJournal";
function getEntries(){ try{return JSON.parse(localStorage.getItem(storageKey) || "[]")}catch{return []} }
$("#saveJournal").addEventListener("click", () => {
  const mood = $("#journalMood").value;
  const body = $("#journalText").value.trim();
  if(!mood || !body){ $("#journalMessage").textContent = "Pilih mood dan tuliskan sedikit refleksimu terlebih dahulu."; return; }
  const entries = getEntries();
  entries.unshift({date:new Date().toLocaleString("id-ID"), mood, body});
  localStorage.setItem(storageKey, JSON.stringify(entries.slice(0,50)));
  $("#journalText").value = "";
  $("#journalMessage").textContent = "Refleksimu tersimpan di perangkat ini. Terima kasih sudah bercerita. ♡";
  renderHistory();
});
function renderHistory(){
  const history = $("#journalHistory");
  const entries = getEntries();
  history.innerHTML = entries.length ? entries.map(e => `<div class="history-item"><strong>${escapeHTML(e.mood)} · ${escapeHTML(e.date)}</strong><p>${escapeHTML(e.body)}</p></div>`).join("") : '<p class="privacy-note">Belum ada catatan. Mulai dengan menulis refleksi pertamamu.</p>';
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
$("#historyToggle").addEventListener("click", () => {$("#journalHistory").classList.toggle("hidden"); renderHistory();});
renderHistory();

const topics = {
 emotion:{title:"Understanding Emotion",desc:"Emosi adalah sinyal yang memberi tahu kita tentang kebutuhan, pengalaman, dan hal yang penting bagi diri. Tidak ada emosi yang perlu langsung dihakimi sebagai baik atau buruk. Coba beri nama perasaanmu sebelum bereaksi.",question:"Apa yang mungkin sedang ingin disampaikan oleh emosimu hari ini?",islam:"Dalam Islam, manusia diajak untuk mengelola emosi dengan kesadaran dan kesabaran. QS. Ali 'Imran: 134 mengingatkan tentang orang-orang yang menahan amarah dan memaafkan."},
 confidence:{title:"Self Confidence",desc:"Percaya diri bukan berarti selalu yakin atau tidak pernah gagal. Percaya diri tumbuh saat kamu mengenali kekuatan, menerima keterbatasan, dan berani mencoba meski belum sempurna.",question:"Hal kecil apa yang pernah berhasil kamu lakukan, tetapi jarang kamu apresiasi?",islam:"Setiap manusia memiliki amanah dan potensi. QS. At-Tin: 4 mengingatkan bahwa manusia diciptakan dalam bentuk sebaik-baiknya."},
 boundaries:{title:"Self Boundaries",desc:"Batasan diri adalah cara sehat untuk menjaga waktu, energi, nilai, dan kenyamanan. Menolak sesuatu dengan sopan bukan berarti kamu tidak peduli kepada orang lain.",question:"Dalam situasi apa kamu ingin belajar mengatakan 'tidak' dengan lebih nyaman?",islam:"Menjaga diri dan menghindari hal yang membawa mudarat adalah bagian dari ikhtiar. Sampaikan batasan dengan cara yang baik dan tetap menghormati orang lain."},
 people:{title:"People Pleasing",desc:"People pleasing adalah kecenderungan mengutamakan penerimaan orang lain sampai mengabaikan kebutuhan sendiri. Berbuat baik itu penting, tetapi kamu tidak harus selalu menyetujui semua hal.",question:"Apakah kamu pernah mengatakan 'iya' padahal sebenarnya ingin mengatakan 'tidak'?",islam:"Niat berbuat baik dapat berjalan bersama kejujuran dan tanggung jawab terhadap diri. Kebaikan tidak harus berarti mengorbankan diri tanpa batas."},
 overthinking:{title:"Overthinking",desc:"Memikirkan sesuatu secara berulang bisa terasa melelahkan, terutama saat kita mencoba mengendalikan hal yang belum terjadi. Pisahkan apa yang bisa kamu kendalikan dan apa yang perlu kamu lepaskan.",question:"Apakah pikiran ini berisi fakta yang sudah terjadi, atau kemungkinan yang belum tentu terjadi?",islam:"QS. Ar-Ra'd: 28 mengingatkan bahwa dengan mengingat Allah hati menjadi tenteram. Dzikir dapat menjadi salah satu ikhtiar menenangkan hati."},
 acceptance:{title:"Self Acceptance",desc:"Menerima diri berarti mengakui keadaan diri saat ini tanpa berhenti bertumbuh. Kamu boleh memiliki kekurangan, melakukan kesalahan, dan tetap layak dihargai.",question:"Bagian dari dirimu apa yang ingin kamu perlakukan dengan lebih lembut?",islam:"QS. Az-Zumar: 53 mengandung pesan tentang luasnya ampunan Allah dan larangan berputus asa dari rahmat-Nya."}
};
$$(".topic-card").forEach(btn => btn.addEventListener("click", () => {
  const t = topics[btn.dataset.topic];
  $("#topicTitle").textContent=t.title; $("#topicDescription").textContent=t.desc;
  $("#topicQuestion").textContent=t.question; $("#topicIslam").textContent=t.islam;
  $("#topicDetail").classList.remove("hidden");
  $("#topicDetail").scrollIntoView({behavior:"smooth",block:"nearest"});
}));
$("#closeTopic").addEventListener("click",()=>$("#topicDetail").classList.add("hidden"));

const verses = [
  {arabic:"فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",meaning:"“Maka sesungguhnya bersama kesulitan ada kemudahan.”",source:"QS. Al-Insyirah: 5",reflection:"Kesulitan yang kamu hadapi hari ini bukan keseluruhan cerita hidupmu. Tetaplah berusaha dan beri dirimu waktu."},
  {arabic:"أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",meaning:"“Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.”",source:"QS. Ar-Ra'd: 28",reflection:"Saat pikiran terasa ramai, luangkan waktu untuk berdzikir dan kembali menata hati."},
  {arabic:"لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",meaning:"“Janganlah kamu berputus asa dari rahmat Allah.”",source:"QS. Az-Zumar: 53 (kutipan bagian ayat)",reflection:"Selalu ada ruang untuk memperbaiki diri. Jangan jadikan satu kesalahan sebagai akhir dari harapan."}
];
let verseIndex=0;
$("#nextVerse").addEventListener("click",()=>{
  verseIndex=(verseIndex+1)%verses.length; const v=verses[verseIndex];
  $(".arabic").textContent=v.arabic; $("#verseMeaning").textContent=v.meaning;
  $("#verseSource").textContent=v.source; $("#verseReflection").textContent=v.reflection;
});

const questions = [
  {q:"Saat menghadapi masalah, apa yang biasanya kamu lakukan?",a:["Mencoba mengurai masalah satu per satu.","Mencari seseorang untuk diajak bicara.","Memikirkannya berulang kali.","Mengalihkan perhatian dulu."]},
  {q:"Ketika seseorang berbeda pendapat denganmu, kamu...",a:["Mendengarkan dan menyampaikan pendapatku.","Berusaha memahami sudut pandangnya.","Khawatir membuat orang itu kecewa.","Memilih diam agar tidak terjadi konflik."]},
  {q:"Apa yang paling sulit kamu lakukan?",a:["Meminta bantuan.","Mengatakan tidak.","Menghargai proses diri sendiri.","Berhenti memikirkan hal yang belum terjadi."]},
  {q:"Saat punya waktu luang, kamu cenderung...",a:["Melakukan hal yang kusukai.","Menghubungi orang terdekat.","Memikirkan hal-hal yang belum selesai.","Beristirahat karena merasa lelah."]},
  {q:"Kalimat mana yang paling ingin kamu dengar hari ini?",a:["Kamu sudah melakukan yang terbaik.","Kamu boleh punya batasan.","Kamu tidak sendirian.","Tidak apa-apa berjalan pelan-pelan."]}
];
let qIndex=0, answers=[];
function renderQuestion(){
  const q=questions[qIndex]; $("#quizQuestion").textContent=q.q;
  $("#quizProgress").textContent=`${String(qIndex+1).padStart(2,"0")} / ${String(questions.length).padStart(2,"0")}`;
  $("#quizProgressBar").style.width=`${(qIndex+1)/questions.length*100}%`;
  $("#quizAnswers").innerHTML=q.a.map((a,i)=>`<button class="quiz-answer ${answers[qIndex]===i?"selected":""}" data-answer="${i}"><span class="answer-dot"></span>${a}</button>`).join("");
  $$(".quiz-answer").forEach(b=>b.addEventListener("click",()=>{answers[qIndex]=Number(b.dataset.answer);renderQuestion();}));
  $("#quizNext").disabled=answers[qIndex]===undefined;
  $("#quizNext").textContent=qIndex===questions.length-1?"See my reflection →":"Next question →";
}
$("#quizNext").addEventListener("click",()=>{
  if(answers[qIndex]===undefined)return;
  if(qIndex<questions.length-1){qIndex++;renderQuestion();return;}
  const counts=[0,0,0,0]; answers.forEach(a=>counts[a]++);
  const max=Math.max(...counts), category=counts.indexOf(max);
  const results=[
    ["🌱","The thoughtful learner","Kamu cenderung mencoba memahami situasi dan mencari langkah yang bisa dilakukan. Terus latih keberanian untuk meminta dukungan saat dibutuhkan.","Coba baca materi Understanding Emotion."],
    ["🫶","The caring connector","Kamu memperhatikan hubungan dengan orang lain. Ingat, kebutuhanmu juga layak didengarkan.","Coba baca materi Self Boundaries."],
    ["☁️","The deep thinker","Kamu banyak memproses hal di dalam pikiran. Beri dirimu jeda dan bedakan fakta dari kekhawatiran.","Coba baca materi Overthinking."],
    ["🌙","The gentle rest-seeker","Kamu mungkin sedang membutuhkan ruang dan pemulihan. Istirahat adalah bagian dari proses bertumbuh.","Coba mulai dari My Journal."]
  ][category];
  $("#quizQuestion").classList.add("hidden"); $("#quizAnswers").classList.add("hidden"); $("#quizNext").classList.add("hidden");
  $("#quizResult").classList.remove("hidden"); $("#quizResult").innerHTML=`<div class="result-emoji">${results[0]}</div><h3>${results[1]}</h3><p>${results[2]}</p><p><b>${results[3]}</b></p><button class="button button-primary" id="restartQuiz">Try again ↻</button>`;
  $("#restartQuiz").addEventListener("click",()=>{qIndex=0;answers=[];$("#quizQuestion").classList.remove("hidden");$("#quizAnswers").classList.remove("hidden");$("#quizNext").classList.remove("hidden");$("#quizResult").classList.add("hidden");renderQuestion();});
});
renderQuestion();

function updateGrowth(){
  const checks=$$(".growth-check"), done=checks.filter(c=>c.checked).length;
  $("#growthCount").textContent=`${done} / ${checks.length}`;
  $("#growthProgress").style.width=`${done/checks.length*100}%`;
  $("#growthMessage").textContent=done===3?"You showed up for yourself today. Proud of you! ♡":"Setiap langkah kecil tetap berarti. 🌱";
}
$$(".growth-check").forEach(c=>c.addEventListener("change",updateGrowth));

const loginDialog=$("#loginDialog");
$("#loginBtn").addEventListener("click",()=>loginDialog.showModal());
$("#closeLogin").addEventListener("click",()=>loginDialog.close());
$("#demoLogin").addEventListener("click",()=>{loginDialog.close();alert("Kamu sedang menggunakan guest access. Catatan jurnal tersimpan secara lokal di browser ini.");});
