// Space Shooter Game for Portfolio
// Player: Guitar shooting musical notes at enemies (notes and chords)

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let player = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  width: 50,
  height: 50,
  speed: 5,
  dx: 0,
};

let bullets = [];
let enemies = [];

// Load guitar image
const guitarImage = new Image();
guitarImage.src = 'guitar.png';

// Load enemy images (notes and chords)
const noteImage = new Image();
noteImage.src = 'note.png';
const chordImage = new Image();
chordImage.src = 'chord.png';

// Player movement
window.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') {
    player.dx = -player.speed;
  }
  if (e.key === 'ArrowRight') {
    player.dx = player.speed;
  }
  if (e.key === ' ') {
    shootBullet();
  }
});

window.addEventListener('keyup', function (e) {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    player.dx = 0;
  }
});

// Shooting bullets
function shootBullet() {
  bullets.push({
    x: player.x + player.width / 2 - 5,
    y: player.y,
    width: 10,
    height: 20,
    speed: 7,
  });
}

// Create enemies
function createEnemy() {
  const type = Math.random() > 0.5 ? 'note' : 'chord';
  enemies.push({
    x: Math.random() * (canvas.width - 50),
    y: -50,
    width: 50,
    height: 50,
    speed: 2,
    type: type,
    hits: type === 'chord' ? 2 : 1,
  });
}

// Update game state
function update() {
  // Move player
  player.x += player.dx;
  if (player.x < 0) player.x = 0;
  if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;

  // Move bullets
  bullets.forEach((bullet, index) => {
    bullet.y -= bullet.speed;
    if (bullet.y < 0) {
      bullets.splice(index, 1);
    }
  });

  // Move enemies
  enemies.forEach((enemy, index) => {
    enemy.y += enemy.speed;
    if (enemy.y > canvas.height) {
      enemies.splice(index, 1);
    }
  });

  // Check for collisions
  bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        enemy.hits -= 1;
        bullets.splice(bulletIndex, 1);
        if (enemy.hits <= 0) {
          enemies.splice(enemyIndex, 1);
        }
      }
    });
  });
}

// Draw game elements
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.drawImage(guitarImage, player.x, player.y, player.width, player.height);

  // Draw bullets
  bullets.forEach((bullet) => {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });

  // Draw enemies
  enemies.forEach((enemy) => {
    if (enemy.type === 'note') {
      ctx.drawImage(noteImage, enemy.x, enemy.y, enemy.width, enemy.height);
    } else {
      ctx.drawImage(chordImage, enemy.x, enemy.y, enemy.width, enemy.height);
    }
  });
}

// Main game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start game
setInterval(createEnemy, 2000);
gameLoop();
