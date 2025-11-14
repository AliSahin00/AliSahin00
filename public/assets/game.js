const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
let bestScore = Number(localStorage.getItem("warp-best")) || 0;
let pipes = [];
let frame = 0;
let score = 0;
let running = false;
let bird;
let lastUpdate = 0;

bestEl.textContent = bestScore;

const gravity = 0.35;
const jumpStrength = -6.5;
const pipeGap = 140;
const pipeFrequency = 90;
const pipeSpeed = 2.5;

function resetGame() {
    bird = {
        x: 80,
        y: canvas.height / 2,
        radius: 16,
        velocity: 0,
    };
    pipes = [];
    frame = 0;
    score = 0;
    scoreEl.textContent = score;
    running = true;
    lastUpdate = performance.now();
}

function spawnPipe() {
    const minHeight = 60;
    const maxHeight = canvas.height - pipeGap - minHeight;
    const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);

    pipes.push({
        x: canvas.width,
        width: 60,
        top: topHeight,
        bottom: topHeight + pipeGap,
        scored: false,
    });
}

function update(delta) {
    if (!running) return;

    // Bird physics
    bird.velocity += gravity * delta * 0.06;
    bird.y += bird.velocity * delta * 0.06;

    // Spawn pipes
    if (frame % pipeFrequency === 0) {
        spawnPipe();
    }

    // Update pipes
    pipes = pipes.filter((pipe) => pipe.x + pipe.width > 0);
    for (const pipe of pipes) {
        pipe.x -= pipeSpeed * delta * 0.06;

        if (!pipe.scored && pipe.x + pipe.width < bird.x) {
            pipe.scored = true;
            score += 1;
            scoreEl.textContent = score;
        }

        // Collision detection
        const withinPipeX = bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + pipe.width;
        const hitTop = bird.y - bird.radius < pipe.top;
        const hitBottom = bird.y + bird.radius > pipe.bottom;
        if (withinPipeX && (hitTop || hitBottom)) {
            endGame();
            return;
        }
    }

    // Collision with ground or ceiling
    if (bird.y + bird.radius >= canvas.height || bird.y - bird.radius <= 0) {
        endGame();
    }

    frame += 1;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#70c5ce");
    gradient.addColorStop(1, "#f0f9ff");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw pipes
    for (const pipe of pipes) {
        ctx.fillStyle = "#2ecc71";
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);

        ctx.strokeStyle = "rgba(0,0,0,0.35)";
        ctx.lineWidth = 4;
        ctx.strokeRect(pipe.x, 0, pipe.width, pipe.top);
        ctx.strokeRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
    }

    // Draw bird
    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.rotate(Math.min(Math.max(bird.velocity / 10, -0.35), 0.5));
    ctx.fillStyle = "#ffde59";
    ctx.beginPath();
    ctx.arc(0, 0, bird.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ff5978";
    ctx.beginPath();
    ctx.arc(bird.radius / 2, -4, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#2d3436";
    ctx.beginPath();
    ctx.arc(-4, -6, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (!running) {
        drawOverlay();
    }
}

function drawOverlay() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "24px 'Press Start 2P'";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = "12px 'Press Start 2P'";
    ctx.fillText("R ile yeniden başla", canvas.width / 2, canvas.height / 2 + 15);
}

function endGame() {
    running = false;
    const newBest = Math.max(bestScore, score);
    if (newBest !== bestScore) {
        localStorage.setItem("warp-best", newBest);
        bestScore = newBest;
        bestEl.textContent = newBest;
        showToast("Yeni rekor! " + newBest);
    }
}

function flap() {
    if (!running) {
        resetGame();
        return;
    }
    bird.velocity = jumpStrength;
}

function gameLoop(timestamp) {
    const delta = timestamp - lastUpdate;
    lastUpdate = timestamp;

    if (running) {
        update(delta);
    }

    draw();
    requestAnimationFrame(gameLoop);
}

function showToast(message) {
    let toast = document.querySelector(".toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast";
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("visible");
    setTimeout(() => toast.classList.remove("visible"), 1800);
}

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        event.preventDefault();
        flap();
    } else if (event.code === "KeyR") {
        resetGame();
    }
});

document.addEventListener("touchstart", (event) => {
    event.preventDefault();
    flap();
});

resetGame();
requestAnimationFrame((timestamp) => {
    lastUpdate = timestamp;
    gameLoop(timestamp);
});
