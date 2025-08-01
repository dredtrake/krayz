import { useCallback, useRef, useEffect, useState, useMemo } from 'react';
import { resizeCanvas, countSurface, getCanvasSize } from '../utils/';
import { calculateScore } from '../utils/scoring';
import { drawWalls, drawBall, updateBallPhysics } from '../renderers/gameRenderers';
import { drawStartScreen } from '../renderers/startScreenRenderer';
import { drawExplosion } from '../renderers/explosionRenderer';
import { drawGameOverScreen } from '../renderers/gameOverRenderer';

const dir = {
  u: 0,
  d: 0,
  l: 0,
  r: 0,
};

// const ballRadius = 10; // Moved to gameRenderers.js
const useCanvas = (options = {}) => {
  // Initialize game dimensions
  const initialDimensions = getCanvasSize();
  const [gameDimensions, setGameDimensions] = useState({
    width: initialDimensions.width,
    height: initialDimensions.height,
  });

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
  const [displayedScore, setDisplayedScore] = useState(0);
  const [targetScore, setTargetScore] = useState(0);

  const initialSurface = gameDimensions.width * gameDimensions.height;
  const canvasRef = useRef(null);
  const ballRef = useRef({
    x: Math.floor(Math.random() * gameDimensions.width),
    y: Math.floor(Math.random() * gameDimensions.height),
    dx: 2,
    dy: -2,
  });
  const animationRef = useRef(null);
  const gameStartTimeRef = useRef(0);
  const surfaceRef = useRef(0);

  const surfacePercentage = useMemo(() => {
    const remainingArea = countSurface(gameDimensions.width, gameDimensions.height, move);
    const coveredArea = initialSurface - remainingArea;
    return Math.floor((coveredArea * 100) / initialSurface);
  }, [move, gameDimensions, initialSurface]);

  const draw = useCallback(
    ctx => {
      const ball = ballRef.current;

      ctx.clearRect(0, 0, gameDimensions.width, gameDimensions.height);

      // Draw game elements
      drawWalls(ctx, gameDimensions.width, gameDimensions.height, move);
      drawBall(ctx, ball, isKeyDown, gameState);

      // Only update ball if game is playing
      if (gameState === 'playing') {
        updateBallPhysics(
          ball,
          gameDimensions.width,
          gameDimensions.height,
          move,
          isKeyDown,
          setGameState,
          setExplosionStartTime,
          gameStartTime,
          setElapsedTime,
          surface,
          setGameScore
        );

        // Stats are now displayed as HTML elements outside the canvas
      }

      // Game state overlays
      if (gameState === 'start') {
        drawStartScreen(ctx, gameDimensions.width, gameDimensions.height, startScreenStartTime);
      } else if (gameState === 'explosion') {
        const now = Date.now();
        const elapsed = explosionStartTime > 0 ? now - explosionStartTime : 0;
        const explosionDuration = 2500; // Much longer duration

        if (elapsed >= explosionDuration && explosionStartTime > 0) {
          setGameState('gameOverAnimation');
          setGameOverStartTime(Date.now());
        }

        drawExplosion(
          ctx,
          gameDimensions.width,
          gameDimensions.height,
          ballRef.current,
          elapsed,
          explosionDuration,
          move
        );
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

        drawGameOverScreen(
          ctx,
          gameDimensions.width,
          gameDimensions.height,
          gameState,
          elapsed,
          surface,
          elapsedTime,
          gameScore
        );
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
      elapsedTime,
      gameScore,
      gameStartTime,
      gameDimensions,
    ]
  );

  const startGame = useCallback(() => {
    // Reset ball position
    ballRef.current = {
      x: Math.floor(Math.random() * gameDimensions.width),
      y: Math.floor(Math.random() * gameDimensions.height),
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
    const startTime = Date.now();
    setGameStartTime(startTime); // Record when game started
    gameStartTimeRef.current = startTime; // Also store in ref
    setElapsedTime(0); // Reset elapsed time
    setGameScore(null); // Reset score
    setDisplayedScore(0); // Reset displayed score
    setTargetScore(0); // Reset target score
    setGameState('playing');

    // Focus the canvas
    if (canvasRef.current) {
      canvasRef.current.focus();
    }
  }, [gameDimensions.width, gameDimensions.height]);

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

  const onDirectionPress = useCallback(
    direction => {
      if (gameState !== 'playing') {
        return false;
      }

      if (direction === 'up') {
        setMove(prevState => ({ ...prevState, d: prevState.d + 1 }));
        setIsKeyDown('u');
      } else if (direction === 'down') {
        setMove(prevState => ({ ...prevState, u: prevState.u + 1 }));
        setIsKeyDown('d');
      } else if (direction === 'left') {
        setMove(prevState => ({ ...prevState, r: prevState.r + 1 }));
        setIsKeyDown('l');
      } else if (direction === 'right') {
        setMove(prevState => ({ ...prevState, l: prevState.l + 1 }));
        setIsKeyDown('r');
      }
    },
    [gameState]
  );

  const onDirectionRelease = useCallback(() => {
    setIsKeyDown('');
  }, []);

  useEffect(() => {
    setSurface(surfacePercentage);
    surfaceRef.current = surfacePercentage;
  }, [surfacePercentage]);

  // Handle window resize for responsive sizing
  useEffect(() => {
    const handleResize = () => {
      const newDimensions = getCanvasSize();
      setGameDimensions({ width: newDimensions.width, height: newDimensions.height });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    let interval;

    if (gameState === 'playing' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          const newTime = prevTime - 1;
          const elapsed = Math.floor((Date.now() - gameStartTimeRef.current) / 1000);
          setElapsedTime(elapsed);
          if (newTime <= 0) {
            // Calculate final score when time runs out
            const finalScore = calculateScore(surfaceRef.current, elapsed);
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

  // Calculate target score continuously during gameplay (without time bonus)
  useEffect(() => {
    if (gameState === 'playing') {
      const currentScore = calculateScore(surface, elapsedTime, false);
      setTargetScore(currentScore.totalScore);
    }
  }, [surface, elapsedTime, gameState]);

  // Animate displayed score towards target score
  useEffect(() => {
    let animationFrame;

    const animateScore = () => {
      setDisplayedScore(prevScore => {
        const diff = targetScore - prevScore;

        // If difference is small, just set it directly
        if (Math.abs(diff) < 1) {
          return targetScore;
        }

        // Otherwise, move towards target with easing
        const speed = Math.max(1, Math.abs(diff) * 0.1);
        if (diff > 0) {
          return Math.min(targetScore, prevScore + speed);
        } else {
          return Math.max(targetScore, prevScore - speed);
        }
      });

      animationFrame = requestAnimationFrame(animateScore);
    };

    if (gameState === 'playing') {
      animateScore();
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [targetScore, gameState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext(options.context || '2d');
    if (!context) return;

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
      if (!canvas) return;

      const context = canvas.getContext(options.context || '2d');
      if (!context) return;

      const render = () => {
        draw(context);
        animationRef.current = window.requestAnimationFrame(render);
      };
      render();
    }
  }, [gameState, draw, options]);

  return {
    canvasRef,
    surface,
    onKeyDown,
    onKeyUp,
    onDirectionPress,
    onDirectionRelease,
    gameState,
    startGame,
    pauseGame,
    timeLeft,
    displayedScore,
  };
};

export default useCanvas;
