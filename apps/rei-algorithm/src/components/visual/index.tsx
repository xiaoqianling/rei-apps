import React, { ReactNode, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import styles from "./index.module.scss";
import Node from "./node";

gsap.registerPlugin(Draggable);

export interface TreeNode {
  value: number;
  left?: TreeNode;
  right?: TreeNode;
}

export const tree: TreeNode = {
  value: 1,
  left: {
    value: 2,
    left: {
      value: 4,
    },
    right: {
      value: 5,
    },
  },
  right: {
    value: 3,
    left: {
      value: 6,
      left: {
        value: 8,
      },
    },
    right: {
      value: 7,
    },
  },
};

interface TreeVisualizerProps {
  tree: TreeNode;
  width?: number;
  height?: number;
}

const TreeVisualizer: React.FC<TreeVisualizerProps> = ({
  tree,
  width = 800,
  height = 600,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<SVGGElement>(null);
  const nodesRef = useRef<SVGGElement[]>([]);
  const linesRef = useRef<SVGLineElement[]>([]);
  const positionsRef = useRef<{ [key: number]: { x: number; y: number } }>({});

  // 设置gasp动画
  useGSAP(
    () => {
      // 初始化缩放
      let currentScale = 1;

      //   初始化拖动
      Draggable.create(zoomRef.current, {
        type: "x,y",
        edgeResistance: 0.65,
        bounds: svgRef.current,
        inertia: true,
        // 添加点击区域限制
        allowEventDefault: true,
        allowNativeTouchScrolling: false,
        // 阻止在节点和连线上触发拖动
        allowContextMenu: true,
        trigger: svgRef.current,
        // BUG: 拖动节点时还是有小的偏移
        onDrag: function (e) {
          // 如果点击的是节点或连线，阻止拖动
          const target = e.target as HTMLElement;
          if (
            target.classList.contains("tree-node") ||
            target.classList.contains("tree-link")
          ) {
            this.disable();
            setTimeout(() => this.enable(), 0);
          }
        },
      });

      // 节点动画
      nodesRef.current.forEach((node, i) => {
        gsap.from(node, {
          opacity: 0,
          scale: 0,
          duration: 0.5,
          delay: i * 0.1,
          ease: "back.out(1.7)",
        });
      });

      // 鼠标滚轮缩放
      svgRef.current?.addEventListener("wheel", (e) => {
        e.preventDefault();
        const delta = (e.deltaY / 5) * -0.01;
        const newScale = Math.max(0.1, Math.min(5, currentScale + delta));
        currentScale = newScale;
        console.log(delta);
        gsap.to(zoomRef.current, {
          scale: newScale,
        });
      });
    },
    { scope: svgRef },
  );

  // 计算节点位置 TODO:
  const calculatePositions = (
    node: TreeNode,
    x: number,
    y: number,
    level: number,
  ) => {
    // ... 实现位置计算逻辑 ...
    // 定义水平和垂直间距
    const horizontalSpacing = 120;
    const verticalSpacing = 80;

    // 计算子节点的x偏移量
    const offset = (Math.pow(2, level) * horizontalSpacing) / 2;

    return {
      left: {
        x: x - offset,
        y: y + verticalSpacing,
      },
      right: {
        x: x + offset,
        y: y + verticalSpacing,
      },
    };
  };

  const renderNode = (node: TreeNode, x: number, y: number, index: number) => {
    return (
      <Node
        key={`node-${node.value}`}
        value={node.value}
        x={x}
        y={y}
        onDrag={(newX, newY) => {
          // 更新连线位置
          const nodeValue = node.value;
          const nodePos = positionsRef.current[nodeValue];
          if (nodePos) {
            // 更新父节点到当前节点的连线
            const parentLine = linesRef.current.find(
              (line) => line.getAttribute("data-to") === nodeValue.toString(),
            );
            if (parentLine) {
              parentLine.setAttribute("x2", newX.toString());
              parentLine.setAttribute("y2", newY.toString());
            }

            // 更新当前节点到子节点的连线
            linesRef.current
              .filter(
                (line) =>
                  line.getAttribute("data-from") === nodeValue.toString(),
              )
              .forEach((line) => {
                line.setAttribute("x1", newX.toString());
                line.setAttribute("y1", newY.toString());
              });
          }
        }}
        onClick={() => {
          console.log("Node clicked:", node.value);
          // 这里可以添加点击节点的处理逻辑
        }}
      />
    );
  };
  // 渲染连接线
  const renderLink = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    from: number,
    to: number,
  ) => {
    return (
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#888"
        strokeWidth={2}
        className="tree-link"
        data-from={from}
        data-to={to}
        ref={(el) => linesRef.current.push(el!)}
      />
    );
  };

  // 递归渲染树
  const renderTree = (
    node: TreeNode,
    x: number,
    y: number,
    level: number,
    index: number,
  ): ReactNode => {
    if (!node) return null;

    const { left, right } = node;
    const positions = calculatePositions(node, x, y, level);

    // 保存节点位置
    positionsRef.current[node.value] = { x, y };

    return (
      <>
        {left && (
          <>
            {renderLink(
              x,
              y,
              positions.left.x,
              positions.left.y,
              node.value,
              left.value,
            )}
            {renderTree(
              left,
              positions.left.x,
              positions.left.y,
              level + 1,
              index + 1,
            )}
          </>
        )}
        {right && (
          <>
            {renderLink(
              x,
              y,
              positions.right.x,
              positions.right.y,
              node.value,
              right.value,
            )}
            {renderTree(
              right,
              positions.right.x,
              positions.right.y,
              level + 1,
              index + 2,
            )}
          </>
        )}
        {renderNode(node, x, y, index)}
      </>
    );
  };

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ border: "1px solid #ddd", overflow: "hidden" }}
    >
      <g ref={zoomRef}>{renderTree(tree, width / 2, 50, 0, 0)}</g>
    </svg>
  );
};

export default TreeVisualizer;
