import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import styles from "./index.module.scss";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(Draggable);

interface TreeNodeComponentProps {
  value: number;
  x: number;
  y: number;
  onDrag?: (x: number, y: number) => void;
  onClick?: () => void;
}

const Node: React.FC<TreeNodeComponentProps> = ({
  value,
  x,
  y,
  onDrag,
  onClick,
}) => {
  const nodeRef = useRef<SVGGElement>(null);

  // 初始化动画和拖动
  useGSAP(() => {
    if (!nodeRef.current) return;

    // 设置初始位置
    gsap.set(nodeRef.current, {
      x: x,
      y: y,
      scale: 1,
      opacity: 1,
      cursor: "pointer",
    });

    // 节点入场动画
    gsap.from(nodeRef.current, {
      opacity: 0,
      scale: 0.1,
      duration: 0.5,
      ease: "back.out(1.7)",
    });

    // 初始化拖动
    Draggable.create(nodeRef.current, {
      type: "x,y",
      onDrag: function () {
        onDrag?.(this.x, this.y);
      },
      onDragStart: function () {
        gsap.to(nodeRef.current, {
          fill: "#777777",
          scale: 1.2,
          duration: 0.1,
          ease: "power1.out",
        });
      },
      onDragEnd: function () {
        gsap.to(nodeRef.current, {
          fill: "#61dafb",
          scale: 1,
          duration: 0.1,
        });
      },
    });

    // 点击事件
    const node = nodeRef.current;
    const handleClick = () => onClick?.();
    node.addEventListener("click", handleClick);

    return () => {
      node.removeEventListener("click", handleClick);
    };
  }, [onDrag, onClick, x, y]);

  return (
    <g
      ref={nodeRef}
      fill="#61dafb"
      className={`${styles["tree-node"]} tree-node`}
    >
      <circle r={20} className="tree-node" />
      <text textAnchor="middle" dy=".3em" fill="white">
        {value}
      </text>
    </g>
  );
};

export default Node;
