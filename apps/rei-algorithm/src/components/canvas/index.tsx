import { FunctionComponent, useRef } from "react";

interface CanvasProps {}

const Canvas: FunctionComponent<CanvasProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, 100, 100);
  };
  draw();

  return <canvas ref={canvasRef}></canvas>;
};

export default Canvas;
