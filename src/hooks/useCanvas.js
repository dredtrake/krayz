import { useCallback, useRef, useEffect, useState, useMemo } from 'react';
import { resizeCanvas, countSurface } from '../utils/';
import { calculateScore } from '../utils/scoring';
import { drawWalls, drawBall, updateBallPhysics } from '../renderers/gameRenderers';
import { drawStartScreen } from '../renderers/startScreenRenderer';
import { drawExplosion } from '../renderers/explosionRenderer';
import { drawGameOverScreen } from '../renderers/gameOverRenderer';
import { drawTimer, drawCoveredPercentage, drawCurrentScore } from '../renderers/timerRenderer';

const [width, height] = [600, 600];

const initialSurface = width * height;

const dir = {
  u: 0,
  d: 0,
  l: 0,
  r: 0,
};

// const ballRadius = 10; // Moved to gameRenderers.js
const useCanvas = (options = {}) => {
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'paused', 'gameOver', 'gameOverAnimation', 'explosion'
  const [move, setMove] = useState(dir);
  const [isKeyDown, setIsKeyDown] = useState('');
  // value is in %
  const [surface, setSurface] = useState(0);
  const [gameOverStartTime, setGameOverStartTime] = useState(0);
  const [explosionStartTime, setExplosionStartTime] = useState(0);
  const [startScreenStartTime, setStartScreenStartTime] = useState(Date.now());
  const [gameStartTime, setGameStartTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(100);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameScore, setGameScore] = useState(null);
  const canvasRef = useRef(null);
  const ballRef = useRef({
    x: Math.floor(Math.random() * width),
    y: Math.floor(Math.random() * height),
    dx: 2,
    dy: -2,
  });
  const animationRef = useRef(null);

  const surfacePercentage = useMemo(() => {
    const remainingArea = countSurface(width, height, move);
    const coveredArea = initialSurface - remainingArea;
    return Math.floor((coveredArea * 100) / initialSurface);
  }, [move]);

  const draw = useCallback(
    ctx => {
      const ball = ballRef.current;

      ctx.clearRect(0, 0, width, height);

      // Draw game elements
      drawWalls(ctx, width, height, move);
      drawBall(ctx, ball, isKeyDown, gameState);

      // Only update ball if game is playing
      if (gameState === 'playing') {
        updateBallPhysics(
          ball,
          width,
          height,
          move,
          isKeyDown,
          setGameState,
          setExplosionStartTime,
          gameStartTime,
          setElapsedTime,
          surface,
          setGameScore
        );

        // Draw timer, covered percentage, and current score overlay
        drawTimer(ctx, width, height, timeLeft);
        drawCoveredPercentage(ctx, width, height, surface);
        drawCurrentScore(ctx, width, height, surface, elapsedTime);
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
        const animationDuration = 10000; // 10 seconds to allow plenty of time to read score and timer

        if (
          gameState === 'gameOverAnimation' &&
          elapsed >= animationDuration &&
          gameOverStartTime > 0
        ) {
          setGameState('gameOver');
        }

        drawGameOverScreen(ctx, width, height, gameState, elapsed, surface, elapsedTime, gameScore);
      }
    },
    [
      move,
      isKeyDown,
      gameState,
      surface,
      gameOverStartTime,
      explosionStartTime,
      startScreenStartTime,
      timeLeft,
      elapsedTime,
      gameScore,
    ]
  );

  const startGame = useCallback(() => {
    // Reset ball position
    ballRef.current = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
      dx: 2,
      dy: -2,
    };

    // Reset all state including startScreenStartTime
    setMove({ u: 0, d: 0, l: 0, r: 0 });
    setSurface(0);
    setIsKeyDown('');
    setGameOverStartTime(0);
    setExplosionStartTime(0);
    setStartScreenStartTime(Date.now()); // Reset this for next time we go to start screen
    setTimeLeft(100); // Reset countdown timer
    setGameStartTime(Date.now()); // Record when game started
    setElapsedTime(0); // Reset elapsed time
    setGameScore(null); // Reset score
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
    evt => {
      const { key } = evt;
      if (gameState !== 'playing') {
        return false;
      }
      if (key === 'ArrowUp') {
        setMove(prevState => ({ ...prevState, d: prevState.d + 1 }));
        setIsKeyDown('u');
      } else if (key === 'ArrowDown') {
        setMove(prevState => ({ ...prevState, u: prevState.u + 1 }));
        setIsKeyDown('d');
      } else if (key === 'ArrowLeft') {
        setMove(prevState => ({ ...prevState, r: prevState.r + 1 }));
        setIsKeyDown('l');
      } else if (key === 'ArrowRight') {
        setMove(prevState => ({ ...prevState, l: prevState.l + 1 }));
        setIsKeyDown('r');
      }
    },
    [gameState]
  );

  const onKeyUp = useCallback(evt => {
    const { key } = evt;
    if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
      setIsKeyDown('');
    }
  }, []);

  useEffect(() => {
    setSurface(surfacePercentage);
  }, [surfacePercentage]);

  // Countdown timer effect
  useEffect(() => {
    let interval;

    if (gameState === 'playing' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          const newTime = prevTime - 1;
          const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
          setElapsedTime(elapsed);
          if (newTime <= 0) {
            // Calculate final score when time runs out
            const finalScore = calculateScore(surface, elapsed);
            setGameScore(finalScore);
            setGameState('gameOverAnimation');
            setGameOverStartTime(Date.now());
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [gameState, timeLeft]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext(options.context || '2d');

    resizeCanvas(canvas);

    const render = () => {
      draw(context);
      animationRef.current = window.requestAnimationFrame(render);
    };

    if (
      gameState === 'playing' ||
      gameState === 'gameOverAnimation' ||
      gameState === 'explosion' ||
      gameState === 'start'
    ) {
      render();
    }

    return () => {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw, options, gameState]);

  useEffect(() => {
    if (
      gameState !== 'playing' &&
      gameState !== 'gameOverAnimation' &&
      gameState !== 'explosion' &&
      gameState !== 'start' &&
      animationRef.current
    ) {
      window.cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    } else if (
      (gameState === 'playing' ||
        gameState === 'gameOverAnimation' ||
        gameState === 'explosion' ||
        gameState === 'start') &&
      !animationRef.current
    ) {
      const canvas = canvasRef.current;
      const context = canvas.getContext(options.context || '2d');
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
