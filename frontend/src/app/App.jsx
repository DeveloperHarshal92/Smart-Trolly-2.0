import React from "react";
import { RouterProvider } from "react-router-dom";
import { routes } from "./app.routes";
import { ThemeProvider } from "../features/common/context/ThemeContext";

const App = () => {
  return (
    <ThemeProvider>
      <RouterProvider router={routes} />
    </ThemeProvider>
  );
};

export default App;
