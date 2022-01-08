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

const App = () => (
  <div className="App" style={appStyle}>
    <Canvas style={css} />
  </div>
);

export default App;
