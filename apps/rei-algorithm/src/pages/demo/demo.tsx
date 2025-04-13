import { useRef, useEffect } from "react";
import {
  createVisualizationCanvas,
  Scene,
  LinkedListVisualization,
} from "rei-visual/index";
import { ArrayVisualization } from "rei-visual/structures/visualizations/ArrayVisualization";

function VisualEngineDemo() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) {
      return;
    }
    const engine = createVisualizationCanvas(container.current);
    setTimeout(() => {
      const scene: Scene | null = engine.getScene();
      if (scene) {
        // Add a block for an array variable
        const arrayBlock = scene.addBlock({
          title: "myArray",
          x: 100,
          y: 100,
          width: 250,
          height: 200,
          dataStructureType: "array",
        });
        const arrayVis = new ArrayVisualization({
          data: [10, 20, 5, 15, 30],
          nodeOptions: { radius: 20, backgroundColor: 0x4682b4 }, // Steel Blue
        });

        // 将数组可视化内容设置到块中
        arrayBlock.setContent(arrayVis);

        const treeBlock = scene.addBlock({
          title: "链表",
          x: 400,
          y: 150,
          width: 300,
          height: 250,
          dataStructureType: "tree",
        });

        const listVis = new LinkedListVisualization({
          nodeSpacing: 30,
          data: [5, 13, 8, 2],
          nodeOptions: { radius: 20, backgroundColor: 0x5f9ea0 }, // Cadet Blue
          edgeOptions: { color: 0xaaaaaa, thickness: 1 },
        });

        // 将链表可视化内容设置到块中
        treeBlock.setContent(listVis);

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
    <div
      style={{
        width: "100%",
        height: "100%",
        border: "1px solid blue",
      }}
      ref={container}
    ></div>
  );
}

export default VisualEngineDemo;
