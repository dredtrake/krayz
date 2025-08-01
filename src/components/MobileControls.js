import React, { useRef, useEffect } from 'react';

const MobileControls = ({ onDirectionPress, onDirectionRelease, gameState }) => {
  const intervalRef = useRef(null);

  // Cleanup interval when component unmounts or game state changes
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Clear interval if game state is no longer playing
  useEffect(() => {
    if (gameState !== 'playing' && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [gameState]);

  if (gameState !== 'playing') {
    return null;
  }

  const startContinuousPress = direction => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Initial press
    onDirectionPress(direction);

    // Continue pressing at regular intervals
    intervalRef.current = setInterval(() => {
      onDirectionPress(direction);
    }, 50); // Press every 50ms for smooth wall growth
  };

  const stopContinuousPress = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    onDirectionRelease();
  };

  const handleTouchStart = direction => e => {
    e.preventDefault();
    e.stopPropagation();
    startContinuousPress(direction);
  };

  const handleTouchEnd = e => {
    e.preventDefault();
    e.stopPropagation();
    stopContinuousPress();
  };

  const handleMouseDown = direction => e => {
    e.preventDefault();
    e.stopPropagation();
    startContinuousPress(direction);
  };

  const handleMouseUp = e => {
    e.preventDefault();
    e.stopPropagation();
    stopContinuousPress();
  };

  const handleContextMenu = e => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  return (
    <div className="mobile-controls">
      <div className="controls-container">
        <button
          className="control-button control-up"
          onTouchStart={handleTouchStart('up')}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onMouseDown={handleMouseDown('up')}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onContextMenu={handleContextMenu}
        >
          ▲
        </button>
        <div className="controls-middle">
          <button
            className="control-button control-left"
            onTouchStart={handleTouchStart('left')}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            onMouseDown={handleMouseDown('left')}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onContextMenu={handleContextMenu}
          >
            ◄
          </button>
          <button
            className="control-button control-right"
            onTouchStart={handleTouchStart('right')}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            onMouseDown={handleMouseDown('right')}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onContextMenu={handleContextMenu}
          >
            ►
          </button>
        </div>
        <button
          className="control-button control-down"
          onTouchStart={handleTouchStart('down')}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onMouseDown={handleMouseDown('down')}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onContextMenu={handleContextMenu}
        >
          ▼
        </button>
      </div>
    </div>
  );
};

export default MobileControls;
