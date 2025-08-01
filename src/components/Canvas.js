import React from 'react';
import useCanvas from '../hooks/useCanvas';
import GameUI from './GameUI';
import MobileControls from './MobileControls';
import { isMobile } from '../utils';

const Canvas = props => {
  const { draw, options, ...rest } = props;
  const {
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
  } = useCanvas(draw, options);

  const mobile = isMobile();

  return (
    <>
      <canvas onKeyDown={onKeyDown} onKeyUp={onKeyUp} ref={canvasRef} tabIndex="0" {...rest} />

      <GameUI
        gameState={gameState}
        surface={surface}
        pauseGame={pauseGame}
        startGame={startGame}
        timeLeft={timeLeft}
        displayedScore={displayedScore}
      />

      {mobile && (
        <MobileControls
          onDirectionPress={onDirectionPress}
          onDirectionRelease={onDirectionRelease}
          gameState={gameState}
        />
      )}
    </>
  );
};

export default Canvas;
