import React from 'react';
import useCanvas from '../hooks/useCanvas';
import GameUI from './GameUI';

const Canvas = props => {
  const { draw, options, ...rest } = props;
  const { canvasRef, surface, onKeyDown, onKeyUp, gameState, startGame, pauseGame } = useCanvas(
    draw,
    options
  );

  return (
    <>
      <canvas onKeyDown={onKeyDown} onKeyUp={onKeyUp} ref={canvasRef} tabIndex="0" {...rest} />

      <GameUI gameState={gameState} surface={surface} pauseGame={pauseGame} startGame={startGame} />
    </>
  );
};

export default Canvas;
