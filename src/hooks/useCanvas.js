import { useCallback, useRef, useEffect, useState } from "react";
import { resizeCanvas } from "../utils/resizeCanvas";

const [width, height] = [750, 750];
const useCanvas = (options = {}) => {
  const dir = {
    u: 0,
    d: 0,
    l: 0,
    r: 0,
  };

  const [move, setMove] = useState((p) => {
    console.log(p);
    return {
      ...dir,
      ...(p && { [p]: dir[p] + 1 }),
    };
  });

  const canvasRef = useRef(null);

  const draw = useCallback(
    (ctx, frameCount) => {
      ctx.fillStyle = "#CCBBFF";
      ctx.beginPath();
      ctx.arc(300, 500, 120, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = "#FF99CC"; // left
      ctx.fillRect(0, 0, move.l < width ? move.l : width, height);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = "#33FFCC"; // right
      ctx.fillRect(
        width - move.r,
        0,
        move.r < width - move.l ? move.r : width,
        height
      );
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = "#CCFF99"; // top
      ctx.fillRect(0, 0, width, move.u < height ? move.u : height);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = "#CC2299"; // bottom
      ctx.fillRect(
        0,
        height - move.d,
        width,
        move.d < height ? move.d : height
      );
      ctx.fill();
    },
    [move]
  );

  const onKeyDown = useCallback((evt) => {
    const { key } = evt;
    if (key === "ArrowUp") {
      setMove((prevState) => ({ ...prevState, d: prevState.d + 1 }));
    } else if (key === "ArrowDown") {
      setMove((prevState) => ({ ...prevState, u: prevState.u + 1 }));
    } else if (key === "ArrowLeft") {
      setMove((prevState) => ({ ...prevState, r: prevState.r + 1 }));
    } else if (key === "ArrowRight") {
      setMove((prevState) => ({ ...prevState, l: prevState.l + 1 }));
    }
  }, []);

  console.log(move);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext(options.context || "2d");
    let frameCount = 0;
    let animationFrameId;

    resizeCanvas(canvas);

    const render = () => {
      //   console.log("framecount", frameCount);
      frameCount++;
      draw(context, frameCount);
      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      console.log("unmount");
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw, options]);

  return { canvasRef, onKeyDown };
};

export default useCanvas;
