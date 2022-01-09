import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the All App", () => {
  render(<App />);
  const linkElement = screen.getByText(
    /Click on the game zone to get the focus, then use arrow keys to reduce the window size/i
  );
  expect(linkElement).toBeInTheDocument();
});
