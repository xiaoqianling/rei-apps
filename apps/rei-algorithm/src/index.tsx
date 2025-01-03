import React from "react";
import ReactDOM from "react-dom/client";

function App() {
    return <div>
        可视化算法平台
    </div>;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);