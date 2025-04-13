import * as PIXI from "pixi.js";
import { Node, NodeOptions } from "../base/Node";

// --- 数组可视化选项接口 ---
export interface ArrayVisualizationOptions {
  data: (string | number)[]; // 数组数据
  nodeSpacing?: number; // 节点之间的间距
  direction?: "horizontal" | "vertical"; // 排列方向
  nodeOptions?: Partial<NodeOptions>; // 应用于所有节点的基础选项
}

// --- 默认选项 ---
const DEFAULT_ARRAY_VIS_OPTIONS: Required<
  Omit<ArrayVisualizationOptions, "data" | "nodeOptions">
> = {
  nodeSpacing: 10, // 节点间距
  direction: "horizontal",
};

/**
 * 可视化数组结构。
 */
export class ArrayVisualization extends PIXI.Container {
  private options: Required<Omit<ArrayVisualizationOptions, "nodeOptions">> &
    Pick<ArrayVisualizationOptions, "nodeOptions">;
  private dataNodes: Node[] = []; // 存储当前显示的 Node 实例

  constructor(options: ArrayVisualizationOptions) {
    super();

    // 合并选项
    this.options = {
      ...DEFAULT_ARRAY_VIS_OPTIONS,
      ...options,
      data: options.data, // 必须提供 data
    };

    // 根据初始数据创建节点
    this.createNodes();
  }

  /** 根据当前数据创建或更新节点 */
  private createNodes() {
    // 清理旧节点 (简单起见，先全部移除重建)
    // TODO: 更优化的更新，复用或动画更新节点
    this.removeChildren();
    this.dataNodes = [];

    let currentX = 0;
    let currentY = 0;
    const nodeRadius = this.options.nodeOptions?.radius ?? 25; // 需要知道半径来计算间距
    const nodeDiameter = nodeRadius * 2;
    const spacing = this.options.nodeSpacing;

    this.options.data.forEach((value, index) => {
      const node = new Node({
        ...(this.options.nodeOptions ?? {}), // 应用基础节点选项
        value: value,
        x: currentX,
        y: currentY,
      });

      this.addChild(node);
      this.dataNodes.push(node);

      // 更新下一个节点的位置
      if (this.options.direction === "horizontal") {
        currentX += nodeDiameter + spacing;
      } else {
        currentY += nodeDiameter + spacing;
      }
    });

    // 可选：触发一个事件表明布局已完成/更新
    this.emit("layoutUpdated");
  }

  /** 更新数组数据并重绘 */
  updateData(newData: (string | number)[]) {
    this.options.data = newData;
    // 简单实现：重新创建所有节点
    this.createNodes();
  }

  // --- 可能需要的其他方法 ---

  /** 获取指定索引的节点 */
  getNodeAtIndex(index: number): Node | undefined {
    return this.dataNodes[index];
  }

  /** 高亮指定索引的节点 (示例) */
  highlightNode(index: number, highlightStyle?: Partial<NodeOptions>) {
    const node = this.getNodeAtIndex(index);
    if (node) {
      const defaultHighlight: Partial<NodeOptions> = {
        borderColor: 0xff0000,
        borderWidth: 3,
      }; // 红色高亮
      node.updateStyle({ ...defaultHighlight, ...(highlightStyle ?? {}) });
    }
  }

  /** 取消高亮指定索引的节点 (恢复默认样式) */
  unhighlightNode(index: number) {
    const node = this.getNodeAtIndex(index);
    if (node) {
      // 需要一种方式恢复到非高亮状态的样式
      // 这比较复杂，可能需要 Node 存储原始样式或 Block/Vis 管理状态
      // 简单处理：应用基础样式
      const baseStyle: Partial<NodeOptions> = {
        borderColor: this.options.nodeOptions?.borderColor,
        borderWidth: this.options.nodeOptions?.borderWidth,
      };
      node.updateStyle(baseStyle);
      // TODO: 更健壮的状态恢复
    }
  }
}
