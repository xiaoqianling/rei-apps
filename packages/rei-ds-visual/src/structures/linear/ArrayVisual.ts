import * as d3 from "d3";
import { Block } from "../../core/block"; // 需要 Block 来获取 contentGroup
import { Node, NodeOptions, Label, LabelOptions, Position } from "../common";

export interface ArrayVisualOptions {
  block: Block; // 关联的 Block 实例
  initialData: any[]; // 初始数组数据
  nodeShape?: "rect" | "circle";
  nodeWidth?: number;
  nodeHeight?: number;
  nodeRadius?: number;
  nodeFill?: string;
  nodeStroke?: string;
  showIndices?: boolean; // 是否显示索引
  orientation?: "horizontal" | "vertical";
  spacing?: number; // 节点间距
  // 动画时间 在组件resize时触发
  animationDuration?: number;
}

type InternalArrayNodeData = {
  id: string; // 使用 index 作为 id
  value: any;
  targetPosition: Position;
  nodeInstance: Node;
  labelInstance?: Label;
};

const defaultArrayOptions: Required<
  Omit<
    ArrayVisualOptions,
    "block" | "initialData" | "nodeWidth" | "nodeHeight" | "nodeRadius"
  >
> = {
  nodeShape: "rect",
  nodeFill: "#fff",
  nodeStroke: "#000",
  showIndices: true,
  orientation: "horizontal",
  spacing: 10,
  animationDuration: 0,
};

export class ArrayVisual {
  private readonly options: Required<ArrayVisualOptions>;
  private readonly block: Block;
  private readonly contentGroup: d3.Selection<
    SVGGElement,
    unknown,
    null,
    undefined
  >;
  private currentData: InternalArrayNodeData[] = [];

  // 标签向上偏移量
  private labelYOffset: number = 0;
  // 标签底部里Node的距离
  private static readonly labelMarginBottom = 1;
  // Node的padding
  private static readonly contentPadding = 5;

  constructor(options: ArrayVisualOptions) {
    this.block = options.block;
    this.contentGroup = this.block.getContentGroup();
    this.options = {
      ...defaultArrayOptions,
      nodeRadius: 30, // Default radius if circle
      nodeWidth: 50, // Default width if rect
      nodeHeight: 30, // Default height if rect
      ...options,
    };
    this.labelYOffset = -(
      this.options.nodeHeight / 2 +
      ArrayVisual.labelMarginBottom +
      ArrayVisual.contentPadding / 2 +
      // Node边框厚度
      1
    );

    if (
      this.options.nodeShape === "circle" &&
      options.nodeRadius === undefined
    ) {
      this.options.nodeWidth = this.options.nodeHeight =
        this.options.nodeRadius * 2;
    } else if (
      this.options.nodeShape === "rect" &&
      (options.nodeWidth === undefined || options.nodeHeight === undefined)
    ) {
      // Use default width/height if not specified
    } else {
      this.options.nodeWidth = options.nodeWidth ?? this.options.nodeWidth;
      this.options.nodeHeight = options.nodeHeight ?? this.options.nodeHeight;
    }

    this.update(options.initialData);
  }

  // 计算结点 label位置
  private calculateLayout(data: any[]): InternalArrayNodeData[] {
    const nodeWidth = this.options.nodeWidth;
    const nodeHeight = this.options.nodeHeight;
    const spacing = this.options.spacing;
    const isHorizontal = this.options.orientation === "horizontal";

    return data.map((value, index) => {
      const x = isHorizontal ? index * (nodeWidth + spacing) : 0;
      const y = isHorizontal ? 0 : index * (nodeHeight + spacing);
      return {
        id: String(index),
        value: value,
        targetPosition: { x: x + nodeWidth / 2, y: y + nodeHeight / 2 }, // 节点中心位置
        // nodeInstance 和 labelInstance 将在 update 中处理
      } as InternalArrayNodeData; // Cast initially
    });
  }

  public update(newData: any[]): void {
    const layoutData = this.calculateLayout(newData);
    const duration = this.options.animationDuration;

    // 使用 Map 来存储当前数据，以便快速查找
    const existingDataMap = new Map(this.currentData.map((d) => [d.id, d]));
    const newLayoutMap = new Map(layoutData.map((d) => [d.id, d]));

    // 遍历当前数据，更新每个节点的值和位置
    existingDataMap.forEach((existingNodeData, id) => {
      const correspondingNewData = newLayoutMap.get(id);
      if (correspondingNewData) {
        // Update value and position
        existingNodeData.value = correspondingNewData.value;
        existingNodeData.targetPosition = correspondingNewData.targetPosition;
        existingNodeData.nodeInstance.moveTo(
          existingNodeData.targetPosition.x,
          existingNodeData.targetPosition.y,
          duration,
        );
        existingNodeData.nodeInstance.setText(String(existingNodeData.value));
        if (existingNodeData.labelInstance) {
          existingNodeData.labelInstance.moveTo(
            existingNodeData.targetPosition.x,
            existingNodeData.targetPosition.y + this.labelYOffset,
            duration,
          );
        }
      } else {
        // 如果节点不存在，则需要删除
      }
    });

    // 遍历新数据，创建新的节点
    const enteringData: InternalArrayNodeData[] = [];
    layoutData.forEach((newNodeData) => {
      if (!existingDataMap.has(newNodeData.id)) {
        const nodeOpts: NodeOptions = {
          id: newNodeData.id,
          parentSelection: this.contentGroup,
          initialPosition: newNodeData.targetPosition,
          shape: this.options.nodeShape,
          fill: this.options.nodeFill,
          stroke: this.options.nodeStroke,
          text: String(newNodeData.value),
        };
        if (this.options.nodeShape === "circle") {
          nodeOpts.radius = this.options.nodeRadius;
        } else {
          nodeOpts.width = this.options.nodeWidth;
          nodeOpts.height = this.options.nodeHeight;
        }
        newNodeData.nodeInstance = new Node(nodeOpts);
        newNodeData.nodeInstance
          .getGroup()
          .style("opacity", 0)
          .transition()
          .duration(duration)
          .style("opacity", 1);

        if (this.options.showIndices) {
          const labelOpts: LabelOptions = {
            id: `index-${newNodeData.id}`,
            parentSelection: this.contentGroup,
            initialPosition: {
              x: newNodeData.targetPosition.x,
              y: newNodeData.targetPosition.y + this.labelYOffset,
            },
            text: String(newNodeData.id),
            fontSize: 10,
            textAnchor: "middle",
          };
          newNodeData.labelInstance = new Label(labelOpts);
          newNodeData.labelInstance
            .getElement()
            .style("opacity", 0)
            .transition()
            .duration(duration)
            .style("opacity", 1);
        }
        enteringData.push(newNodeData); // Add to entering data list
      }
    });

    // 遍历旧数据，如果旧数据不存在于新数据中，则删除
    existingDataMap.forEach((oldNodeData, id) => {
      if (!newLayoutMap.has(id)) {
        oldNodeData.nodeInstance
          .getGroup()
          .transition()
          .duration(duration)
          .style("opacity", 0)
          .remove();
        oldNodeData.labelInstance
          ?.getElement()
          .transition()
          .duration(duration)
          .style("opacity", 0)
          .remove();
        // Consider delaying destroy until after transition
        setTimeout(() => {
          oldNodeData.nodeInstance.destroy();
          oldNodeData.labelInstance?.destroy();
        }, duration);
      }
    });

    // Update internal data state
    // Combine updated existing nodes and newly entered nodes
    const nextData: InternalArrayNodeData[] = [];
    newLayoutMap.forEach((layoutNode, id) => {
      const existing = existingDataMap.get(id);
      if (existing) {
        // Update the existing data object in place (already done in update step)
        nextData.push(existing);
      } else {
        // Find the corresponding newly created node data
        const entered = enteringData.find((d) => d.id === id);
        if (entered) {
          nextData.push(entered);
        }
      }
    });
    this.currentData = nextData;

    // ** After all updates and transitions are set up, calculate content bounds and update block size **
    this.updateBlockSize();
  }

  private updateBlockSize(): void {
    // Use a small delay to allow transitions to start and elements to be potentially visible
    setTimeout(() => {
      try {
        const bbox = (this.contentGroup.node() as SVGGElement)?.getBBox();
        if (bbox && bbox.width > 0 && bbox.height > 0) {
          // Add a little padding within the content area itself
          this.block.updateSize(
            bbox.width + ArrayVisual.contentPadding * 2,
            //   REI
            this.options.nodeHeight,
            this.options.animationDuration,
          );
        } else {
          // Handle empty case or bbox calculation failure
          this.block.updateSize(50, 30, this.options.animationDuration); // Set to a minimum size
        }
      } catch (e) {
        console.error("Error calculating bounding box:", e);
        // Fallback size
        this.block.updateSize(100, 50, this.options.animationDuration);
      }
    }, 50); // Small delay
  }

  /** 获取指定索引的 Node 实例 */
  public getNodeByIndex(index: number): Node | undefined {
    const nodeData = this.currentData.find((d) => d.id === String(index));
    return nodeData?.nodeInstance;
  }

  /** 销毁可视化 */
  public destroy(): void {
    this.currentData.forEach((d) => {
      d.nodeInstance.destroy();
      d.labelInstance?.destroy();
    });
    this.currentData = [];
    // No need to remove contentGroup, Block handles that
  }
}
