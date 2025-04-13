import * as PIXI from "pixi.js";
import { Node, NodeOptions } from "../base/Node";
import { Edge, EdgeOptions } from "../base/Edge";

// --- 链表可视化选项接口 ---
export interface LinkedListVisualizationOptions {
  // 数据可以是简单值数组，也可以是包含 next 指针的对象数组 (更灵活)
  // 这里先用简单值数组，假设是单向链表
  data: (string | number)[];
  // 节点之间的水平间距，默认为 60
  nodeSpacing?: number;
  // 是否在末尾显示指向 null 的标记，默认为 true
  showNullPointer?: boolean;
  // null 指针的文本表示，默认为 "null"
  nullPointerText?: string;
  // 应用于所有节点的基础选项
  nodeOptions?: Partial<NodeOptions>;
  // 应用于所有边的基础选项
  edgeOptions?: Partial<EdgeOptions>;
}

// --- 默认选项 ---
const DEFAULT_LINKED_LIST_VIS_OPTIONS: Required<
  Omit<LinkedListVisualizationOptions, "data" | "nodeOptions" | "edgeOptions">
> = {
  nodeSpacing: 60, // 节点间更大的间距
  showNullPointer: true,
  nullPointerText: "null",
};

/**
 * 可视化（单向）链表结构。
 */
export class LinkedListVisualization extends PIXI.Container {
  private options: Required<
    Omit<LinkedListVisualizationOptions, "nodeOptions" | "edgeOptions">
  > &
    Pick<LinkedListVisualizationOptions, "nodeOptions" | "edgeOptions">;
  private dataNodes: Node[] = []; // 存储节点实例
  private edges: Edge[] = []; // 存储边实例
  private nullPointerTextElement?: PIXI.Text; // 用于显示末尾 null 指针

  constructor(options: LinkedListVisualizationOptions) {
    super();

    // 合并选项
    this.options = {
      ...DEFAULT_LINKED_LIST_VIS_OPTIONS,
      ...options,
      data: options.data,
    };

    // 创建节点和边
    this.createElements();
  }

  /** 根据当前数据创建或更新节点和边 */
  private createElements() {
    // 清理旧元素
    this.removeChildren();
    this.dataNodes = [];
    this.edges = [];
    this.nullPointerTextElement = undefined;

    let currentX = 0;
    const nodeRadius = this.options.nodeOptions?.radius ?? 25;
    const nodeY = nodeRadius; // 所有节点 Y 坐标相同

    let previousNode: Node | null = null;

    // 创建节点
    this.options.data.forEach((value) => {
      const node = new Node({
        ...(this.options.nodeOptions ?? {}),
        value: value,
        x: currentX,
        y: nodeY,
      });
      this.addChild(node);
      this.dataNodes.push(node);

      // 如果不是第一个节点，创建连接到前一个节点的边
      if (previousNode) {
        const edge = new Edge({
          ...(this.options.edgeOptions ?? {}),
          startNode: previousNode,
          endNode: node,
        });
        // 将边添加到容器底部，避免遮挡节点
        this.addChildAt(edge, 0);
        this.edges.push(edge);
      }

      // 更新 currentX 和 previousNode
      currentX += nodeRadius * 2 + this.options.nodeSpacing;
      previousNode = node;
    });

    // 处理链表末尾的 null 指针
    if (this.options.showNullPointer && previousNode) {
      // 1. 创建 null 文本
      const nullTextStyle = {
        fontSize: 14,
        fill: 0xaaaaaa,
        ...(this.options.edgeOptions?.color
          ? { fill: this.options.edgeOptions.color }
          : {}), // 尝试使用边的颜色
      };
      this.nullPointerTextElement = new PIXI.Text({
        text: this.options.nullPointerText,
        style: nullTextStyle,
      });
      this.nullPointerTextElement.anchor.set(0.3, 0.5); // 左侧垂直居中对齐
      this.nullPointerTextElement.x = currentX; // 放在最后一个节点之后
      this.nullPointerTextElement.y = nodeY;
      this.nullPointerTextElement.resolution = 5;
      this.addChild(this.nullPointerTextElement);

      // 2. 创建从最后一个节点指向 null 文本的边
      const endEdge = new Edge({
        ...(this.options.edgeOptions ?? {}),
        startNode: previousNode,
        // 终点直接使用坐标，指向文本的左侧
        endX:
          this.nullPointerTextElement.x -
          (this.options.edgeOptions?.arrowheadSize ?? 8), // 留出箭头空间
        endY: nodeY,
      });
      this.addChildAt(endEdge, 0);
      this.edges.push(endEdge);
    }

    this.emit("layoutUpdated");
  }

  /** 更新链表数据并重绘 */
  updateData(newData: (string | number)[]) {
    this.options.data = newData;
    this.createElements();
  }

  // --- 其他方法 (类似 ArrayVisualization) ---
  getNodeAtIndex(index: number): Node | undefined {
    return this.dataNodes[index];
  }
  getEdgeAtIndex(index: number): Edge | undefined {
    return this.edges[index];
  } // index 指的是边的索引
  // highlightNode, unhighlightNode, highlightEdge, unhighlightEdge ...
}
