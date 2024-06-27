// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let player = {
    x: 50,
    y: canvas.height - 100,
    width: 30,
    height: 30,
    speed: 5,
    dy: 0, // Vertical velocity
    level: 1,
    experience: 0,
    maxExperience: 100,
    lives: 3,
    score: 0
};

let bullets = [];
let enemies = [];
let items = [];
let gameSpeed = 10; // Adjust game speed
let enemySpeed = 2; // Speed of enemies
let maxEnemies = 5; // Maximum number of enemies on screen
let itemSpawnRate = 0.02; // Chance of spawning an item per frame (0 to 1)

// Initialize the game
function init() {
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    spawnEnemy();
    updateGame();
}

// Update game objects
function updateGame() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update player position
    player.y += player.dy;

    // Draw player (triangle facing right)
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.moveTo(player.x, player.y + player.height / 2);
    ctx.lineTo(player.x + player.width, player.y);
    ctx.lineTo(player.x + player.width, player.y + player.height);
    ctx.closePath();
    ctx.fill();

    // Draw bullets
    bullets.forEach(bullet => {
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.x -= bullet.dx;
    });

    // Draw enemies
    enemies.forEach(enemy => {
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        enemy.x -= enemySpeed;
    });

    // Draw items
    items.forEach(item => {
        ctx.fillStyle = '#0000ff';
        ctx.fillRect(item.x, item.y, item.width, item.height);
        item.x -= 1; // Adjust item speed or behavior if needed
    });

    // Check collisions
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (collision(bullet, enemy)) {
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                player.score += 10;
                player.experience += 10;
                if (player.experience >= player.maxExperience) {
                    levelUp();
                }
            }
        });
    });

    enemies.forEach(enemy => {
        if (collision(player, enemy)) {
            player.lives--;
            respawnPlayer();
        }
    });

    items.forEach((item, itemIndex) => {
        if (collision(player, item)) {
            items.splice(itemIndex, 1);
            collectItem();
        }
    });

    // Spawn enemies
    if (Math.random() < itemSpawnRate) {
        spawnItem();
    }

    // Request animation frame
    requestAnimationFrame(updateGame);

    // Display score, lives, level, etc.
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${player.score} Lives: ${player.lives} Level: ${player.level}`, 10, 20);
}

// Key down event handler
function keyDownHandler(e) {
    if (e.key === 'w' || e.key === 'W') {
        player.dy = -player.speed;
    } else if (e.key === 's' || e.key === 'S') {
        player.dy = player.speed;
    } else if (e.key === ' ') {
        shoot();
    }
}

// Key up event handler
function keyUpHandler(e) {
    if (e.key === 'w' || e.key === 'W' || e.key === 's' || e.key === 'S') {
        player.dy = 0;
    }
}

// Player shoots bullets
function shoot() {
    bullets.push({
        x: player.x + player.width, // Adjust bullet spawn position
        y: player.y + player.height / 2 - 5, // Center bullet vertically
        width: 10,
        height: 10,
        dx: -10 // Bullet speed
    });
}

// Spawn enemy
function spawnEnemy() {
    setInterval(() => {
        if (enemies.length < maxEnemies) {
            let enemy = {
                x: canvas.width,
                y: Math.random() * (canvas.height - 50),
                width: 50,
                height: 50
            };
            enemies.push(enemy);
        }
    }, 2000); // Adjust enemy spawn rate
}

// Spawn item
function spawnItem() {
    let item = {
        x: Math.random() * (canvas.width - 30),
        y: Math.random() * (canvas.height - 30), // Randomize item spawn y-position
        width: 20,
        height: 20,
        type: 'health' // Example item type
    };
    items.push(item);
}

// Level up
function levelUp() {
    player.level++;
    player.experience = 0;
    player.maxExperience *= 1.5; // Increase experience needed for next level
    player.speed += 1; // Increase player speed
    player.lives++; // Increase player lives
}

// Respawn player
function respawnPlayer() {
    player.x = 50;
    player.y = canvas.height - 100;
}

// Collect item
function collectItem() {
    player.score += 1;
    player.experience += 1;
    // Implement further item collection logic (e.g., increase score, health, etc.)
}

// Collision detection
function collision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Initialize game
init();
