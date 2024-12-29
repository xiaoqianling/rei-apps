import React from "react";
import ReactDOM from "react-dom/client";
import { ReiButton } from "rei-design/button";
import ReiProvider from "./provide";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ReiProvider>
      <div>Rei</div>
    </ReiProvider>
  </React.StrictMode>,
);
