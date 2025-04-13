import * as PIXI from "pixi.js";
import { Node } from "./Node"; // 假设 Node 在同一目录或可访问

// --- 边选项接口 ---
export interface EdgeOptions {
  startNode?: Node; // 起始节点 (可选, 也可以直接用坐标)
  endNode?: Node; // 结束节点 (可选)
  startX?: number; // 起始 X (如果不用 startNode)
  startY?: number; // 起始 Y
  endX?: number; // 结束 X (如果不用 endNode)
  endY?: number; // 结束 Y
  color?: number; // 线的颜色
  thickness?: number; // 线的粗细
  arrowhead?: boolean; // 是否带箭头
  arrowheadSize?: number; // 箭头大小
}

// --- 默认边选项 ---
const DEFAULT_EDGE_OPTIONS: Required<
  Omit<
    EdgeOptions,
    "startNode" | "endNode" | "startX" | "startY" | "endX" | "endY"
  >
> = {
  color: 0xffffff, // 白色
  thickness: 2,
  arrowhead: true,
  arrowheadSize: 8,
};

/**
 * 代表连接两个节点或点的可视化边。
 */
export class Edge extends PIXI.Graphics {
  private options: EdgeOptions; // 存储合并后的选项
  private currentStartX: number = 0; // 初始化为 0
  private currentStartY: number = 0; // 初始化为 0
  private currentEndX: number = 0; // 初始化为 0
  private currentEndY: number = 0; // 初始化为 0

  constructor(options: EdgeOptions) {
    super();

    // 合并选项
    this.options = {
      ...DEFAULT_EDGE_OPTIONS,
      ...options,
    };

    // 初始化起点和终点坐标
    this.updateEndPoints();

    // 初始绘制
    this.redraw();
  }

  /**
   * 根据 options 中的节点或坐标更新内部的起点/终点坐标。
   */
  private updateEndPoints() {
    // 优先使用节点位置，并考虑节点的半径，使线从节点边缘开始/结束
    const startRadiusOffset = this.options.startNode
      ? this.options.startNode.getRadius()
      : 0; // 使用 getRadius()
    const endRadiusOffset = this.options.endNode
      ? this.options.endNode.getRadius()
      : 0; // 使用 getRadius()

    const rawStartX = this.options.startNode
      ? this.options.startNode.x
      : (this.options.startX ?? 0);
    const rawStartY = this.options.startNode
      ? this.options.startNode.y
      : (this.options.startY ?? 0);
    const rawEndX = this.options.endNode
      ? this.options.endNode.x
      : (this.options.endX ?? 0);
    const rawEndY = this.options.endNode
      ? this.options.endNode.y
      : (this.options.endY ?? 0);

    // 计算方向向量
    const dx = rawEndX - rawStartX;
    const dy = rawEndY - rawStartY;
    const len = Math.sqrt(dx * dx + dy * dy);

    if (len === 0) {
      // 防止除以零
      this.currentStartX = rawStartX;
      this.currentStartY = rawStartY;
      this.currentEndX = rawEndX;
      this.currentEndY = rawEndY;
      return;
    }

    // 标准化方向向量
    const ux = dx / len;
    const uy = dy / len;

    // 计算考虑半径偏移后的起点和终点
    this.currentStartX = rawStartX + ux * startRadiusOffset;
    this.currentStartY = rawStartY + uy * startRadiusOffset;
    this.currentEndX = rawEndX - ux * endRadiusOffset;
    this.currentEndY = rawEndY - uy * endRadiusOffset;
  }

  /** 重绘边（直线和箭头） */
  redraw() {
    this.clear();
    this.updateEndPoints(); // 确保坐标最新

    const x1 = this.currentStartX;
    const y1 = this.currentStartY;
    const x2 = this.currentEndX;
    const y2 = this.currentEndY;

    // --- 绘制直线 ---
    this.moveTo(x1, y1);
    this.lineTo(x2, y2);
    this.stroke({
      width: this.options.thickness,
      color: this.options.color,
    });

    // --- 绘制箭头 (如果需要) ---
    if (this.options.arrowhead && !(x1 === x2 && y1 === y2)) {
      // 仅当线段有长度时绘制箭头
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const size =
        this.options.arrowheadSize ?? DEFAULT_EDGE_OPTIONS.arrowheadSize;

      // 箭头侧翼相对于主线的角度 (例如 +/- 30度)
      const angleOffset = Math.PI / 6;

      // 计算箭头侧翼的两个点
      const arrowX1 = x2 - size * Math.cos(angle - angleOffset);
      const arrowY1 = y2 - size * Math.sin(angle - angleOffset);
      const arrowX2 = x2 - size * Math.cos(angle + angleOffset);
      const arrowY2 = y2 - size * Math.sin(angle + angleOffset);

      // 绘制箭头（填充三角形）
      this.moveTo(x2, y2); // 移动到终点
      this.lineTo(arrowX1, arrowY1);
      this.lineTo(arrowX2, arrowY2);
      this.lineTo(x2, y2); // 回到终点形成闭合三角形
      this.fill(this.options.color); // 用线的颜色填充箭头
      // 注意：如果需要箭头边框，可以用 stroke 代替或结合 fill
    }
  }

  // --- 公共方法 ---

  /** 更新边的选项并重绘 */
  updateOptions(newOptions: Partial<EdgeOptions>) {
    this.options = { ...this.options, ...newOptions };
    this.redraw();
  }

  /** 仅更新起点并重绘 */
  setStart(node: Node): void;
  setStart(x: number, y: number): void;
  setStart(nodeOrX: Node | number, y?: number): void {
    if (nodeOrX instanceof Node) {
      this.options.startNode = nodeOrX;
      delete this.options.startX;
      delete this.options.startY;
    } else {
      delete this.options.startNode;
      this.options.startX = nodeOrX;
      this.options.startY = y ?? this.options.startY ?? 0;
    }
    this.redraw();
  }

  /** 仅更新终点并重绘 */
  setEnd(node: Node): void;
  setEnd(x: number, y: number): void;
  setEnd(nodeOrX: Node | number, y?: number): void {
    if (nodeOrX instanceof Node) {
      this.options.endNode = nodeOrX;
      delete this.options.endX;
      delete this.options.endY;
    } else {
      delete this.options.endNode;
      this.options.endX = nodeOrX;
      this.options.endY = y ?? this.options.endY ?? 0;
    }
    this.redraw();
  }
}
