import { useEffect, useRef } from "react";
import { createVisualizationCanvas } from 'rei-visual/index';

function DemoPage() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) {
      return;
    }
    const engine = createVisualizationCanvas(container.current);
    setTimeout(() => {
      const scene = engine.getScene();
      if (scene) {
          // Add a block for an array variable
          const arrayBlock = scene.addBlock({
              title: "myArray",
              x: 100, 
              y: 100,
              width: 250,
              height: 200,
              dataStructureType: 'array'
          });

          // Add a block for a tree variable
          const treeBlock = scene.addBlock({
              title: "myTree",
              x: 400,
              y: 150,
              width: 300,
              height: 250,
              dataStructureType: 'tree'
          });

          // arrayBlock and treeBlock are instances of the Block class
          // They should appear on the canvas and be draggable
      } else {
          console.error("Scene not available after engine initialization.");
      }
  }, 100);
    return () => {
      engine && engine.destroy();
    };
  }, []);

  return (
    <div>
      <h1>DemoPage</h1>
      <div 
        style={{ 
            width: "800px", 
            height: "600px", 
            border: "1px solid blue",
            margin: "20px"
        }} 
        ref={container}
      ></div>
    </div>
  );
}

export default DemoPage;
