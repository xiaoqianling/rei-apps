import { css } from "@emotion/css";
import styles from "./index.module.scss";
import { FunctionComponent, useRef, useState } from "react";
import classNames from "classnames";
import React from "react";

interface FreeMoveContainerProps {
  children: React.ReactNode;
  // @default 1
  zIndex?: number;
  width: number;
  height: number;
}

const FreeMoveContainer: FunctionComponent<FreeMoveContainerProps> = ({
  children,
  zIndex,
  width,
  height,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 30, y: 10 });
  // 记录鼠标相对容器左上角的位置
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // 鼠标点下，e为鼠标点坐标，计算得到偏移
  const handleMouseDown = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    console.log("handleMouseMove");
    if (isDragging && containerRef.current) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const containerClassname = css`
    ${zIndex !== 1 && `z-index: ${zIndex};`}
    left: ${position.x}px;
    top: ${position.y}px;
  `;

  return (
    <div
      ref={containerRef}
      className={classNames([styles.container, containerClassname])}
    >
      <header className={styles.header} onMouseDown={handleMouseDown}>
        ---------
      </header>
      <div className={styles.main}>{children}</div>
    </div>
  );
};

export default FreeMoveContainer;
