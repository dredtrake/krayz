import { useCallback } from "react";
import Canvas from "./components/Canvas";
import "./App.css";

const css = {
  height: "750px",
  width: "750px",
};

const appStyle = {
  margin: "2rem auto",
  border: "1px solid black",
  ...css,
};

const App = () => {
  const draw = useCallback((ctx, frameCount) => {
    ctx.fillStyle = "#CCBBFF";
    ctx.beginPath();
    ctx.arc(300, 500, 120, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "#FF99CC";
    ctx.fillRect(0, 0, 1 * frameCount < 750 ? frameCount * 1 : 750, 750);
    ctx.fill();
    // console.log(frameCount, ctx);
  }, []);

  return (
    <div className="App" style={appStyle}>
      <Canvas draw={draw} style={css} />
    </div>
  );
};

export default App;
