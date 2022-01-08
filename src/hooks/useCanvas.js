import { useCallback, useRef, useEffect, useState } from "react";
import { resizeCanvas } from "../utils/resizeCanvas";

const [width, height] = [750, 750];

const ball = (ctx, x, y, radius) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#CCBBFF99";
  ctx.fill();
  ctx.closePath();
};

const dir = {
  u: 0,
  d: 0,
  l: 0,
  r: 0,
};

let x = width / 2;
let y = height - 30;
let dx = 2;
let dy = -2;
const ballRadius = 30;
const useCanvas = (options = {}) => {
  const [move, setMove] = useState(dir);

  const canvasRef = useRef(null);

  const draw = useCallback(
    (ctx) => {
      ctx.clearRect(0, 0, width, height);
      ball(ctx, x, y, ballRadius);
      ctx.beginPath();
      ctx.fillStyle = "#FF99CC99"; // left
      ctx.fillRect(0, 0, move.l < width ? move.l : width, height);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = "#33FFCC99"; // right
      ctx.fillRect(
        width - move.r,
        0,
        move.r < width - move.l ? move.r : width,
        height
      );
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = "#CCFF9999"; // top
      ctx.fillRect(0, 0, width, move.u < height ? move.u : height);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = "#CC229999"; // bottom
      ctx.fillRect(
        0,
        height - move.d,
        width,
        move.d < height ? move.d : height
      );
      ctx.fill();
      if (
        x + dx > width - ballRadius - move.r ||
        x + dx < ballRadius + move.l
      ) {
        dx = -dx;
      }
      if (
        y + dy > height - ballRadius - move.d ||
        y + dy < ballRadius + move.u
      ) {
        dy = -dy;
      }

      x += dx;
      y += dy;
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
    let animationFrameId;

    resizeCanvas(canvas);

    const render = () => {
      draw(context);
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
