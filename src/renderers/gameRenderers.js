// Game rendering functions
const ballRadius = 10;

export const drawWalls = (ctx, width, height, move) => {
  // Draw colored rectangles (walls)
  ctx.fillStyle = '#FF99CC99'; // left
  ctx.fillRect(0, 0, move.l < width ? move.l : width, height);
  
  ctx.fillStyle = '#33FFCC99'; // right
  ctx.fillRect(
    width - move.r,
    0,
    move.r < width - move.l ? move.r : width,
    height
  );
  
  ctx.fillStyle = '#CCFF9999'; // top
  ctx.fillRect(0, 0, width, move.u < height ? move.u : height);
  
  ctx.fillStyle = '#CC229999'; // bottom
  ctx.fillRect(
    0,
    height - move.d,
    width,
    move.d < height ? move.d : height
  );
};

export const drawBall = (ctx, ball, isKeyDown, gameState) => {
  // Draw ball (hide during explosion)
  if (gameState !== 'explosion') {
    // Ball glow effect (similar to landing page)
    const gradient = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, ballRadius * 2);
    gradient.addColorStop(0, isKeyDown !== '' ? 'rgba(159, 34, 16, 0.8)' : 'rgba(207, 186, 52, 0.8)');
    gradient.addColorStop(1, isKeyDown !== '' ? 'rgba(159, 34, 16, 0)' : 'rgba(207, 186, 52, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius * 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Main ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = isKeyDown !== '' ? '#9F2210' : '#CFBA34';
    ctx.fill();
    ctx.closePath();
  }
};

export const updateBallPhysics = (ball, width, height, move, isKeyDown, setGameState, setExplosionStartTime) => {
  // Ball collision detection and movement
  if (ball.x + ball.dx > width - ballRadius / 2 - move.r) {
    ball.dx = -ball.dx;
    if (isKeyDown === 'l') {
      setGameState('explosion');
      setExplosionStartTime(Date.now());
      return;
    }
  }
  if (ball.x + ball.dx < ballRadius / 2 + move.l) {
    ball.dx = -ball.dx;
    if (isKeyDown === 'r') {
      setGameState('explosion');
      setExplosionStartTime(Date.now());
      return;
    }
  }
  if (ball.y + ball.dy < ballRadius / 2 + move.u) {
    ball.dy = -ball.dy;
    if (isKeyDown === 'd') {
      setGameState('explosion');
      setExplosionStartTime(Date.now());
      return;
    }
  }
  if (ball.y + ball.dy > height - ballRadius / 2 - move.d) {
    ball.dy = -ball.dy;
    if (isKeyDown === 'u') {
      setGameState('explosion');
      setExplosionStartTime(Date.now());
      return;
    }
  }

  ball.x += ball.dx;
  ball.y += ball.dy;
};