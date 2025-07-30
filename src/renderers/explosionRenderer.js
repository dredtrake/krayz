// Explosion rendering functions

export const drawExplosion = (ctx, width, height, ball, elapsed, explosionDuration, move) => {
  const progress = Math.min(elapsed / explosionDuration, 1);

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Draw distorted walls with changing colors first
  drawDistortedWalls(ctx, width, height, move, elapsed);

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
    const angleVariation = Math.sin(randomSeed * 4.7) * Math.cos(elapsed * 0.05 + randomSeed) * 2;
    const angle = baseAngle + angleVariation;

    // Highly variable speeds and distances
    const speedMultiplier = 0.5 + Math.abs(Math.sin(randomSeed * 3.3)) * 1.5;
    const baseDistance = progress * (60 + Math.abs(chaosX) * 80) * speedMultiplier;

    // Erratic wobbling
    const wobbleIntensity = 20 + Math.abs(chaosY) * 30;
    const wobble =
      Math.sin(elapsed * (0.03 + Math.abs(chaosX) * 0.02) + randomSeed) * wobbleIntensity;
    const distance = baseDistance + wobble;

    // Add some particles that spiral
    const spiralEffect = Math.sin(elapsed * 0.08 + randomSeed * 2) * (progress * 40);

    const x = ball.x + Math.cos(angle) * distance + chaosX * spiralEffect;
    const y = ball.y + Math.sin(angle) * distance + chaosY * spiralEffect;

    // Highly variable alpha and size
    const alphaVariation = 0.4 + Math.abs(Math.sin(randomSeed * 5.1)) * 0.6;
    const alpha =
      (1 - progress) * alphaVariation * (0.6 + Math.sin(elapsed * 0.04 + randomSeed) * 0.4);

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
        const sparkX = x + Math.sin(randomSeed * 7.5 + s) * 15;
        const sparkY = y + Math.cos(randomSeed * 8.1 + s) * 15;
        const sparkSize = 1 + Math.abs(chaosX) * 2;
        ctx.fillStyle = `rgba(255, ${200 + Math.floor(Math.abs(chaosY) * 55)}, 100, ${alpha * 0.9})`;
        ctx.fillRect(sparkX - sparkSize / 2, sparkY - sparkSize / 2, sparkSize, sparkSize);
      }
    }
  }
};

const drawDistortedWalls = (ctx, width, height, move, elapsed) => {
  const time = elapsed * 0.001;
  const progress = Math.min(elapsed / 2500, 1); // Progress over explosion duration

  // Increase distortion over time for melting effect
  const baseMelt = progress * 30; // Increases as explosion progresses
  const distortionAmount = Math.sin(time * 5) * 15 + Math.sin(time * 3) * 10 + baseMelt;

  // Create toxic/radioactive effect for walls
  const toxicIntensity = Math.sin(time * 4) * 0.4 + 0.6; // Pulsing toxic intensity

  // Left wall with melting distortion (toxic green colors)
  const toxicRed = Math.floor(50 + Math.sin(time * 5) * 30);
  const toxicGreen = Math.floor(255 * toxicIntensity);
  const toxicBlue = Math.floor(30 + Math.sin(time * 3) * 20);
  ctx.fillStyle = `rgba(${toxicRed}, ${toxicGreen}, ${toxicBlue}, ${0.8 - progress * 0.2})`;
  ctx.beginPath();
  ctx.moveTo(0, 0);

  for (let y = 0; y <= height; y += 5) {
    // Add gravity effect - more distortion at bottom
    const gravityFactor = (y / height) * progress * 20;
    const meltDrip = Math.sin(y * 0.05 + time * 12) * (distortionAmount + gravityFactor);
    const x = move.l + meltDrip + Math.cos(y * 0.03 + time * 6) * 5;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(0, height);
  ctx.lineTo(0, 0);
  ctx.fill();

  // Add dripping effect (toxic green drips)
  for (let i = 0; i < 5; i++) {
    const dripY = (Math.sin(i * 2.3 + time * 4) + 1) * height * 0.5;
    const dripHeight = progress * 50 + Math.sin(time * 8 + i) * 20;
    const dripX = move.l + Math.sin(i * 3.7 + time * 5) * 15;

    const dripRed = Math.floor(20 + Math.sin(time * 6 + i) * 40);
    const dripGreen = Math.floor(200 + Math.sin(time * 4 + i) * 55);
    const dripBlue = Math.floor(10 + Math.sin(time * 8 + i) * 30);
    ctx.fillStyle = `rgba(${dripRed}, ${dripGreen}, ${dripBlue}, ${0.7 - progress * 0.3})`;
    ctx.beginPath();
    ctx.moveTo(dripX - 3, dripY);
    ctx.quadraticCurveTo(
      dripX,
      dripY + dripHeight,
      dripX + Math.sin(time * 10) * 5,
      dripY + dripHeight
    );
    ctx.quadraticCurveTo(dripX, dripY + dripHeight * 0.5, dripX + 3, dripY);
    ctx.fill();
  }

  // Right wall with melting distortion (lime green toxic colors)
  const limeRed = Math.floor(100 + Math.sin(time * 6) * 50);
  const limeGreen = Math.floor(255);
  const limeBlue = Math.floor(50 + Math.sin(time * 4) * 40);
  ctx.fillStyle = `rgba(${limeRed}, ${limeGreen}, ${limeBlue}, ${0.8 - progress * 0.2})`;
  ctx.beginPath();
  ctx.moveTo(width, 0);

  for (let y = 0; y <= height; y += 5) {
    const gravityFactor = (y / height) * progress * 20;
    const meltDrip = Math.sin(y * 0.05 + time * 11 + 1) * (distortionAmount + gravityFactor);
    const x = width - move.r - meltDrip - Math.cos(y * 0.03 + time * 7) * 5;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(width, height);
  ctx.lineTo(width, 0);
  ctx.fill();

  // Add dripping effect (bright lime drips)
  for (let i = 0; i < 5; i++) {
    const dripY = (Math.sin(i * 2.7 + time * 3.5) + 1) * height * 0.5;
    const dripHeight = progress * 60 + Math.sin(time * 7 + i * 1.3) * 25;
    const dripX = width - move.r - Math.sin(i * 3.2 + time * 4.5) * 15;

    const dripRed = Math.floor(80 + Math.sin(time * 5 + i) * 40);
    const dripGreen = Math.floor(255);
    const dripBlue = Math.floor(20 + Math.sin(time * 7 + i) * 30);
    ctx.fillStyle = `rgba(${dripRed}, ${dripGreen}, ${dripBlue}, ${0.7 - progress * 0.3})`;
    ctx.beginPath();
    ctx.moveTo(dripX + 3, dripY);
    ctx.quadraticCurveTo(
      dripX,
      dripY + dripHeight,
      dripX - Math.sin(time * 9) * 5,
      dripY + dripHeight
    );
    ctx.quadraticCurveTo(dripX, dripY + dripHeight * 0.5, dripX - 3, dripY);
    ctx.fill();
  }

  // Top wall with melting distortion (sickly yellow-green colors)
  const sicklyRed = Math.floor(150 + Math.sin(time * 5) * 50);
  const sicklyGreen = Math.floor(255 * toxicIntensity);
  const sicklyBlue = Math.floor(20 + Math.sin(time * 7) * 30);
  ctx.fillStyle = `rgba(${sicklyRed}, ${sicklyGreen}, ${sicklyBlue}, ${0.8 - progress * 0.2})`;
  ctx.beginPath();
  ctx.moveTo(0, 0);

  for (let x = 0; x <= width; x += 5) {
    // Less gravity effect on top, but still some melting
    const meltDrip = Math.sin(x * 0.05 + time * 10) * distortionAmount;
    const y = move.u + meltDrip + progress * Math.sin(x * 0.02) * 15;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(width, 0);
  ctx.lineTo(0, 0);
  ctx.fill();

  // Add dripping effect downward (radioactive yellow drips)
  for (let i = 0; i < 8; i++) {
    const dripX = (Math.sin(i * 1.7 + time * 3) + 1) * width * 0.5;
    const dripHeight = progress * 40 + Math.sin(time * 6 + i * 0.8) * 15;
    const dripY = move.u;

    const dripRed = Math.floor(180 + Math.sin(time * 7 + i) * 40);
    const dripGreen = Math.floor(255);
    const dripBlue = Math.floor(Math.sin(time * 9 + i) * 60);
    ctx.fillStyle = `rgba(${dripRed}, ${dripGreen}, ${dripBlue}, ${0.7 - progress * 0.3})`;
    ctx.beginPath();
    ctx.moveTo(dripX - 3, dripY);
    ctx.quadraticCurveTo(
      dripX + Math.sin(time * 8) * 3,
      dripY + dripHeight * 0.5,
      dripX,
      dripY + dripHeight
    );
    ctx.quadraticCurveTo(
      dripX - Math.sin(time * 8) * 3,
      dripY + dripHeight * 0.5,
      dripX + 3,
      dripY
    );
    ctx.fill();
  }

  // Bottom wall with melting distortion (dark toxic green colors)
  const darkRed = Math.floor(30 + Math.sin(time * 4) * 20);
  const darkGreen = Math.floor(180 + Math.sin(time * 3) * 75);
  const darkBlue = Math.floor(40 + Math.sin(time * 5) * 30);
  ctx.fillStyle = `rgba(${darkRed}, ${darkGreen}, ${darkBlue}, ${0.8 - progress * 0.2})`;
  ctx.beginPath();
  ctx.moveTo(0, height);

  for (let x = 0; x <= width; x += 5) {
    // Maximum melting effect on bottom - it's fighting gravity
    const meltWave = Math.sin(x * 0.05 + time * 9) * (distortionAmount * 1.5);
    const meltUp = progress * Math.sin(x * 0.03 + time * 4) * 25;
    const y = height - move.d - meltWave - meltUp;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.fill();

  // Add bubbling/melting pools (toxic waste pools)
  for (let i = 0; i < 10; i++) {
    const poolX = (Math.sin(i * 1.3 + time * 2.5) + 1) * width * 0.5;
    const poolSize = Math.max(1, progress * 30 + Math.sin(time * 5 + i) * 10);
    const poolY = height - move.d;

    const poolRed = Math.floor(60 + Math.sin(time * 6 + i) * 40);
    const poolGreen = Math.floor(255);
    const poolBlue = Math.floor(80 + Math.sin(time * 8 + i) * 50);
    ctx.fillStyle = `rgba(${poolRed}, ${poolGreen}, ${poolBlue}, ${0.6 - progress * 0.2})`;
    ctx.beginPath();
    ctx.ellipse(poolX, poolY, poolSize, Math.max(0.3, poolSize * 0.3), 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add toxic glitch effect
  if (Math.random() < 0.1) {
    const glitchRed = Math.floor(Math.random() * 100);
    const glitchGreen = Math.floor(200 + Math.random() * 55);
    const glitchBlue = Math.floor(Math.random() * 80);
    ctx.fillStyle = `rgba(${glitchRed}, ${glitchGreen}, ${glitchBlue}, 0.4)`;
    const glitchX = Math.random() * width;
    const glitchY = Math.random() * height;
    const glitchW = Math.random() * 100 + 50;
    const glitchH = Math.random() * 20 + 10;
    ctx.fillRect(glitchX, glitchY, glitchW, glitchH);
  }
};
