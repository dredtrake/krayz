import React from "react";
import Canvas from "./components/Canvas";
import Countdown from "react-countdown";

const App = () => {
  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      return <p>Time is over dude!</p>;
    } else {
      return (
        <>
          <Canvas />
          <p>
            {minutes}:{seconds}
          </p>
        </>
      );
    }
  };
  return (
    <>
      <div className="app">
        <Countdown
          date={Date.now() + 30000}
          renderer={renderer}
          zeroPadTime={2}
        />
      </div>
      <p>
        Click on the game zone to get the focus, then use arrow keys to reduce
        the window size
      </p>
    </>
  );
};

export default App;
