// ===============================
// GIOCO COMPLETO - SCRIPT.JS
// Versione PIÙ VELOCE + TURBO (Shift)
// ===============================

window.addEventListener("DOMContentLoaded", () => {
  // 1) ELEMENTI HTML
  const game = document.getElementById("game");
  const player = document.getElementById("player");
  const coin = document.getElementById("coin");
  const enemy = document.getElementById("enemy");

  const scoreSpan = document.getElementById("score");
  const timeSpan = document.getElementById("time");
  const livesSpan = document.getElementById("lives");
  const lastKeySpan = document.getElementById("lastKey");
  const statusSpan = document.getElementById("status");
  const messageDiv = document.getElementById("message");

  if (
    !game || !player || !coin || !enemy ||
    !scoreSpan || !timeSpan || !livesSpan ||
    !lastKeySpan || !statusSpan || !messageDiv
  ) {
    alert("Errore: manca qualche id in HTML");
    return;
  }

  statusSpan.textContent = "JS attivo ✅";
  lastKeySpan.textContent = "none";
  messageDiv.textContent = "";

  // 2) STATO DEL GIOCO
  let x = 10;
  let y = 10;

  // ✅ VELOCITÀ PLAYER (più alta)
  const normalSpeed = 8;   // prima era 3
  const turboSpeed = 14;   // velocità quando tieni Shift
  let currentSpeed = normalSpeed;

  let score = 0;
  let lives = 3;

  let timeLeft = 30;
  let isGameOver = false;

  // Invincibilità breve dopo colpo
  let canBeHit = true;
  const hitCooldownMs = 800; // un po' più rapido

  // Tasti premuti
  let up = false, down = false, left = false, right = false;

  // Tasto turbo (Shift)
  let turbo = false;

  // 3) NEMICO (più veloce + rimbalzo)
  let enemyX = 200;
  let enemyY = 150;

  // ✅ VELOCITÀ NEMICO (più alta)
  let enemyVX = 5; // prima era 2
  let enemyVY = 4; // prima era 2

  // HUD iniziale
  scoreSpan.textContent = score;
  livesSpan.textContent = lives;
  timeSpan.textContent = timeLeft;

  // 4) PLAYER + BORDI
  function updatePlayer() {
    const maxX = game.clientWidth - player.clientWidth;
    const maxY = game.clientHeight - player.clientHeight;

    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x > maxX) x = maxX;
    if (y > maxY) y = maxY;

    player.style.left = x + "px";
    player.style.top = y + "px";
  }

  // 5) NEMICO + RIMBALZO
  function updateEnemy() {
    enemyX += enemyVX;
    enemyY += enemyVY;

    const maxX = game.clientWidth - enemy.clientWidth;
    const maxY = game.clientHeight - enemy.clientHeight;

    // Rimbalzo sui muri
    if (enemyX <= 0) { enemyX = 0; enemyVX = -enemyVX; }
    if (enemyX >= maxX) { enemyX = maxX; enemyVX = -enemyVX; }
    if (enemyY <= 0) { enemyY = 0; enemyVY = -enemyVY; }
    if (enemyY >= maxY) { enemyY = maxY; enemyVY = -enemyVY; }

    enemy.style.left = enemyX + "px";
    enemy.style.top = enemyY + "px";
  }

  // 6) COLLISIONE PLAYER - MONETA
  function checkCoinCollision() {
    const p = player.getBoundingClientRect();
    const c = coin.getBoundingClientRect();

    const hit =
      p.left < c.right &&
      p.right > c.left &&
      p.top < c.bottom &&
      p.bottom > c.top;

    if (hit) {
      score++;
      scoreSpan.textContent = score;

      const maxX = game.clientWidth - coin.clientWidth;
      const maxY = game.clientHeight - coin.clientHeight;

      coin.style.left = Math.floor(Math.random() * (maxX + 1)) + "px";
      coin.style.top = Math.floor(Math.random() * (maxY + 1)) + "px";
    }
  }

  // 7) COLLISIONE PLAYER - NEMICO
  function checkEnemyCollision() {
    if (!canBeHit || isGameOver) return;

    const p = player.getBoundingClientRect();
    const e = enemy.getBoundingClientRect();

    const hit =
      p.left < e.right &&
      p.right > e.left &&
      p.top < e.bottom &&
      p.bottom > e.top;

    if (hit) {
      lives--;
      livesSpan.textContent = lives;

      // invincibilità breve
      canBeHit = false;
      setTimeout(() => { canBeHit = true; }, hitCooldownMs);

      if (lives <= 0) {
        gameOver("GAME OVER - premi R");
      }
    }
  }

  // 8) GAME OVER
  function gameOver(text) {
    isGameOver = true;
    statusSpan.textContent = "GAME OVER ❌";
    messageDiv.textContent = text;

    up = down = left = right = false;
    turbo = false;
    currentSpeed = normalSpeed;
  }

  // 9) TIMER
  setInterval(() => {
    if (isGameOver) return;

    timeLeft--;
    timeSpan.textContent = timeLeft;

    if (timeLeft <= 0) {
      gameOver("TEMPO FINITO - premi R");
    }
  }, 1000);

  // 10) RESTART
  function restartGame() {
    isGameOver = false;

    x = 10; y = 10;
    score = 0; lives = 3; timeLeft = 30;

    enemyX = 200; enemyY = 150;
    enemyVX = 5; enemyVY = 4;

    canBeHit = true;

    scoreSpan.textContent = score;
    livesSpan.textContent = lives;
    timeSpan.textContent = timeLeft;

    statusSpan.textContent = "JS attivo ✅";
    messageDiv.textContent = "";
    lastKeySpan.textContent = "none";

    up = down = left = right = false;
    turbo = false;
    currentSpeed = normalSpeed;
  }

  // 11) INPUT
  window.addEventListener("keydown", (event) => {
    lastKeySpan.textContent = event.key;

    if (event.key.startsWith("Arrow")) event.preventDefault();

    // Turbo con Shift
    if (event.key === "Shift") {
      turbo = true;
      currentSpeed = turboSpeed;
    }

    if (event.key === "r" || event.key === "R") {
      restartGame();
      return;
    }

    if (isGameOver) return;

    if (event.key === "ArrowUp") up = true;
    if (event.key === "ArrowDown") down = true;
    if (event.key === "ArrowLeft") left = true;
    if (event.key === "ArrowRight") right = true;
  });

  window.addEventListener("keyup", (event) => {
    if (event.key === "ArrowUp") up = false;
    if (event.key === "ArrowDown") down = false;
    if (event.key === "ArrowLeft") left = false;
    if (event.key === "ArrowRight") right = false;

    // Quando lasci Shift, torni alla velocità normale
    if (event.key === "Shift") {
      turbo = false;
      currentSpeed = normalSpeed;
    }
  });

  // 12) GAME LOOP
  function gameLoop() {
    if (!isGameOver) {
      if (right) x += currentSpeed;
      if (left) x -= currentSpeed;
      if (down) y += currentSpeed;
      if (up) y -= currentSpeed;

      updatePlayer();
      updateEnemy();
      checkCoinCollision();
      checkEnemyCollision();
    }

    requestAnimationFrame(gameLoop);
  }

  // Avvio
  updatePlayer();
  updateEnemy();
  gameLoop();
});
