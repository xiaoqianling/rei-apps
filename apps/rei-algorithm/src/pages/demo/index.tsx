import { useEffect, useRef } from "react";
import VisualEngineDemo from "./demo";
import { Canvas } from "rei-ds-visual/index";
import "rei-ds-visual/core/block/styles.css"

function DemoPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const canvas = new Canvas({
      container: containerRef.current,
    });

    const block1 = canvas.addBlock({
      id: 'array-var',
      title: 'myArray',
      x: 50,
      y: 50,
      width: 200,
      height: 150
    });

    return () => {
      canvas?.destroy();
    };
  }, []);

  return (
    <div>
      <h1>DemoPage</h1>
      <div
        ref={containerRef}
        style={{
          width: "800px",
          height: "600px",
          border: "1px solid blue",
          margin: "20px",
        }}
      >
        {/* <VisualEngineDemo /> */}
      </div>
    </div>
  );
}

export default DemoPage;
