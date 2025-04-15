import { useEffect, useRef } from "react";
import {
  ArrayVisual,
  BinaryTreeNodeData,
  BinaryTreeVisual,
  Canvas,
  LinkedListVisual,
  MTreeNodeData,
  MTreeVisual,
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

    const arrayBlock = canvas.addBlock({
      id: "array-var",
      title: "数组测试",
      x: 20,
      y: 20,
      width: 200,
      height: 50,
      paddingY: 15,
    });

    const arrayVis = new ArrayVisual({
      block: arrayBlock,
      initialData: [10, 20, 30, 40],
      // 可以添加其他配置项，如 nodeShape: 'circle'
    });

    const linkBlock = canvas.addBlock({
      id: "link",
      title: "链表",
      x: 300,
      y: 20,
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
      x: 20,
      y: 120,
      width: 200,
      height: 150,
    });

    const queueVis = new QueueVisual(queueBlock, [1, 2, 3, 4, 5], {});

    const stackBlock = canvas.addBlock({
      id: "stack",
      title: "栈",
      x: 350,
      y: 120,
      width: 200,
      height: 150,
    });

    const stackVis = new StackVisual(stackBlock, [1, 2, 3, 4, 5], {});

    setTimeout(() => {
      // arrayVis.update([10, 20, 30, 40, 50]);
    }, 2000);

    const binaryTreeBlock = canvas.addBlock({
      id: "binary-tree",
      title: "二叉树",
      x: 20,
      y: 260,
      width: 200,
      height: 150,
    });

    const binaryData: BinaryTreeNodeData[] = [
      {
        id: "1",
        value: "1",
        left: "2",
        right: "3",
      },
      { id: "2", value: "22" },
      { id: "3", value: "33", left: "4" },
      { id: "4", value: "44" },
    ];

    const binaryTreeVis = new BinaryTreeVisual({
      rootId: "1",
      block: binaryTreeBlock,
      initialData: binaryData,
    });

    const _4treeBlock = canvas.addBlock({
      id: "4-tree",
      title: "4叉树",
      x: 550,
      y: 120,
      width: 200,
      height: 150,
    });

    const _4treeData: MTreeNodeData[] = [
      {
        id: "1",
        value: "1",
        children: ["2", "3", "4", "5"],
      },
      { id: "2", value: "2" },
      { id: "3", value: "3" },
      { id: "4", value: "4" },
    ];

    const _4treeVis = new MTreeVisual({
      rootId: "1",
      initialData: _4treeData,
      block: _4treeBlock,
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
