import { useCallback, useRef, useEffect, useState } from "react";
import { resizeCanvas, countSurface } from "../utils/";

const [width, height] = [600, 600];

const initialSurface = width * height;

const dir = {
  u: 0,
  d: 0,
  l: 0,
  r: 0,
};

const ballRadius = 10;
let x = Math.floor(Math.random() * width);
let y = Math.floor(Math.random() * height);
let dx = 2;
let dy = -2;
const useCanvas = (options = {}) => {
  const [pause, setPause] = useState(false);
  const [move, setMove] = useState(dir);
  const [isKeyDown, setIsKeyDown] = useState("");
  // value is in %
  const [surface, setSurface] = useState(100);
  const canvasRef = useRef(null);

  const ball = useCallback(
    (ctx, x, y, radius) => {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = isKeyDown !== "" ? "#9F221099" : "#CFBA3499";
      ctx.fill();
      ctx.closePath();
    },
    [isKeyDown]
  );

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
      if (x + dx > width - ballRadius / 2 - move.r) {
        dx = -dx;
        if (isKeyDown === "l") {
          setPause(true);
        }
      }
      if (x + dx < ballRadius / 2 + move.l) {
        dx = -dx;
        if (isKeyDown === "r") {
          setPause(true);
        }
      }
      if (y + dy < ballRadius / 2 + move.u) {
        dy = -dy;
        if (isKeyDown === "d") {
          setPause(true);
        }
      }
      if (y + dy > height - ballRadius / 2 - move.d) {
        dy = -dy;
        if (isKeyDown === "u") {
          setPause(true);
        }
      }

      x += dx;
      y += dy;
    },
    [move, ball, isKeyDown]
  );

  const onKeyDown = useCallback(
    (evt) => {
      const { key } = evt;
      if (pause) {
        return false;
      }
      if (key === "ArrowUp") {
        setMove((prevState) => ({ ...prevState, d: prevState.d + 1 }));
        setIsKeyDown("u");
      } else if (key === "ArrowDown") {
        setMove((prevState) => ({ ...prevState, u: prevState.u + 1 }));
        setIsKeyDown("d");
      } else if (key === "ArrowLeft") {
        setMove((prevState) => ({ ...prevState, r: prevState.r + 1 }));
        setIsKeyDown("l");
      } else if (key === "ArrowRight") {
        setMove((prevState) => ({ ...prevState, l: prevState.l + 1 }));
        setIsKeyDown("r");
      }
      setSurface(() =>
        Math.floor((countSurface(width, height, move) * 100) / initialSurface)
      );
    },
    [move, pause]
  );

  const onKeyUp = useCallback((evt) => {
    const { key } = evt;
    setIsKeyDown("");
    if (
      key === "ArrowUp" ||
      key === "ArrowDown" ||
      key === "ArrowLeft" ||
      key === "ArrowRight"
    ) {
      setIsKeyDown("");
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext(options.context || "2d");
    let animationFrameId;

    resizeCanvas(canvas);

    const render = () => {
      if (!pause) {
        draw(context);
        animationFrameId = window.requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw, options, pause]);

  return { canvasRef, surface, onKeyDown, onKeyUp, pause, setPause };
};

export default useCanvas;
