import React from "react";
import useCanvas from "../hooks/useCanvas";

const Canvas = (props) => {
  const { draw, options, ...rest } = props;
  const { canvasRef, surface, onKeyDown, onKeyUp, gameState, startGame, pauseGame } = useCanvas(
    draw,
    options
  );
  
  
  
  return (
    <>
      <canvas
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        ref={canvasRef}
        tabIndex="0"
        {...rest}
      />
      
      {gameState === 'playing' && (
        <>
          <p className="surface">Covered: {surface}%</p>
          <div className="pause" onClick={pauseGame}>
            Pause
          </div>
        </>
      )}
      
      {gameState === 'paused' && (
        <>
          <p className="surface">Covered: {surface}% (PAUSED)</p>
          <div className="pause" onClick={pauseGame}>
            Resume
          </div>
        </>
      )}
      
      {(gameState === 'start' || gameState === 'gameOver') && (
        <div className="game-button" onClick={startGame} style={{
          position: 'absolute',
          bottom: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: gameState === 'start' ? '#FFD700' : '#FF4444',
          color: gameState === 'start' ? '#000' : '#FFF',
          padding: '15px 30px',
          fontSize: '24px',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          zIndex: 1000
        }}>
          {gameState === 'start' ? 'START' : 'RESTART'}
        </div>
      )}
      
    </>
  );
};

export default Canvas;
