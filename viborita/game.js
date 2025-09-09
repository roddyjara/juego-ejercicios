const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const restartBtn = document.getElementById('restart');

const scale = 20;
const cols = 20;
const rows = 20;
canvas.width = cols * scale;
canvas.height = rows * scale;

let snake;
let dir;
let food;
let score;
let tickInterval;

function init() {
    snake = [{ x: Math.floor(cols/2), y: Math.floor(rows/2) }];
    dir = { x: 1, y: 0 };
    food = randomPos();
    score = 0;
    scoreEl.textContent = 'Puntaje: ' + score;
    if (tickInterval) clearInterval(tickInterval);
    tickInterval = setInterval(update, 100);
}
function randomPos() {
    let p;
    do {
        p = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    } while (snake.some(s => s.x === p.x && s.y === p.y));
    return p;
}
function update() {
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    // colisión con paredes
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
        gameOver();
        return;
    }
    // colisión consigo misma
    if (snake.some(s => s.x === head.x && s.y === head.y)) {
        gameOver();
        return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreEl.textContent = 'Puntaje: ' + score;
        food = randomPos();
    } else {
        snake.pop();
    }
    draw();
}
function draw() {
    // fondo
    ctx.fillStyle = '#0b6623';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // comida
    ctx.fillStyle = '#ff4d4d';
    ctx.fillRect(food.x * scale + 2, food.y * scale + 2, scale - 4, scale - 4);
    // serpiente (cabeza diferente color)
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? '#e0ffcc' : '#9be6a2';
        ctx.fillRect(snake[i].x * scale + 1, snake[i].y * scale + 1, scale - 2, scale - 2);
    }
}
function gameOver() {
    clearInterval(tickInterval);
    setTimeout(() => {
        if (confirm('Fin del juego. Puntaje: ' + score + '. Reiniciar?')) init();
    }, 50);
}
window.addEventListener('keydown', e => {
    const key = e.key;
    const mapping = {
        ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 }, s: { x: 0, y: 1 }, a: { x: -1, y: 0 }, d: { x: 1, y: 0 }
    };
    const nd = mapping[key];
    if (nd) {
        // prevenir reverso directo
        if (snake.length > 1 && nd.x === -dir.x && nd.y === -dir.y) return;
        dir = nd;
    }
});
restartBtn.addEventListener('click', init);

// iniciar
init();
draw();