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
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'paused', 'gameOver'
  const [move, setMove] = useState(dir);
  const [isKeyDown, setIsKeyDown] = useState("");
  // value is in %
  const [surface, setSurface] = useState(100);
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
            setGameState('gameOver');
            return;
          }
        }
        if (ball.x + ball.dx < ballRadius / 2 + move.l) {
          ball.dx = -ball.dx;
          if (isKeyDown === "r") {
            setGameState('gameOver');
            return;
          }
        }
        if (ball.y + ball.dy < ballRadius / 2 + move.u) {
          ball.dy = -ball.dy;
          if (isKeyDown === "d") {
            setGameState('gameOver');
            return;
          }
        }
        if (ball.y + ball.dy > height - ballRadius / 2 - move.d) {
          ball.dy = -ball.dy;
          if (isKeyDown === "u") {
            setGameState('gameOver');
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
        
        ctx.font = "bold 32px Arial";
        ctx.fillStyle = "#FFD700";
        ctx.fillText("Click START to begin", width / 2, height / 2 + 80);
      } else if (gameState === 'gameOver') {
        ctx.fillStyle = "rgba(150, 0, 0, 0.95)";
        ctx.fillRect(0, 0, width, height);
        
        // Flashing effect for game over
        const flashAlpha = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
        ctx.font = "bold 64px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", width / 2, height / 2 - 60);
        
        ctx.fillStyle = "white";
        ctx.font = "32px Arial";
        ctx.fillText(`Final Score: ${surface}%`, width / 2, height / 2);
        
        ctx.font = "bold 28px Arial";
        ctx.fillStyle = "#FFD700";
        ctx.fillText("Click RESTART to play again", width / 2, height / 2 + 60);
        
        // Add border effect
        ctx.strokeStyle = "#FF0000";
        ctx.lineWidth = 8;
        ctx.strokeRect(10, 10, width - 20, height - 20);
      }
    },
    [move, isKeyDown, gameState, surface]
  );

  const startGame = useCallback(() => {
    setGameState('playing');
    setMove(dir);
    setSurface(100);
    setIsKeyDown("");
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

    if (gameState === 'playing') {
      render();
    }

    return () => {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw, options, gameState]);

  useEffect(() => {
    if (gameState !== 'playing' && animationRef.current) {
      window.cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    } else if (gameState === 'playing' && !animationRef.current) {
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
