import Canvas from "./components/Canvas";
import Countdown from "react-countdown";
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
  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      return <p>Time is over dude!</p>;
    } else {
      return (
        <>
          <Canvas style={css} />
          <span>
            {minutes}:{seconds}
          </span>
        </>
      );
    }
  };
  return (
    <>
      <div className="App" style={appStyle}>
        <Countdown
          date={Date.now() + 30000}
          renderer={renderer}
          zeroPadTime="2"
        />
      </div>
      <p style={{ textAlign: "center" }}>
        Click on the game zone to get the focus, then use arrow keys to reduce
        the window size
      </p>
    </>
  );
};

export default App;
