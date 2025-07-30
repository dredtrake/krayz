// Explosion rendering functions

export const drawExplosion = (ctx, width, height, ball, elapsed, explosionDuration) => {
  const progress = Math.min(elapsed / explosionDuration, 1);
  
  // Chaotic explosion particles
  drawExplosionParticles(ctx, ball, progress, elapsed);
  
  // Enhanced flash effect
  if (progress < 0.2) {
    const flashAlpha = 0.6 * (1 - progress / 0.2);
    ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
    ctx.fillRect(0, 0, width, height);
  }
  
  // Add shockwave ring
  if (progress < 0.5) {
    const ringRadius = progress * 120;
    const ringAlpha = (1 - progress / 0.5) * 0.4;
    ctx.strokeStyle = `rgba(255, 150, 0, ${ringAlpha})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ringRadius, 0, Math.PI * 2);
    ctx.stroke();
  }
};

const drawExplosionParticles = (ctx, ball, progress, elapsed) => {
  const particleCount = 40;
  
  for (let i = 0; i < particleCount; i++) {
    // Much more random angles and movement
    const randomSeed = i * 7.123; // Use particle index as seed for consistent randomness
    const chaosX = Math.sin(randomSeed * 2.5) * Math.cos(randomSeed * 1.7);
    const chaosY = Math.cos(randomSeed * 3.1) * Math.sin(randomSeed * 2.2);
    
    // Random angle with chaos
    const baseAngle = (i / particleCount) * Math.PI * 2;
    const angleVariation = (Math.sin(randomSeed * 4.7) * Math.cos(elapsed * 0.05 + randomSeed)) * 2;
    const angle = baseAngle + angleVariation;
    
    // Highly variable speeds and distances
    const speedMultiplier = 0.5 + Math.abs(Math.sin(randomSeed * 3.3)) * 1.5;
    const baseDistance = progress * (60 + Math.abs(chaosX) * 80) * speedMultiplier;
    
    // Erratic wobbling
    const wobbleIntensity = 20 + Math.abs(chaosY) * 30;
    const wobble = Math.sin(elapsed * (0.03 + Math.abs(chaosX) * 0.02) + randomSeed) * wobbleIntensity;
    const distance = baseDistance + wobble;
    
    // Add some particles that spiral
    const spiralEffect = Math.sin(elapsed * 0.08 + randomSeed * 2) * (progress * 40);
    
    const x = ball.x + Math.cos(angle) * distance + chaosX * spiralEffect;
    const y = ball.y + Math.sin(angle) * distance + chaosY * spiralEffect;
    
    // Highly variable alpha and size
    const alphaVariation = 0.4 + Math.abs(Math.sin(randomSeed * 5.1)) * 0.6;
    const alpha = (1 - progress) * alphaVariation * (0.6 + Math.sin(elapsed * 0.04 + randomSeed) * 0.4);
    
    const baseSizeVariation = 1 + Math.abs(chaosY) * 4;
    const pulsing = Math.sin(elapsed * (0.06 + Math.abs(chaosX) * 0.04) + randomSeed * 1.5) * 3;
    const size = Math.max(0.3, baseSizeVariation + pulsing * (1 - progress));
    
    // More chaotic colors
    const colorChaos = Math.sin(randomSeed * 6.7) * 0.5 + 0.5;
    const red = Math.floor(255 * (0.8 + colorChaos * 0.2));
    const green = Math.floor((120 + colorChaos * 80) * (1 - progress) + 30);
    const blue = Math.floor((20 + colorChaos * 40) * (1 - progress));
    
    ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    
    // More chaotic trails
    if (progress > 0.2 && Math.sin(randomSeed * 3.8) > -0.3) {
      const trailDistance = distance * (0.5 + Math.abs(chaosX) * 0.4);
      const trailX = ball.x + Math.cos(angle) * trailDistance + chaosY * spiralEffect * 0.5;
      const trailY = ball.y + Math.sin(angle) * trailDistance + chaosX * spiralEffect * 0.5;
      ctx.fillStyle = `rgba(${red}, ${Math.min(255, green + 60)}, ${blue + 30}, ${alpha * 0.3})`;
      ctx.beginPath();
      ctx.arc(trailX, trailY, size * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // More random sparks
    if (Math.sin(randomSeed * 4.2) > 0.2 && progress < 0.9) {
      const sparkCount = Math.floor(Math.abs(chaosY) * 3) + 1;
      for (let s = 0; s < sparkCount; s++) {
        const sparkX = x + (Math.sin(randomSeed * 7.5 + s) * 15);
        const sparkY = y + (Math.cos(randomSeed * 8.1 + s) * 15);
        const sparkSize = 1 + Math.abs(chaosX) * 2;
        ctx.fillStyle = `rgba(255, ${200 + Math.floor(Math.abs(chaosY) * 55)}, 100, ${alpha * 0.9})`;
        ctx.fillRect(sparkX - sparkSize/2, sparkY - sparkSize/2, sparkSize, sparkSize);
      }
    }
  }
};