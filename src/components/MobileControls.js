import React from 'react';

const MobileControls = ({ onDirectionPress, onDirectionRelease, gameState }) => {
  if (gameState !== 'playing') {
    return null;
  }

  const handleTouchStart = direction => e => {
    e.preventDefault();
    onDirectionPress(direction);
  };

  const handleTouchEnd = e => {
    e.preventDefault();
    onDirectionRelease();
  };

  return (
    <div className="mobile-controls">
      <div className="controls-container">
        <button
          className="control-button control-up"
          onTouchStart={handleTouchStart('up')}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart('up')}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
        >
          ▲
        </button>
        <div className="controls-middle">
          <button
            className="control-button control-left"
            onTouchStart={handleTouchStart('left')}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart('left')}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
          >
            ◄
          </button>
          <button
            className="control-button control-right"
            onTouchStart={handleTouchStart('right')}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart('right')}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
          >
            ►
          </button>
        </div>
        <button
          className="control-button control-down"
          onTouchStart={handleTouchStart('down')}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart('down')}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
        >
          ▼
        </button>
      </div>
    </div>
  );
};

export default MobileControls;
