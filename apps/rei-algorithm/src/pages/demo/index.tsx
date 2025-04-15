import { useEffect, useRef } from "react";
import {
  ArrayVisual,
  Canvas,
  LinkedListVisual,
  QueueVisual,
  StackVisual,
} from "rei-ds-visual/index";
import "rei-ds-visual/core/block/styles.css";

function DemoPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const canvas = new Canvas({
      container: containerRef.current,
    });

    const block1 = canvas.addBlock({
      id: "array-var",
      title: "数组测试",
      x: 50,
      y: 50,
      width: 200,
      height: 50,
      paddingY: 15,
    });

    const arrayVis = new ArrayVisual({
      block: block1,
      initialData: [10, 20, 30, 40],
      // 可以添加其他配置项，如 nodeShape: 'circle'
    });

    const linkBlock = canvas.addBlock({
      id: "link",
      title: "链表",
      x: 300,
      y: 50,
      width: 200,
      height: 150,
    });

    const linkVis = new LinkedListVisual({
      block: linkBlock,
      initialData: [
        {
          id: "1",
          value: 1,
          next: "2",
        },
        {
          id: "2",
          value: 2,
          next: "3",
        },
        {
          id: "3",
          value: "结点3",
          next: null,
        },
      ],
      spacing: 35,
    });

    const queueBlock = canvas.addBlock({
      id: "queue",
      title: "队列",
      x: 500,
      y: 50,
      width: 200,
      height: 150,
    });

    const queueVis = new QueueVisual(queueBlock, [1, 2, 3, 4, 5], {});

    const stackBlock = canvas.addBlock({
      id: "stack",
      title: "栈",
      x: 700,
      y: 50,
      width: 200,
      height: 150,
    });

    const stackVis = new StackVisual(stackBlock, [1, 2, 3, 4, 5], {});

    setTimeout(() => {
      // arrayVis.update([10, 20, 30, 40, 50]);
    }, 2000);

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
