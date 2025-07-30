import { useCallback, useRef, useEffect, useState, useMemo } from "react";
import { resizeCanvas, countSurface } from "../utils/";
import { drawWalls, drawBall, updateBallPhysics } from "../renderers/gameRenderers";
import { drawStartScreen } from "../renderers/startScreenRenderer";
import { drawExplosion } from "../renderers/explosionRenderer";
import { drawGameOverScreen } from "../renderers/gameOverRenderer";

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
  const [startScreenStartTime, setStartScreenStartTime] = useState(Date.now());
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
      
      // Draw game elements
      drawWalls(ctx, width, height, move);
      drawBall(ctx, ball, isKeyDown, gameState);
      
      // Only update ball if game is playing
      if (gameState === 'playing') {
        updateBallPhysics(ball, width, height, move, isKeyDown, setGameState, setExplosionStartTime);
      }
      
      // Game state overlays
      if (gameState === 'start') {
        drawStartScreen(ctx, width, height, startScreenStartTime);
      } else if (gameState === 'explosion') {
        const now = Date.now();
        const elapsed = explosionStartTime > 0 ? now - explosionStartTime : 0;
        const explosionDuration = 2500; // Much longer duration
        
        if (elapsed >= explosionDuration && explosionStartTime > 0) {
          setGameState('gameOverAnimation');
          setGameOverStartTime(Date.now());
        }
        
        drawExplosion(ctx, width, height, ballRef.current, elapsed, explosionDuration);
        
      } else if (gameState === 'gameOverAnimation' || gameState === 'gameOver') {
        const now = Date.now();
        const elapsed = gameOverStartTime > 0 ? now - gameOverStartTime : 0;
        const animationDuration = 3000; // 3 seconds
        
        if (gameState === 'gameOverAnimation' && elapsed >= animationDuration && gameOverStartTime > 0) {
          setGameState('gameOver');
        }
        
        drawGameOverScreen(ctx, width, height, gameState, elapsed, surface);
      }
    },
    [move, isKeyDown, gameState, surface, gameOverStartTime, explosionStartTime, startScreenStartTime]
  );

  const startGame = useCallback(() => {
    // Reset ball position
    ballRef.current = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
      dx: 2,
      dy: -2
    };
    
    // Reset all state including startScreenStartTime
    setMove({ u: 0, d: 0, l: 0, r: 0 });
    setSurface(0);
    setIsKeyDown("");
    setGameOverStartTime(0);
    setExplosionStartTime(0);
    setStartScreenStartTime(Date.now()); // Reset this for next time we go to start screen
    setGameState('playing');
    
    // Focus the canvas
    if (canvasRef.current) {
      canvasRef.current.focus();
    }
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
