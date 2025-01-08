import React from "react";
import ReactDOM from "react-dom/client";
import ReiProvider from "./provider";
import './index.css'

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ReiProvider/>
  </React.StrictMode>,
);
