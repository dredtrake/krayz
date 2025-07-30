// Game over screen rendering functions

export const drawGameOverScreen = (ctx, width, height, gameState, elapsed, surface) => {
  const now = Date.now();
  const animationDuration = 3000; // 3 seconds
  const progress = Math.min(elapsed / animationDuration, 1);
  
  // Retro CRT-style background with scanlines
  drawBackground(ctx, width, height, now, progress);
  
  // Game Over text
  drawGameOverText(ctx, width, height, gameState, elapsed, now);
  
  // Score display
  drawScore(ctx, width, height, elapsed, surface, now);
  
  // Retro border
  drawRetroBorder(ctx, width, height, now);
  
  // Static effect
  drawStaticEffect(ctx, width, height);
};

const drawBackground = (ctx, width, height, now, progress) => {
  // Retro CRT-style background with scanlines
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);
  
  // Add retro green tint overlay
  ctx.fillStyle = `rgba(0, 255, 0, ${0.05 + progress * 0.1})`;
  ctx.fillRect(0, 0, width, height);
  
  // Scanlines effect
  for (let y = 0; y < height; y += 4) {
    ctx.fillStyle = `rgba(0, 255, 0, ${0.1 + Math.sin(now * 0.01 + y * 0.1) * 0.05})`;
    ctx.fillRect(0, y, width, 2);
  }
  
  // Glitch effect squares (random pixels)
  if (Math.random() < 0.3) {
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 8 + 2;
      ctx.fillStyle = `rgba(${Math.random() * 100}, 255, ${Math.random() * 100}, 0.6)`;
      ctx.fillRect(x, y, size, size);
    }
  }
};

const drawGameOverText = (ctx, width, height, gameState, elapsed, now) => {
  // Retro pixel-style "GAME OVER" text
  const textScale = gameState === 'gameOverAnimation' ? 
    Math.min(1, (elapsed / 800) * 1.2) : 1; // Faster, bouncier scale
  
  ctx.save();
  ctx.translate(width / 2, height / 2 - 60);
  ctx.scale(textScale, textScale);
  
  // Create pixel-perfect text effect
  const textFlicker = Math.sin(now * 0.02) > 0.1 ? 1 : 0.7; // Random flicker
  
  // Shadow/depth effect in retro green
  ctx.fillStyle = `rgba(0, 150, 0, ${textFlicker * 0.8})`;
  ctx.font = "bold 72px monospace";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", 4, 4);
  
  // Main text in bright retro green
  ctx.fillStyle = `rgba(0, 255, 0, ${textFlicker})`;
  ctx.fillText("GAME OVER", 0, 0);
  
  // Add retro outline effect
  ctx.strokeStyle = `rgba(255, 255, 255, ${textFlicker * 0.6})`;
  ctx.lineWidth = 2;
  ctx.strokeText("GAME OVER", 0, 0);
  
  ctx.restore();
};

const drawScore = (ctx, width, height, elapsed, surface, now) => {
  // Retro score display with typewriter effect
  if (elapsed > 1000) {
    const scoreProgress = Math.min(1, (elapsed - 1000) / 1000);
    const scoreText = `FINAL SCORE: ${surface}% COVERED`;
    const visibleChars = Math.floor(scoreText.length * scoreProgress);
    const displayText = scoreText.substring(0, visibleChars);
    
    ctx.fillStyle = `rgba(255, 255, 0, ${scoreProgress})`;
    ctx.font = "bold 28px monospace";
    ctx.textAlign = "center";
    ctx.fillText(displayText, width / 2, height / 2 + 30);
    
    // Blinking cursor
    if (visibleChars < scoreText.length && Math.sin(now * 0.02) > 0) {
      ctx.fillText("_", width / 2 + ctx.measureText(displayText).width / 2 + 10, height / 2 + 30);
    }
  }
};

const drawRetroBorder = (ctx, width, height, now) => {
  // Retro border with classic arcade style
  const borderFlicker = Math.sin(now * 0.025) * 0.3 + 0.7;
  
  // Outer border in cyan
  ctx.strokeStyle = `rgba(0, 255, 255, ${borderFlicker})`;
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, width - 40, height - 40);
  
  // Inner border in magenta
  ctx.strokeStyle = `rgba(255, 0, 255, ${borderFlicker * 0.8})`;
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, width - 60, height - 60);
  
  // Classic arcade corner brackets
  const bracketSize = 25;
  ctx.strokeStyle = `rgba(255, 255, 0, ${borderFlicker})`;
  ctx.lineWidth = 3;
  
  // Corner brackets (classic arcade style)
  const corners = [
    [30, 30], [width - 30, 30], 
    [30, height - 30], [width - 30, height - 30]
  ];
  
  corners.forEach(([x, y], i) => {
    ctx.beginPath();
    if (i === 0) { // Top-left
      ctx.moveTo(x, y + bracketSize);
      ctx.lineTo(x, y);
      ctx.lineTo(x + bracketSize, y);
    } else if (i === 1) { // Top-right
      ctx.moveTo(x - bracketSize, y);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y + bracketSize);
    } else if (i === 2) { // Bottom-left
      ctx.moveTo(x, y - bracketSize);
      ctx.lineTo(x, y);
      ctx.lineTo(x + bracketSize, y);
    } else { // Bottom-right
      ctx.moveTo(x - bracketSize, y);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y - bracketSize);
    }
    ctx.stroke();
  });
};

const drawStaticEffect = (ctx, width, height) => {
  // Add some retro "static" effect
  if (Math.random() < 0.1) {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      ctx.fillRect(x, y, 1, 1);
    }
  }
};