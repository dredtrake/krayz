// Start screen rendering functions

export const drawStartScreen = (ctx, width, height, startScreenStartTime) => {
  const now = Date.now();
  
  // Gentle retro background with soft blue tint
  ctx.fillStyle = "#001122";
  ctx.fillRect(0, 0, width, height);
  
  // Subtle animated background pattern (slower)
  ctx.fillStyle = `rgba(0, 100, 150, ${0.05 + Math.sin(now * 0.001) * 0.03})`;
  ctx.fillRect(0, 0, width, height);
  
  // Gentle scanlines (slower and less aggressive)
  for (let y = 0; y < height; y += 6) {
    ctx.fillStyle = `rgba(0, 150, 200, ${0.08 + Math.sin(now * 0.002 + y * 0.05) * 0.02})`;
    ctx.fillRect(0, y, width, 1);
  }
  
  // Independent wall animations with different mathematical functions
  drawDemoWalls(ctx, width, height, now);
  
  // Animated demo ball (slower movement)
  drawDemoBall(ctx, width, height, now);
  
  // Main title "KRAYZ" with retro styling (no size change)
  drawTitle(ctx, width, height, now);
  
  // Subtitle with typewriter effect
  drawSubtitles(ctx, width, height, now, startScreenStartTime);
  
  // Gentle border effect
  drawBorder(ctx, width, height, now);
};

const drawDemoWalls = (ctx, width, height, now) => {
  const maxWallSize = 40;
  
  // Each wall uses completely different movement patterns for true independence
  const leftWallSize = ((Math.sin(now * 0.0014) + 1) / 2) * maxWallSize;
  const rightWallSize = ((Math.cos(now * 0.0017) + 1) / 2) * maxWallSize;
  const topWallSize = ((Math.sin(now * 0.0011 + Math.PI * 0.7) * Math.cos(now * 0.0003) + 1) / 2) * maxWallSize;
  const bottomWallSize = ((Math.abs(Math.sin(now * 0.0019)) * 2 - 1 + 1) / 2) * maxWallSize;
  
  // Demo walls (translucent) with independent movement
  ctx.fillStyle = `rgba(255, 100, 150, 0.3)`; // left wall
  ctx.fillRect(0, 0, leftWallSize, height);
  
  ctx.fillStyle = `rgba(100, 255, 200, 0.3)`; // right wall  
  ctx.fillRect(width - rightWallSize, 0, rightWallSize, height);
  
  ctx.fillStyle = `rgba(200, 255, 150, 0.3)`; // top wall
  ctx.fillRect(0, 0, width, topWallSize);
  
  ctx.fillStyle = `rgba(200, 100, 255, 0.3)`; // bottom wall
  ctx.fillRect(0, height - bottomWallSize, width, bottomWallSize);
};

const drawDemoBall = (ctx, width, height, now) => {
  const ballX = width / 2 + Math.sin(now * 0.0015) * 80;
  const ballY = height / 2 + Math.cos(now * 0.0012) * 60;
  
  // Ball glow effect
  const gradient = ctx.createRadialGradient(ballX, ballY, 0, ballX, ballY, 20);
  gradient.addColorStop(0, 'rgba(255, 255, 100, 0.8)');
  gradient.addColorStop(1, 'rgba(255, 255, 100, 0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(ballX, ballY, 20, 0, Math.PI * 2);
  ctx.fill();
  
  // Demo ball
  ctx.fillStyle = `rgba(255, 255, 100, 0.9)`;
  ctx.beginPath();
  ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
  ctx.fill();
};

const drawTitle = (ctx, width, height, now) => {
  ctx.save();
  ctx.translate(width / 2, height / 2 - 100);
  
  // Title shadow
  ctx.fillStyle = "rgba(0, 100, 150, 0.8)";
  ctx.font = "bold 80px monospace";
  ctx.textAlign = "center";
  ctx.fillText("KRAYZ", 4, 4);
  
  // Main title with gentle color shift
  const titleHue = Math.sin(now * 0.0008) * 30 + 180; // Slower blue to cyan shift
  ctx.fillStyle = `hsl(${titleHue}, 80%, 70%)`;
  ctx.fillText("KRAYZ", 0, 0);
  
  // Title outline
  ctx.strokeStyle = `rgba(255, 255, 255, 0.6)`;
  ctx.lineWidth = 2;
  ctx.strokeText("KRAYZ", 0, 0);
  
  ctx.restore();
};

const drawSubtitles = (ctx, width, height, now, startScreenStartTime) => {
  const subtitle1 = "Use arrow keys to shrink the walls";
  const subtitle2 = "Don't let the ball hit a moving wall!";
  
  const elapsed = now - startScreenStartTime;
  const typeSpeed = elapsed * 0.02; // Slower typewriter effect
  
  ctx.fillStyle = `rgba(100, 255, 200, 0.9)`;
  ctx.font = "24px monospace";
  ctx.textAlign = "center";
  
  // First subtitle - original logic but without the modulo (cycling)
  const chars1 = Math.min(subtitle1.length, Math.floor(typeSpeed));
  if (chars1 > 0) {
    ctx.fillText(subtitle1.substring(0, chars1), width / 2, height / 2 + 20);
  }
  
  // Second subtitle (starts after first is complete) - original logic but without modulo
  if (chars1 >= subtitle1.length) {
    const chars2 = Math.min(subtitle2.length, Math.floor(typeSpeed - subtitle1.length - 20));
    if (chars2 > 0) {
      ctx.fillText(subtitle2.substring(0, chars2), width / 2, height / 2 + 55);
    }
  }
};

const drawBorder = (ctx, width, height, now) => {
  // Gentle border effect (slower pulsing)
  const borderPulse = Math.sin(now * 0.0015) * 0.2 + 0.6;
  
  // Outer border in soft cyan
  ctx.strokeStyle = `rgba(100, 200, 255, ${borderPulse})`;
  ctx.lineWidth = 3;
  ctx.strokeRect(15, 15, width - 30, height - 30);
  
  // Inner accent lines
  ctx.strokeStyle = `rgba(150, 255, 200, ${borderPulse * 0.7})`;
  ctx.lineWidth = 1;
  ctx.strokeRect(25, 25, width - 50, height - 50);
  
  // Corner decorations (softer than game over)
  const cornerSize = 20;
  ctx.strokeStyle = `rgba(255, 255, 100, ${borderPulse})`;
  ctx.lineWidth = 2;
  
  // Simple corner brackets
  const corners = [
    [25, 25], [width - 25, 25], 
    [25, height - 25], [width - 25, height - 25]
  ];
  
  corners.forEach(([x, y], i) => {
    ctx.beginPath();
    if (i === 0) { // Top-left
      ctx.moveTo(x, y + cornerSize);
      ctx.lineTo(x, y);
      ctx.lineTo(x + cornerSize, y);
    } else if (i === 1) { // Top-right
      ctx.moveTo(x - cornerSize, y);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y + cornerSize);
    } else if (i === 2) { // Bottom-left
      ctx.moveTo(x, y - cornerSize);
      ctx.lineTo(x, y);
      ctx.lineTo(x + cornerSize, y);
    } else { // Bottom-right
      ctx.moveTo(x - cornerSize, y);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y - cornerSize);
    }
    ctx.stroke();
  });
};