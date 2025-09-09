// Lógica del juego en español. Ejercicios muy fáciles: 3 opciones, explicación y ejemplo.

const questionEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const scoreEl = document.getElementById('score');
const progressEl = document.getElementById('progress');
const nextBtn = document.getElementById('nextBtn');
const newBtn = document.getElementById('newBtn');
const showBtn = document.getElementById('showBtn');
const explanation = document.getElementById('explanation');
const defText = document.getElementById('defText');
const exampleText = document.getElementById('exampleText');

let questions = [];
let index = 0;
let score = 0;

function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]] } return a }

async function loadQuestions(){
  try{
    const res = await fetch('./data/verbs.json');
    if(!res.ok) throw new Error('HTTP '+res.status);
    const raw = await res.json();
    if(!Array.isArray(raw) || raw.length===0){ questionEl.innerText = 'No hay preguntas'; return }
    questions = prepare(raw);
    index = 0; score = 0;
    render();
  }catch(err){
    console.error(err);
    questionEl.innerText = 'Error cargando preguntas. Asegura servir por HTTP (py -m http.server) y que data/verbs.json exista y sea JSON válido.';
  }
}

// Preparar preguntas: cada item tendrá 3 opciones (correcta + 2 distractores)
function prepare(raw){
  const defs = raw.map(r => r.definition).filter(Boolean);
  return shuffle(raw).map(item=>{
    const q = {...item};
    const correct = q.correctAnswer || q.definition || q.verb;
    // generar distractores simples
    const pool = defs.filter(d => d && d !== correct);
    const distractors = [];
    while(distractors.length < 2 && pool.length > 0){
      distractors.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]);
    }
    // si faltan distractores, usar otros verbos como texto
    if(distractors.length < 2){
      const other = raw.map(r=>r.verb).filter(v=>v && v!==q.verb);
      while(distractors.length<2 && other.length>0){
        distractors.push(other.splice(Math.floor(Math.random()*other.length),1)[0]);
      }
    }
    q.options = shuffle([correct, ...distractors]).slice(0,3);
    q.correctAnswer = correct;
    return q;
  });
}

function render(){
  const q = questions[index];
  progressEl.innerText = `Pregunta ${index+1} / ${questions.length}`;
  scoreEl.innerText = `Puntaje: ${score}`;
  explanation.classList.add('hidden');
  defText.innerText = '';
  exampleText.innerText = '';
  nextBtn.classList.add('hidden');

  // Pregunta simple en español
  questionEl.innerText = `¿Cuál es la definición simple del verbo "${q.verb}"?`;

  choicesEl.innerHTML = '';
  q.options.forEach((opt,i)=>{
    const btn = document.createElement('button');
    btn.className = 'option';
    const letter = String.fromCharCode(65+i); // A, B, C
    btn.innerHTML = `<span class="letter">${letter}</span><span>${opt}</span>`;
    btn.addEventListener('click', ()=> choose(btn, opt, q));
    choicesEl.appendChild(btn);
  });
}

// al elegir muestra correcto/incorrecto y explicación simple
function choose(btn, selected, q){
  Array.from(choicesEl.children).forEach(b=>b.classList.add('disabled'));
  const correct = q.correctAnswer;
  if(selected === correct){
    btn.classList.add('correct');
    score++;
  } else {
    btn.classList.add('wrong');
    // resaltar correcto
    Array.from(choicesEl.children).forEach(b=>{
      if(b.textContent.includes(correct)) b.classList.add('correct');
    });
  }
  scoreEl.innerText = `Puntaje: ${score}`;
  // mostrar explicación (definición y ejemplo) en español sencillo
  explanation.classList.remove('hidden');
  defText.innerText = q.definition ? q.definition : `Significado: ${q.correctAnswer}`;
  exampleText.innerText = q.example ? `Ejemplo: ${q.example}` : '';
  nextBtn.classList.remove('hidden');
}

// controles
nextBtn.addEventListener('click', ()=>{
  index++;
  if(index >= questions.length){
    questionEl.innerText = `Juego terminado. Puntaje final: ${score} / ${questions.length}`;
    choicesEl.innerHTML = '';
    nextBtn.classList.add('hidden');
    explanation.classList.remove('hidden');
    defText.innerText = 'Pulsa "Reiniciar" para jugar otra vez.';
    return;
  }
  render();
});

newBtn.addEventListener('click', ()=>{ loadQuestions(); });

showBtn.addEventListener('click', ()=>{
  // Mostrar definición sin responder (ayuda)
  const q = questions[index];
  explanation.classList.remove('hidden');
  defText.innerText = q.definition || q.correctAnswer || 'Sin definición';
  exampleText.innerText = q.example ? `Ejemplo: ${q.example}` : '';
  // permitir seguir intentando
});

// atajos teclado: A/B/C o 1/2/3
window.addEventListener('keydown', e=>{
  const k = e.key.toUpperCase();
  if(['A','B','C'].includes(k)){
    const idx = k.charCodeAt(0)-65;
    const btn = choicesEl.children[idx];
    if(btn && !btn.classList.contains('disabled')) btn.click();
  } else if(['1','2','3'].includes(e.key)){
    const idx = Number(e.key)-1;
    const btn = choicesEl.children[idx];
    if(btn && !btn.classList.contains('disabled')) btn.click();
  }
});

// iniciar
loadQuestions();