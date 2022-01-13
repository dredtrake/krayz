import React from "react";
import useCanvas from "../hooks/useCanvas";

const Canvas = (props) => {
  const { draw, options, ...rest } = props;
  const { canvasRef, surface, onKeyDown, onKeyUp, pause, setPause } = useCanvas(
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
      <p className="surface">{surface}%</p>
      <div className="pause" onClick={() => setPause(!pause)}>
        Pause
      </div>
    </>
  );
};

export default Canvas;
