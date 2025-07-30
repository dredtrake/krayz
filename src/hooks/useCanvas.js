import { useCallback, useRef, useEffect, useState, useMemo } from "react";
import { resizeCanvas, countSurface } from "../utils/";

const [width, height] = [600, 600];

const initialSurface = width * height;

const dir = {
  u: 0,
  d: 0,
  l: 0,
  r: 0,
};

const ballRadius = 10;
const useCanvas = (options = {}) => {
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'paused', 'gameOver', 'gameOverAnimation', 'explosion'
  const [move, setMove] = useState(dir);
  const [isKeyDown, setIsKeyDown] = useState("");
  // value is in %
  const [surface, setSurface] = useState(0);
  const [gameOverStartTime, setGameOverStartTime] = useState(0);
  const [explosionStartTime, setExplosionStartTime] = useState(0);
  const [startScreenStartTime] = useState(Date.now());
  const canvasRef = useRef(null);
  const ballRef = useRef({
    x: Math.floor(Math.random() * width),
    y: Math.floor(Math.random() * height),
    dx: 2,
    dy: -2
  });
  const animationRef = useRef(null);

  const surfacePercentage = useMemo(() => {
    const remainingArea = countSurface(width, height, move);
    const coveredArea = initialSurface - remainingArea;
    return Math.floor((coveredArea * 100) / initialSurface);
  }, [move]);

  const draw = useCallback(
    (ctx) => {
      const ball = ballRef.current;
      
      ctx.clearRect(0, 0, width, height);
      
      // Draw colored rectangles (walls)
      ctx.fillStyle = "#FF99CC99"; // left
      ctx.fillRect(0, 0, move.l < width ? move.l : width, height);
      
      ctx.fillStyle = "#33FFCC99"; // right
      ctx.fillRect(
        width - move.r,
        0,
        move.r < width - move.l ? move.r : width,
        height
      );
      
      ctx.fillStyle = "#CCFF9999"; // top
      ctx.fillRect(0, 0, width, move.u < height ? move.u : height);
      
      ctx.fillStyle = "#CC229999"; // bottom
      ctx.fillRect(
        0,
        height - move.d,
        width,
        move.d < height ? move.d : height
      );
      
      // Draw ball (hide during explosion)
      if (gameState !== 'explosion') {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = isKeyDown !== "" ? "#9F221099" : "#CFBA3499";
        ctx.fill();
        ctx.closePath();
      }
      
      // Only update ball if game is playing
      if (gameState === 'playing') {
        // Ball collision detection and movement
        if (ball.x + ball.dx > width - ballRadius / 2 - move.r) {
          ball.dx = -ball.dx;
          if (isKeyDown === "l") {
            console.log('Ball hit moving wall, starting explosion');
            setGameState('explosion');
            setExplosionStartTime(Date.now());
            return;
          }
        }
        if (ball.x + ball.dx < ballRadius / 2 + move.l) {
          ball.dx = -ball.dx;
          if (isKeyDown === "r") {
            setGameState('explosion');
            setExplosionStartTime(Date.now());
            return;
          }
        }
        if (ball.y + ball.dy < ballRadius / 2 + move.u) {
          ball.dy = -ball.dy;
          if (isKeyDown === "d") {
            setGameState('explosion');
            setExplosionStartTime(Date.now());
            return;
          }
        }
        if (ball.y + ball.dy > height - ballRadius / 2 - move.d) {
          ball.dy = -ball.dy;
          if (isKeyDown === "u") {
            setGameState('explosion');
            setExplosionStartTime(Date.now());
            return;
          }
        }

        ball.x += ball.dx;
        ball.y += ball.dy;
      }
      
      // Game state overlays
      if (gameState === 'start') {
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
        
        // Animated demo ball (slower movement)
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
        
        // Main title \"KRAYZ\" with retro styling (no size change)
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
        
        // Subtitle with typewriter effect (original but without cycling)
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
      } else if (gameState === 'explosion') {
        const now = Date.now();
        const elapsed = explosionStartTime > 0 ? now - explosionStartTime : 0;
        console.log('Explosion state active, elapsed:', elapsed, 'startTime:', explosionStartTime);
        const explosionDuration = 2500; // Much longer duration
        
        if (elapsed >= explosionDuration && explosionStartTime > 0) {
          console.log('Explosion finished, transitioning to game over');
          setGameState('gameOverAnimation');
          setGameOverStartTime(Date.now());
        }
        
        const progress = Math.min(elapsed / explosionDuration, 1);
        const ball = ballRef.current;
        
        // Enhanced explosion particles
        const particleCount = 25;
        for (let i = 0; i < particleCount; i++) {
          const angle = (i / particleCount) * Math.PI * 2 + (elapsed * 0.01);
          const baseDistance = progress * (80 + i * 3);
          const wobble = Math.sin(elapsed * 0.02 + i) * 15;
          const distance = baseDistance + wobble;
          
          const x = ball.x + Math.cos(angle) * distance;
          const y = ball.y + Math.sin(angle) * distance;
          
          // More dynamic alpha and size
          const alpha = (1 - progress) * (0.7 + Math.sin(elapsed * 0.03 + i) * 0.3);
          const baseSize = 2 + i * 0.3;
          const pulsing = Math.sin(elapsed * 0.04 + i * 0.5) * 2;
          const size = Math.max(0.5, baseSize + pulsing * (1 - progress));
          
          // Color gradient from bright orange to red
          const colorProgress = Math.min(progress + i * 0.02, 1);
          const red = 255;
          const green = Math.floor(150 * (1 - colorProgress) + 50);
          const blue = Math.floor(30 * (1 - colorProgress));
          
          ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
          
          // Add particle trails
          if (progress > 0.3) {
            const trailX = ball.x + Math.cos(angle) * distance * 0.7;
            const trailY = ball.y + Math.sin(angle) * distance * 0.7;
            ctx.fillStyle = `rgba(${red}, ${green + 50}, ${blue + 20}, ${alpha * 0.4})`;
            ctx.beginPath();
            ctx.arc(trailX, trailY, size * 0.6, 0, Math.PI * 2);
            ctx.fill();
          }
          
          // Add sparks for some particles
          if (i % 3 === 0 && progress < 0.8) {
            const sparkX = x + (Math.random() - 0.5) * 10;
            const sparkY = y + (Math.random() - 0.5) * 10;
            ctx.fillStyle = `rgba(255, 255, 200, ${alpha * 0.8})`;
            ctx.fillRect(sparkX, sparkY, 2, 2);
          }
        }
        
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
        
      } else if (gameState === 'gameOverAnimation' || gameState === 'gameOver') {
        const now = Date.now();
        const elapsed = now - gameOverStartTime;
        const animationDuration = 3000; // 3 seconds
        
        if (gameState === 'gameOverAnimation' && elapsed >= animationDuration) {
          setGameState('gameOver');
        }
        
        const progress = Math.min(elapsed / animationDuration, 1);
        
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
        
        // Add some retro "static" effect
        if (Math.random() < 0.1) {
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
          for (let i = 0; i < 50; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }
    },
    [move, isKeyDown, gameState, surface, gameOverStartTime, explosionStartTime, startScreenStartTime]
  );

  const startGame = useCallback(() => {
    setGameState('playing');
    setMove(dir);
    setSurface(0);
    setIsKeyDown("");
    setGameOverStartTime(0);
    setExplosionStartTime(0);
    ballRef.current = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
      dx: 2,
      dy: -2
    };
    // Focus the canvas for immediate keyboard control
    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.focus();
      }
    }, 100);
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(gameState === 'paused' ? 'playing' : 'paused');
  }, [gameState]);

  const onKeyDown = useCallback(
    (evt) => {
      const { key } = evt;
      if (gameState !== 'playing') {
        return false;
      }
      if (key === "ArrowUp") {
        setMove((prevState) => ({ ...prevState, d: prevState.d + 1 }));
        setIsKeyDown("u");
      } else if (key === "ArrowDown") {
        setMove((prevState) => ({ ...prevState, u: prevState.u + 1 }));
        setIsKeyDown("d");
      } else if (key === "ArrowLeft") {
        setMove((prevState) => ({ ...prevState, r: prevState.r + 1 }));
        setIsKeyDown("l");
      } else if (key === "ArrowRight") {
        setMove((prevState) => ({ ...prevState, l: prevState.l + 1 }));
        setIsKeyDown("r");
      }
    },
    [gameState]
  );

  const onKeyUp = useCallback((evt) => {
    const { key } = evt;
    if (
      key === "ArrowUp" ||
      key === "ArrowDown" ||
      key === "ArrowLeft" ||
      key === "ArrowRight"
    ) {
      setIsKeyDown("");
    }
  }, []);

  useEffect(() => {
    setSurface(surfacePercentage);
  }, [surfacePercentage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext(options.context || "2d");

    resizeCanvas(canvas);

    const render = () => {
      draw(context);
      animationRef.current = window.requestAnimationFrame(render);
    };

    if (gameState === 'playing' || gameState === 'gameOverAnimation' || gameState === 'explosion' || gameState === 'start') {
      render();
    }

    return () => {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw, options, gameState]);

  useEffect(() => {
    if (gameState !== 'playing' && gameState !== 'gameOverAnimation' && gameState !== 'explosion' && gameState !== 'start' && animationRef.current) {
      window.cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    } else if ((gameState === 'playing' || gameState === 'gameOverAnimation' || gameState === 'explosion' || gameState === 'start') && !animationRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext(options.context || "2d");
      const render = () => {
        draw(context);
        animationRef.current = window.requestAnimationFrame(render);
      };
      render();
    }
  }, [gameState, draw, options]);

  return { canvasRef, surface, onKeyDown, onKeyUp, gameState, startGame, pauseGame };
};

export default useCanvas;
