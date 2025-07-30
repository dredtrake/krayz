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
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'paused', 'gameOver', 'gameOverAnimation'
  const [move, setMove] = useState(dir);
  const [isKeyDown, setIsKeyDown] = useState("");
  // value is in %
  const [surface, setSurface] = useState(100);
  const [gameOverStartTime, setGameOverStartTime] = useState(0);
  const canvasRef = useRef(null);
  const ballRef = useRef({
    x: Math.floor(Math.random() * width),
    y: Math.floor(Math.random() * height),
    dx: 2,
    dy: -2
  });
  const animationRef = useRef(null);

  const surfacePercentage = useMemo(() => {
    return Math.floor((countSurface(width, height, move) * 100) / initialSurface);
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
      
      // Draw ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = isKeyDown !== "" ? "#9F221099" : "#CFBA3499";
      ctx.fill();
      ctx.closePath();
      
      // Only update ball if game is playing
      if (gameState === 'playing') {
        // Ball collision detection and movement
        if (ball.x + ball.dx > width - ballRadius / 2 - move.r) {
          ball.dx = -ball.dx;
          if (isKeyDown === "l") {
            setGameState('gameOverAnimation');
            setGameOverStartTime(Date.now());
            return;
          }
        }
        if (ball.x + ball.dx < ballRadius / 2 + move.l) {
          ball.dx = -ball.dx;
          if (isKeyDown === "r") {
            setGameState('gameOverAnimation');
            setGameOverStartTime(Date.now());
            return;
          }
        }
        if (ball.y + ball.dy < ballRadius / 2 + move.u) {
          ball.dy = -ball.dy;
          if (isKeyDown === "d") {
            setGameState('gameOverAnimation');
            setGameOverStartTime(Date.now());
            return;
          }
        }
        if (ball.y + ball.dy > height - ballRadius / 2 - move.d) {
          ball.dy = -ball.dy;
          if (isKeyDown === "u") {
            setGameState('gameOverAnimation');
            setGameOverStartTime(Date.now());
            return;
          }
        }

        ball.x += ball.dx;
        ball.y += ball.dy;
      }
      
      // Game state overlays
      if (gameState === 'start') {
        ctx.fillStyle = "rgba(0, 50, 100, 0.95)";
        ctx.fillRect(0, 0, width, height);
        
        ctx.fillStyle = "white";
        ctx.font = "bold 56px Arial";
        ctx.textAlign = "center";
        ctx.fillText("KRAYZ", width / 2, height / 2 - 80);
        
        ctx.font = "28px Arial";
        ctx.fillText("Use arrow keys to shrink the walls", width / 2, height / 2 - 20);
        ctx.fillText("Don't let the ball hit a moving wall!", width / 2, height / 2 + 20);
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
        const pixelSize = 8;
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
          const scoreText = `FINAL SCORE: ${surface}%`;
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
    [move, isKeyDown, gameState, surface, gameOverStartTime]
  );

  const startGame = useCallback(() => {
    setGameState('playing');
    setMove(dir);
    setSurface(100);
    setIsKeyDown("");
    setGameOverStartTime(0); // Reset game over timer
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

    if (gameState === 'playing' || gameState === 'gameOverAnimation') {
      render();
    }

    return () => {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw, options, gameState]);

  useEffect(() => {
    if (gameState !== 'playing' && gameState !== 'gameOverAnimation' && animationRef.current) {
      window.cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    } else if ((gameState === 'playing' || gameState === 'gameOverAnimation') && !animationRef.current) {
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
