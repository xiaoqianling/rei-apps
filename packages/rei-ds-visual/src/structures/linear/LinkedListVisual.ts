import * as d3 from "d3";
import { Block } from "../../core/block";
import {
  Node,
  NodeOptions,
  Edge,
  EdgeOptions,
  Label,
  LabelOptions,
  Position,
  defineArrowMarker,
} from "../common";
import { Canvas } from "../../core/canvas"; // Need canvas for marker id

// --- Data Structure Definition ---
// 代表输入链表中的单个节点，这里是通过id链接而非递归定义
export interface LinkedListNodeData {
  id: string;
  value: string | number;
  // 下一个结点的id
  next: string | null;
}

export interface LinkedListVisualOptions {
  block: Block;
  initialData: LinkedListNodeData[];
  // 结点形状 默认rect
  nodeShape?: "rect" | "circle";
  nodeWidth?: number;
  nodeHeight?: number;
  nodeRadius?: number;
  nodeFill?: string;
  nodeStroke?: string;
  edgeStroke?: string;
  edgeStrokeWidth?: number;
  showLabels?: boolean; // Show 'next', 'null' labels near pointers
  orientation?: "horizontal" | "vertical";
  // 结点间距
  spacing?: number;
  animationDuration?: number;
}

// Internal representation combining data and visual components
type InternalLinkedNode = {
  data: LinkedListNodeData;
  targetPosition: Position;
  nodeInstance: Node;
  edgeInstance?: Edge;
  nextLabelInstance?: Label; // Label for 'next' or 'null'
};

const defaultListOptions: Required<
  Omit<
    LinkedListVisualOptions,
    "block" | "initialData" | "nodeWidth" | "nodeHeight" | "nodeRadius"
  >
> = {
  nodeShape: "rect",
  nodeFill: "#fff",
  nodeStroke: "#000",
  edgeStroke: "#666",
  edgeStrokeWidth: 2,
  showLabels: true,
  orientation: "horizontal",
  spacing: 80, // Need more space for edges
  animationDuration: 300,
};

export class LinkedListVisual {
  private readonly options: Required<LinkedListVisualOptions>;
  private readonly block: Block;
  private readonly canvas: Canvas; // Get canvas from block
  private readonly contentGroup: d3.Selection<
    SVGGElement,
    unknown,
    null,
    undefined
  >;
  private nodesMap: Map<string, InternalLinkedNode> = new Map();
  private readonly arrowMarkerId: string;

  constructor(options: LinkedListVisualOptions) {
    this.block = options.block;
    this.canvas = options.block.getCanvas(); // Assuming Block has getCanvas()
    this.contentGroup = this.block.getContentGroup();
    this.arrowMarkerId = this.canvas.defaultArrowMarkerId;

    this.options = {
      ...defaultListOptions,
      nodeRadius: 25,
      nodeWidth: 60,
      nodeHeight: 30,
      ...options,
    };

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
      // Use default width/height
    } else {
      this.options.nodeWidth = options.nodeWidth ?? this.options.nodeWidth;
      this.options.nodeHeight = options.nodeHeight ?? this.options.nodeHeight;
    }

    this.update(options.initialData);
  }

  // Basic linear layout
  private calculateLayout(
    data: LinkedListNodeData[],
  ): Map<string, { data: LinkedListNodeData; targetPosition: Position }> {
    const layoutMap = new Map<
      string,
      { data: LinkedListNodeData; targetPosition: Position }
    >();
    const nodeWidth = this.options.nodeWidth;
    const nodeHeight = this.options.nodeHeight;
    const spacing = this.options.spacing;
    const isHorizontal = this.options.orientation === "horizontal";

    // This simple layout assumes data is ordered correctly, more robust layout might be needed
    data.forEach((nodeData, index) => {
      const x = isHorizontal ? index * (nodeWidth + spacing) : 0;
      const y = isHorizontal ? 0 : index * (nodeHeight + spacing);
      layoutMap.set(nodeData.id, {
        data: nodeData,
        targetPosition: { x: x + nodeWidth / 2, y: y + nodeHeight / 2 },
      });
    });
    return layoutMap;
  }

  public update(newData: LinkedListNodeData[]): void {
    const newLayoutMap = this.calculateLayout(newData);
    const duration = this.options.animationDuration;
    const nodeWidth = this.options.nodeWidth;
    const nodeHeight = this.options.nodeHeight;
    const isHorizontal = this.options.orientation === "horizontal";

    const existingIds = new Set(this.nodesMap.keys());
    const newIds = new Set(newLayoutMap.keys());

    // 1. Update existing nodes
    this.nodesMap.forEach((internalNode, id) => {
      const newLayoutData = newLayoutMap.get(id);
      if (newLayoutData) {
        internalNode.data = newLayoutData.data; // Update data reference
        internalNode.targetPosition = newLayoutData.targetPosition;
        internalNode.nodeInstance.moveTo(
          internalNode.targetPosition.x,
          internalNode.targetPosition.y,
          duration,
        );
        internalNode.nodeInstance.setText(String(internalNode.data.value));
        // Edges and labels are updated later
      }
    });

    // 2. Enter new nodes
    newLayoutMap.forEach((layoutData, id) => {
      if (!existingIds.has(id)) {
        const nodeOpts: NodeOptions = {
          id: id,
          parentSelection: this.contentGroup,
          initialPosition: layoutData.targetPosition,
          shape: this.options.nodeShape,
          fill: this.options.nodeFill,
          stroke: this.options.nodeStroke,
          text: String(layoutData.data.value),
        };
        if (this.options.nodeShape === "circle") {
          nodeOpts.radius = this.options.nodeRadius;
        } else {
          nodeOpts.width = this.options.nodeWidth;
          nodeOpts.height = this.options.nodeHeight;
        }
        const newNodeInstance = new Node(nodeOpts);
        newNodeInstance
          .getGroup()
          .style("opacity", 0)
          .transition()
          .duration(duration)
          .style("opacity", 1);

        const internalNode: InternalLinkedNode = {
          data: layoutData.data,
          targetPosition: layoutData.targetPosition,
          nodeInstance: newNodeInstance,
        };
        this.nodesMap.set(id, internalNode);
      }
    });

    // 3. Create/Update Edges and Labels (after all nodes are positioned)
    this.nodesMap.forEach((internalNode, id) => {
      const nextNodeId = internalNode.data.next;
      const nextInternalNode = nextNodeId
        ? this.nodesMap.get(nextNodeId)
        : null;

      // --- Edge ---
      if (nextInternalNode) {
        if (internalNode.edgeInstance) {
          // Update existing edge
          internalNode.edgeInstance.updatePosition(duration);
        } else {
          // Create new edge
          const edgeOpts: EdgeOptions = {
            id: `edge-${id}-to-${nextNodeId}`,
            parentSelection: this.contentGroup, // Add edges to the same group
            sourceNode: internalNode.nodeInstance,
            targetNode: nextInternalNode.nodeInstance,
            stroke: this.options.edgeStroke,
            strokeWidth: this.options.edgeStrokeWidth,
            directed: true,
            markerEndId: this.arrowMarkerId,
          };
          internalNode.edgeInstance = new Edge(edgeOpts);
          internalNode.edgeInstance.getElement().lower(); // Draw edges below nodes
          internalNode.edgeInstance
            .getElement()
            .style("opacity", 0)
            .transition()
            .duration(duration)
            .style("opacity", 1);
        }
      } else {
        // Remove edge if next becomes null
        if (internalNode.edgeInstance) {
          internalNode.edgeInstance
            .getElement()
            .transition()
            .duration(duration)
            .style("opacity", 0)
            .remove();
          setTimeout(() => internalNode.edgeInstance?.destroy(), duration);
          internalNode.edgeInstance = undefined;
        }
      }

      // --- Label ---
      if (this.options.showLabels) {
        // Position label near the start of the (potential) edge
        const labelOffsetX = isHorizontal ? nodeWidth / 2 + 10 : 15;
        const labelOffsetY = isHorizontal ? -10 : nodeHeight / 2 + 10;
        const labelPos: Position = {
          x: internalNode.targetPosition.x + labelOffsetX,
          y: internalNode.targetPosition.y + labelOffsetY,
        };
        const labelText = nextInternalNode ? "next" : "null";

        if (internalNode.nextLabelInstance) {
          internalNode.nextLabelInstance.moveTo(
            labelPos.x,
            labelPos.y,
            duration,
          );
          internalNode.nextLabelInstance.setText(labelText);
        } else {
          const labelOpts: LabelOptions = {
            id: `label-${id}-next`,
            parentSelection: this.contentGroup,
            initialPosition: labelPos,
            text: labelText,
            fontSize: 9,
            fill: "#888",
            textAnchor: isHorizontal ? "start" : "middle",
            dominantBaseline: isHorizontal ? "middle" : "hanging",
          };
          internalNode.nextLabelInstance = new Label(labelOpts);
          internalNode.nextLabelInstance
            .getElement()
            .style("opacity", 0)
            .transition()
            .duration(duration)
            .style("opacity", 1);
        }
      }
    });

    // 4. Exit old nodes (and their associated edges/labels)
    existingIds.forEach((id) => {
      if (!newIds.has(id)) {
        const oldInternalNode = this.nodesMap.get(id);
        if (oldInternalNode) {
          oldInternalNode.nodeInstance
            .getGroup()
            .transition()
            .duration(duration)
            .style("opacity", 0)
            .remove();
          oldInternalNode.edgeInstance
            ?.getElement()
            .transition()
            .duration(duration)
            .style("opacity", 0)
            .remove();
          oldInternalNode.nextLabelInstance
            ?.getElement()
            .transition()
            .duration(duration)
            .style("opacity", 0)
            .remove();

          setTimeout(() => {
            oldInternalNode.nodeInstance.destroy();
            oldInternalNode.edgeInstance?.destroy();
            oldInternalNode.nextLabelInstance?.destroy();
          }, duration);
          this.nodesMap.delete(id);
        }
      }
    });

    // ** After updates, recalculate block size **
    this.updateBlockSize();
  }

  private updateBlockSize(): void {
    // Use a small delay
    setTimeout(() => {
      try {
        const bbox = (this.contentGroup.node() as SVGGElement)?.getBBox();
        if (bbox && bbox.width > 0 && bbox.height > 0) {
          const contentPadding = 5;
          this.block.updateSize(
            bbox.width + contentPadding * 2,
            bbox.height + contentPadding * 2,
            this.options.animationDuration,
          );
        } else {
          this.block.updateSize(80, 40, this.options.animationDuration); // Min size for list
        }
      } catch (e) {
        console.error("Error calculating bounding box:", e);
        this.block.updateSize(120, 60, this.options.animationDuration);
      }
    }, 50);
  }

  /** 获取指定 ID 的 Node 实例 */
  public getNodeById(id: string): Node | undefined {
    return this.nodesMap.get(id)?.nodeInstance;
  }

  /** 销毁可视化 */
  public destroy(): void {
    this.nodesMap.forEach((internalNode) => {
      internalNode.nodeInstance.destroy();
      internalNode.edgeInstance?.destroy();
      internalNode.nextLabelInstance?.destroy();
    });
    this.nodesMap.clear();
  }
}
