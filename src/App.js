import React from "react";
import Canvas from "./components/Canvas";

const App = () => (
  <>
    <div className="app">
      <Canvas />
    </div>
    <p>
      Click on the game zone to get the focus, then use arrow keys to reduce the
      window size
    </p>
  </>
);

export default App;
