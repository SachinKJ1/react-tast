import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { UiContext } from "./contexts/UiContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UiContext>
        <App />
      </UiContext>
    </BrowserRouter>
  </React.StrictMode>
);
