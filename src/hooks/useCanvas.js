import { useCallback, useRef, useEffect } from "react";
import { resizeCanvas } from "../utils/resizeCanvas";

const useCanvas = (draw, options = {}) => {
  const canvasRef = useRef(null);

  const onKeyDown = useCallback((evt) => {
    const { key } = evt;
    if (key === "ArrowUp") {
      console.log("up");
    } else if (key === "ArrowDown") {
      console.log("down");
    } else if (key === "ArrowLeft") {
      console.log("left");
    } else if (key === "ArrowRight") {
      console.log("right");
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext(options.context || "2d");
    let frameCount = 0;
    let animationFrameId;
    resizeCanvas(canvas);

    const render = () => {
      frameCount++;
      draw(context, frameCount);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw, options]);

  return { canvasRef, onKeyDown };
};

export default useCanvas;
