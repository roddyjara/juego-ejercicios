const canvas = document.getElementById('hang');
const ctx = canvas.getContext('2d');
const wordEl = document.getElementById('word');
const keyboardEl = document.getElementById('keyboard');
const wrongLettersEl = document.getElementById('wrongLetters');
const statusEl = document.getElementById('status');
const newBtn = document.getElementById('newBtn');

const WORDS = [
  { word: "VARIABLE", meaning: "A named storage location in programming." },
  { word: "FUNCTION", meaning: "A reusable block of code that performs a task." },
  { word: "DEBUG", meaning: "To find and fix errors in code." },
  { word: "COMPILE", meaning: "To convert source code into executable code." },
  { word: "ARRAY", meaning: "A collection of elements identified by index." },
  { word: "OBJECT", meaning: "An instance of a class containing data and methods." },
  { word: "CLASS", meaning: "A blueprint for creating objects." },
  { word: "STRING", meaning: "A sequence of characters." },
  { word: "LOOP", meaning: "A sequence of instructions repeated until a condition is met." },
  { word: "VISUALSTUDIO", meaning: "A popular integrated development environment by Microsoft." },
  { word: "SPEED", meaning: "How fast a program or computer operates." },
  { word: "WIFI", meaning: "Wireless networking technology." },
  { word: "NETWORK", meaning: "A group of computers connected together." },
  { word: "SERVER", meaning: "A computer that provides data to other computers." },
  { word: "CLIENT", meaning: "A computer or program that accesses a server." },
  { word: "DATABASE", meaning: "An organized collection of data." },
  { word: "PYTHON", meaning: "A popular programming language." },
  { word: "JAVASCRIPT", meaning: "A scripting language for web development." },
  { word: "HTML", meaning: "The standard markup language for web pages." },
  { word: "CSS", meaning: "A style sheet language for describing the look of web pages." }
];

let secret = '';
let revealed = [];
let wrong = [];
let meaning = '';
const maxWrong = 10;

function pickWord(){
  const i = Math.floor(Math.random()*WORDS.length);
  meaning = WORDS[i].meaning; // Guarda el significado globalmente
  return WORDS[i].word;       // Retorna solo la palabra
}

function start(){
  secret = pickWord().toUpperCase();
  revealed = Array.from({length:secret.length},()=>false);
  wrong = [];
  statusEl.textContent = '';
  buildKeyboard();
  renderWord();
  redraw();
  updateWrong();
}

function buildKeyboard(){
  keyboardEl.innerHTML = '';
  for(let i=65;i<=90;i++){
    const c = String.fromCharCode(i);
    const btn = document.createElement('button');
    btn.className = 'key';
    btn.textContent = c;
    btn.addEventListener('click',()=>press(c));
    keyboardEl.appendChild(btn);
  }
}
function press(letter){
  // ignore if already used
  letter = letter.toUpperCase();
  if(revealedUsed(letter) || wrong.includes(letter)) return;
  let found = false;
  for(let i=0;i<secret.length;i++){
    if(secret[i]===letter){ revealed[i]=true; found=true; }
  }
  // disable button
  Array.from(keyboardEl.children).forEach(b=>{
    if(b.textContent===letter) b.disabled = true;
  });
  if(!found){
    wrong.push(letter);
    updateWrong();
  } else {
    renderWord();
  }
  checkState();
}
function revealedUsed(letter){
  // check if letter already revealed
  for(let i=0;i<secret.length;i++) if(revealed[i] && secret[i]===letter) return true;
  return false;
}
function renderWord(){
  wordEl.innerHTML = '';
  for(let i=0;i<secret.length;i++){
    const span = document.createElement('span');
    span.className = 'letter';
    span.textContent = revealed[i] ? secret[i] : '_';
    wordEl.appendChild(span);
  }
}
function updateWrong(){
  wrongLettersEl.textContent = wrong.length ? wrong.join(', ') : '—';
  redraw();
}
function checkState(){
  if(revealed.every(Boolean)){
    statusEl.textContent = 'You won! Meaning: ' + meaning;
    disableAll();
  } else if(wrong.length>=maxWrong){
    statusEl.textContent = 'You lost. Word: ' + secret + '. Meaning: ' + meaning;
    revealAll();
    disableAll();
  }
}
function revealAll(){
  revealed = revealed.map(()=>true);
  renderWord();
}
function disableAll(){
  Array.from(keyboardEl.children).forEach(b=>b.disabled=true);
}
function redraw(){
  // clear
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 4;
  // draw scaffold (base + pole + beam + rope always)
  // base
  ctx.strokeStyle = '#222';
  ctx.beginPath();
  ctx.moveTo(20,280); ctx.lineTo(280,280); ctx.stroke();
  // pole
  ctx.beginPath();
  ctx.moveTo(60,280); ctx.lineTo(60,20); ctx.lineTo(180,20); ctx.lineTo(180,50); ctx.stroke();
  // draw body parts by wrong count (10 steps)
  ctx.strokeStyle = '#000';
  const s = wrong.length;
  if(s>0){ // 1 head
    ctx.beginPath(); ctx.arc(180,80,30,0,Math.PI*2); ctx.stroke();
  }
  if(s>1){ // 2 neck
    ctx.beginPath(); ctx.moveTo(180,110); ctx.lineTo(180,120); ctx.stroke();
  }
  if(s>2){ // 3 body upper
    ctx.beginPath(); ctx.moveTo(180,120); ctx.lineTo(180,180); ctx.stroke();
  }
  if(s>3){ // 4 left arm
    ctx.beginPath(); ctx.moveTo(180,130); ctx.lineTo(150,160); ctx.stroke();
  }
  if(s>4){ // 5 right arm
    ctx.beginPath(); ctx.moveTo(180,130); ctx.lineTo(210,160); ctx.stroke();
  }
  if(s>5){ // 6 body lower
    ctx.beginPath(); ctx.moveTo(180,180); ctx.lineTo(180,220); ctx.stroke();
  }
  if(s>6){ // 7 left leg
    ctx.beginPath(); ctx.moveTo(180,220); ctx.lineTo(150,260); ctx.stroke();
  }
  if(s>7){ // 8 right leg
    ctx.beginPath(); ctx.moveTo(180,220); ctx.lineTo(210,260); ctx.stroke();
  }
  if(s>8){ // 9 left eye (dead)
    ctx.beginPath(); ctx.moveTo(170,70); ctx.lineTo(176,76); ctx.moveTo(176,70); ctx.lineTo(170,76); ctx.stroke();
  }
  if(s>9){ // 10 right eye
    ctx.beginPath(); ctx.moveTo(190,70); ctx.lineTo(196,76); ctx.moveTo(196,70); ctx.lineTo(190,76); ctx.stroke();
  }
}
newBtn.addEventListener('click', start);
window.addEventListener('keydown', e=>{
  const k = e.key.toUpperCase();
  if(k.length===1 && k>='A' && k<='Z') press(k);
});
start();