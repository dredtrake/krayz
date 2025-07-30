import React from 'react';

const GameUI = ({ gameState, surface, pauseGame, startGame, timeLeft, displayedScore }) => {
  return (
    <>
      {/* Game Stats Box */}
      {(gameState === 'playing' || gameState === 'paused') && (
        <div className="game-stats-box">
          <div className="game-stats-title">GAME STATS</div>
          <div className="game-stats-content">
            <div className="stat-row">
              <span className="stat-label">Coverage:</span>
              <span className="stat-value coverage">{surface}%</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Time:</span>
              <span className={`stat-value timer ${timeLeft <= 10 ? 'timer-low' : ''}`}>
                {timeLeft}s
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label score-label">Score:</span>
              <span className="stat-value score">{Math.round(displayedScore)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Pause/Resume Button */}
      {gameState === 'playing' && (
        <div className="pause" onClick={pauseGame}>
          Pause
        </div>
      )}

      {gameState === 'paused' && (
        <div className="pause" onClick={pauseGame}>
          Resume
        </div>
      )}

      {/* Start/Restart Button */}
      {(gameState === 'start' || gameState === 'gameOver') && (
        <div
          className="game-button"
          onClick={startGame}
          style={{
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
            zIndex: 1000,
          }}
        >
          {gameState === 'start' ? 'START' : 'RESTART'}
        </div>
      )}
    </>
  );
};

export default GameUI;
