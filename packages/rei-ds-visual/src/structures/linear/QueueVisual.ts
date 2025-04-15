import * as d3 from "d3";
import { Block } from "../../core/block";
import { Node, NodeOptions, Label, LabelOptions, Position } from "../common";
import {
  constructVisualComponentOptions,
  VisualComponentConstructorOptions,
  VisualComponentOptions,
} from "./type";

type InternalQueueNodeData = {
  id: string; // Use index as id for simplicity in layout
  value: any;
  targetPosition: Position;
  nodeInstance: Node;
};

export class QueueVisual {
  private readonly options: VisualComponentOptions;
  private readonly block: Block;
  private readonly contentGroup: d3.Selection<
    SVGGElement,
    unknown,
    null,
    undefined
  >;
  private currentNodesData: InternalQueueNodeData[] = [];
  private frontLabel: Label | null = null;
  private rearLabel: Label | null = null;

  constructor(
    container: Block,
    data: any[],
    options: VisualComponentConstructorOptions,
  ) {
    this.block = container;
    this.contentGroup = this.block.getContentGroup();
    this.options = constructVisualComponentOptions(options);

    // Adjust dimensions based on shape if not fully specified
    if (
      this.options.nodeOptions.shape === "circle" &&
      options.nodeOptions?.shape === undefined
    ) {
      this.options.nodeOptions.width = this.options.nodeOptions.height =
        this.options.nodeOptions.radius * 2;
    } else if (
      this.options.nodeOptions.shape === "rect" &&
      (options.nodeOptions?.width === undefined ||
        options.nodeOptions.height === undefined)
    ) {
      // Use default width/height
    } else {
      this.options.nodeOptions.width =
        options.nodeOptions?.width ?? this.options.nodeOptions.width;
      this.options.nodeOptions.height =
        options.nodeOptions?.height ?? this.options.nodeOptions.height;
    }

    this.update(data);
  }

  // Calculates layout for nodes only
  private calculateNodeLayout(data: any[]): InternalQueueNodeData[] {
    const nodeWidth = this.options.nodeOptions.width;
    const nodeHeight = this.options.nodeOptions.height;
    const spacing = this.options.spacing;

    return data.map((value, index) => {
      const x = index * (nodeWidth + spacing);
      const y = 0; // Align horizontally
      return {
        id: String(index),
        value: value,
        targetPosition: { x: x + nodeWidth / 2, y: y + nodeHeight / 2 }, // Node center
      } as InternalQueueNodeData;
    });
  }

  public update(newData: any[]): void {
    const layoutData = this.calculateNodeLayout(newData);
    const duration = this.options.animationDuration;
    const nodeHeight = this.options.nodeOptions.height;

    const existingDataMap = new Map(
      this.currentNodesData.map((d) => [d.id, d]),
    );
    const newLayoutMap = new Map(layoutData.map((d) => [d.id, d]));

    // --- 1. Update/Enter/Exit Nodes --- (Similar to ArrayVisual)
    const enteringNodes: InternalQueueNodeData[] = [];

    // Update existing
    existingDataMap.forEach((existingNodeData, id) => {
      const correspondingNewData = newLayoutMap.get(id);
      if (correspondingNewData) {
        existingNodeData.value = correspondingNewData.value;
        existingNodeData.targetPosition = correspondingNewData.targetPosition;
        existingNodeData.nodeInstance.moveTo(
          existingNodeData.targetPosition.x,
          existingNodeData.targetPosition.y,
          duration,
        );
        existingNodeData.nodeInstance.setText(String(existingNodeData.value));
      }
    });

    // Enter new
    layoutData.forEach((newNodeData) => {
      if (!existingDataMap.has(newNodeData.id)) {
        const nodeOpts: NodeOptions = {
          id: newNodeData.id,
          parentSelection: this.contentGroup,
          initialPosition: newNodeData.targetPosition,
          shape: this.options.nodeOptions.shape,
          fill: this.options.nodeOptions.fill,
          stroke: this.options.nodeOptions.stroke,
          text: String(newNodeData.value),
        };
        if (this.options.nodeOptions.shape === "circle")
          nodeOpts.radius = this.options.nodeOptions.radius;
        else {
          nodeOpts.width = this.options.nodeOptions.width;
          nodeOpts.height = this.options.nodeOptions.height;
        }

        newNodeData.nodeInstance = new Node(nodeOpts);
        newNodeData.nodeInstance
          .getGroup()
          .style("opacity", 0)
          .transition()
          .duration(duration)
          .style("opacity", 1);
        enteringNodes.push(newNodeData);
      }
    });

    // Exit old
    existingDataMap.forEach((oldNodeData, id) => {
      if (!newLayoutMap.has(id)) {
        oldNodeData.nodeInstance
          .getGroup()
          .transition()
          .duration(duration)
          .style("opacity", 0)
          .remove();
        setTimeout(() => oldNodeData.nodeInstance.destroy(), duration);
      }
    });

    // Update internal node data state
    const nextNodesData: InternalQueueNodeData[] = [];
    newLayoutMap.forEach((layoutNode, id) => {
      const existing = existingDataMap.get(id);
      if (existing) {
        nextNodesData.push(existing);
      } else {
        const entered = enteringNodes.find((d) => d.id === id);
        if (entered) nextNodesData.push(entered);
      }
    });
    this.currentNodesData = nextNodesData;

    // --- 2. Update Front/Rear Labels ---
    const labelYOffset = nodeHeight / 2 + 20; // Below the nodes

    // Front Label
    if (this.currentNodesData.length > 0) {
      const frontNode = this.currentNodesData[0];
      const frontLabelPos: Position = {
        x: frontNode.targetPosition.x,
        y: frontNode.targetPosition.y + labelYOffset,
      };
      if (this.frontLabel) {
        this.frontLabel.moveTo(frontLabelPos.x, frontLabelPos.y, duration);
        this.frontLabel
          .getElement()
          .transition()
          .duration(duration)
          .style("opacity", 1);
      } else {
        const labelOpts: LabelOptions = {
          id: "queue-front-label",
          parentSelection: this.contentGroup,
          initialPosition: frontLabelPos,
          text: "Front",
          fontSize: this.options.labelFontSize,
          fill: this.options.labelFill,
          textAnchor: "middle",
        };
        this.frontLabel = new Label(labelOpts);
        this.frontLabel
          .getElement()
          .style("opacity", 0)
          .transition()
          .duration(duration)
          .style("opacity", 1);
      }
    } else {
      // Hide or destroy front label if queue is empty
      if (this.frontLabel) {
        this.frontLabel
          .getElement()
          .transition()
          .duration(duration)
          .style("opacity", 0);
        // Optionally destroy after fade: setTimeout(() => { this.frontLabel?.destroy(); this.frontLabel = null; }, duration);
      }
    }

    // Rear Label
    if (this.currentNodesData.length > 0) {
      const rearNode = this.currentNodesData[this.currentNodesData.length - 1];
      const rearLabelPos: Position = {
        x: rearNode.targetPosition.x,
        y: rearNode.targetPosition.y + labelYOffset,
      };
      if (this.rearLabel) {
        // Avoid moving if it's the same node as front (queue size 1)
        if (
          this.frontLabel?.getPosition().x !== rearLabelPos.x ||
          this.frontLabel?.getPosition().y !== rearLabelPos.y
        ) {
          this.rearLabel.moveTo(rearLabelPos.x, rearLabelPos.y, duration);
        }
        this.rearLabel
          .getElement()
          .transition()
          .duration(duration)
          .style("opacity", 1);
      } else {
        const labelOpts: LabelOptions = {
          id: "queue-rear-label",
          parentSelection: this.contentGroup,
          initialPosition: rearLabelPos,
          text: "Rear",
          fontSize: this.options.labelFontSize,
          fill: this.options.labelFill,
          textAnchor: "middle",
        };
        this.rearLabel = new Label(labelOpts);
        this.rearLabel
          .getElement()
          .style("opacity", 0)
          .transition()
          .duration(duration)
          .style("opacity", 1);
      }
    } else {
      // Hide or destroy rear label if queue is empty
      if (this.rearLabel) {
        this.rearLabel
          .getElement()
          .transition()
          .duration(duration)
          .style("opacity", 0);
        // Optionally destroy: setTimeout(() => { this.rearLabel?.destroy(); this.rearLabel = null; }, duration);
      }
    }

    // --- 3. Update Block Size ---
    this.updateBlockSize();
  }

  private updateBlockSize(): void {
    setTimeout(() => {
      try {
        const bbox = (this.contentGroup.node() as SVGGElement)?.getBBox();
        if (bbox && bbox.width > 0 && bbox.height > 0) {
          const contentPadding = 5;
          // Add extra padding at the bottom for labels if they exist
          const bottomPadding =
            this.frontLabel || this.rearLabel
              ? this.options.labelFontSize + 5
              : 0;
          this.block.updateSize(
            bbox.width + contentPadding * 2,
            bbox.height + contentPadding * 2 + bottomPadding,
            this.options.animationDuration,
          );
        } else {
          this.block.updateSize(80, 40, this.options.animationDuration); // Min size
        }
      } catch (e) {
        console.error("Error calculating bounding box for Queue:", e);
        this.block.updateSize(100, 50, this.options.animationDuration);
      }
    }, 50);
  }

  /** 获取指定索引的 Node 实例 (索引从队头 0 开始) */
  public getNodeByIndex(index: number): Node | undefined {
    const nodeData = this.currentNodesData.find((d) => d.id === String(index));
    return nodeData?.nodeInstance;
  }

  public destroy(): void {
    this.currentNodesData.forEach((d) => d.nodeInstance.destroy());
    this.frontLabel?.destroy();
    this.rearLabel?.destroy();
    this.currentNodesData = [];
    this.frontLabel = null;
    this.rearLabel = null;
  }
}
