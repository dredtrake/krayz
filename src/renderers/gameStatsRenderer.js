// Unified game stats display

export const drawGameStats = (ctx, width, height, surface, timeLeft, displayedScore) => {
  // Stats box dimensions
  const boxWidth = 200;
  const boxHeight = 120;
  const boxX = width / 2 - boxWidth / 2;
  const boxY = 10;

  // Background with gradient
  const gradient = ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxHeight);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
  ctx.fillStyle = gradient;
  ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

  // Animated border
  const time = Date.now() * 0.001;
  const borderGradient = ctx.createLinearGradient(boxX, boxY, boxX + boxWidth, boxY + boxHeight);
  borderGradient.addColorStop(0, `hsl(${(time * 60) % 360}, 70%, 50%)`);
  borderGradient.addColorStop(0.5, `hsl(${(time * 60 + 180) % 360}, 70%, 50%)`);
  borderGradient.addColorStop(1, `hsl(${(time * 60 + 360) % 360}, 70%, 50%)`);
  ctx.strokeStyle = borderGradient;
  ctx.lineWidth = 2;
  ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

  // Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('GAME STATS', width / 2, boxY + 20);

  // Stats with individual colors
  ctx.font = '16px monospace';

  // Coverage (green)
  ctx.fillStyle = '#00FF88';
  ctx.textAlign = 'left';
  ctx.fillText('Coverage:', boxX + 15, boxY + 45);
  ctx.textAlign = 'right';
  ctx.fillText(`${surface}%`, boxX + boxWidth - 15, boxY + 45);

  // Timer (red when low, cyan when normal)
  ctx.fillStyle = timeLeft <= 10 ? '#FF4444' : '#00FFFF';
  ctx.textAlign = 'left';
  ctx.fillText('Time:', boxX + 15, boxY + 65);
  ctx.textAlign = 'right';
  ctx.fillText(`${timeLeft}s`, boxX + boxWidth - 15, boxY + 65);

  // Score (gold)
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('Score:', boxX + 15, boxY + 90);
  ctx.textAlign = 'right';
  ctx.fillText(`${Math.round(displayedScore)}`, boxX + boxWidth - 15, boxY + 90);

  // Subtle inner glow effect
  ctx.shadowColor = 'rgba(255, 255, 255, 0.1)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.strokeRect(boxX + 5, boxY + 5, boxWidth - 10, boxHeight - 10);
  ctx.shadowBlur = 0;
};
