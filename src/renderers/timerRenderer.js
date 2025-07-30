// Timer and UI rendering functions

export const drawTimer = (ctx, width, height, timeLeft) => {
  // Timer background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(width - 120, 10, 110, 40);

  // Timer border
  ctx.strokeStyle = timeLeft <= 10 ? '#FF4444' : '#00FFFF';
  ctx.lineWidth = 2;
  ctx.strokeRect(width - 120, 10, 110, 40);

  // Timer text
  ctx.fillStyle = timeLeft <= 10 ? '#FF4444' : '#00FFFF';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`Time: ${timeLeft}s`, width - 65, 33);
};

export const drawCoveredPercentage = (ctx, width, height, surface) => {
  // Covered percentage background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(10, 10, 140, 40);

  // Covered percentage border
  ctx.strokeStyle = '#00FF88';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, 140, 40);

  // Covered percentage text
  ctx.fillStyle = '#00FF88';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`Covered: ${surface}%`, 80, 33);
};

export const drawCurrentScore = (ctx, width, height, surface, elapsedTime) => {
  // Import scoring function locally to avoid circular dependencies
  const calculateScore = (surfacePercentage, elapsedTime) => {
    const surfaceScore = surfacePercentage * 100;
    const timeBonus = elapsedTime * 10;
    const efficiencyBonus =
      surfacePercentage > 0
        ? Math.floor(((surfacePercentage * surfacePercentage) / (elapsedTime + 1)) * 5)
        : 0;
    return surfaceScore + timeBonus + efficiencyBonus;
  };

  const currentScore = calculateScore(surface, elapsedTime);

  // Current score background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(width / 2 - 80, 10, 160, 40);

  // Current score border
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 2;
  ctx.strokeRect(width / 2 - 80, 10, 160, 40);

  // Current score text
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`Score: ${currentScore}`, width / 2, 33);
};
