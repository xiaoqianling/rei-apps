import React from "react";
import ReactDOM from "react-dom/client";
import { ReiButton } from "rei-design/button";
import ReiProvider from "./provider";
import './index.css'

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ReiProvider>
    </ReiProvider>
  </React.StrictMode>,
);
