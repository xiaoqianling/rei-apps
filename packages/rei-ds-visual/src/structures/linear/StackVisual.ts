import * as d3 from "d3";
import { Block } from "../../core/block";
import { Node, NodeOptions, Label, LabelOptions, Position } from "../common";
import {
  constructVisualComponentOptions,
  defaultQueueOptions,
  VisualComponentConstructorOptions,
  VisualComponentOptions,
} from "./type";

type InternalStackNodeData = {
  id: string; // Use index as id (bottom=0)
  value: any;
  targetPosition: Position;
  nodeInstance: Node;
};

export class StackVisual {
  private readonly options: VisualComponentOptions;
  private readonly block: Block;
  private readonly contentGroup: d3.Selection<
    SVGGElement,
    unknown,
    null,
    undefined
  >;
  private currentNodesData: InternalStackNodeData[] = [];
  private topLabel: Label | null = null;
  private bottomLabel: Label | null = null;

  constructor(
    container: Block,
    data: any[],
    options: VisualComponentConstructorOptions,
  ) {
    this.block = container;
    this.contentGroup = this.block.getContentGroup();
    this.options = constructVisualComponentOptions(options, {
      ...defaultQueueOptions,
      nodeOptions: {
        ...defaultQueueOptions.nodeOptions,
        width: 60,
        height: 25,
      },
    });

    // Adjust dimensions based on shape
    if (
      this.options.nodeOptions.shape === "circle" &&
      options.nodeOptions?.radius === undefined
    ) {
      this.options.nodeOptions.width = this.options.nodeOptions.height =
        this.options.nodeOptions.radius * 2;
    } else if (
      this.options.nodeOptions.shape === "rect" &&
      (options.nodeOptions?.width === undefined ||
        options.nodeOptions?.height === undefined)
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

  private calculateNodeLayout(data: any[]): InternalStackNodeData[] {
    const nodeWidth = this.options.nodeOptions.width;
    const nodeHeight = this.options.nodeOptions.height;
    const spacing = this.options.spacing;
    const totalHeight =
      data.length * nodeHeight + Math.max(0, data.length - 1) * spacing;

    return data.map((value, index) => {
      // Stack grows upwards, so y decreases as index increases
      const y = totalHeight - index * (nodeHeight + spacing) - nodeHeight / 2;
      const x = 0; // Align vertically
      return {
        id: String(index),
        value: value,
        targetPosition: { x: x + nodeWidth / 2, y: y }, // Node center
      } as InternalStackNodeData;
    });
  }

  public update(newData: any[]): void {
    const layoutData = this.calculateNodeLayout(newData);
    const duration = this.options.animationDuration;
    const nodeWidth = this.options.nodeOptions.width;

    const existingDataMap = new Map(
      this.currentNodesData.map((d) => [d.id, d]),
    );
    const newLayoutMap = new Map(layoutData.map((d) => [d.id, d]));

    // --- 1. Update/Enter/Exit Nodes --- (Similar logic)
    const enteringNodes: InternalStackNodeData[] = [];

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
    const nextNodesData: InternalStackNodeData[] = [];
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

    // --- 2. Update Top/Bottom Labels ---
    const labelXOffset = nodeWidth / 2 + 15; // To the right of the stack

    // Top Label (Last element in the array)
    if (this.currentNodesData.length > 0) {
      const topNode = this.currentNodesData[this.currentNodesData.length - 1];
      const topLabelPos: Position = {
        x: topNode.targetPosition.x + labelXOffset,
        y: topNode.targetPosition.y,
      };
      if (this.topLabel) {
        this.topLabel.moveTo(topLabelPos.x, topLabelPos.y, duration);
        this.topLabel
          .getElement()
          .transition()
          .duration(duration)
          .style("opacity", 1);
      } else {
        const labelOpts: LabelOptions = {
          id: "stack-top-label",
          parentSelection: this.contentGroup,
          initialPosition: topLabelPos,
          text: "Top",
          fontSize: this.options.labelFontSize,
          fill: this.options.labelFill,
          textAnchor: "start",
          dominantBaseline: "middle",
        };
        this.topLabel = new Label(labelOpts);
        this.topLabel
          .getElement()
          .style("opacity", 0)
          .transition()
          .duration(duration)
          .style("opacity", 1);
      }
    } else {
      // Hide top label if empty
      if (this.topLabel) {
        this.topLabel
          .getElement()
          .transition()
          .duration(duration)
          .style("opacity", 0);
      }
    }

    // Bottom Label (First element in the array)
    if (this.currentNodesData.length > 0) {
      const bottomNode = this.currentNodesData[0];
      const bottomLabelPos: Position = {
        x: bottomNode.targetPosition.x + labelXOffset,
        y: bottomNode.targetPosition.y,
      };
      if (this.bottomLabel) {
        // Avoid moving if it's the same node as top (stack size 1)
        if (
          this.topLabel?.getPosition().x !== bottomLabelPos.x ||
          this.topLabel?.getPosition().y !== bottomLabelPos.y
        ) {
          this.bottomLabel.moveTo(bottomLabelPos.x, bottomLabelPos.y, duration);
        }
        this.bottomLabel
          .getElement()
          .transition()
          .duration(duration)
          .style("opacity", 1);
      } else {
        const labelOpts: LabelOptions = {
          id: "stack-bottom-label",
          parentSelection: this.contentGroup,
          initialPosition: bottomLabelPos,
          text: "Bottom",
          fontSize: this.options.labelFontSize,
          fill: this.options.labelFill,
          textAnchor: "start",
          dominantBaseline: "middle",
        };
        this.bottomLabel = new Label(labelOpts);
        this.bottomLabel
          .getElement()
          .style("opacity", 0)
          .transition()
          .duration(duration)
          .style("opacity", 1);
      }
    } else {
      // Hide bottom label if empty
      if (this.bottomLabel) {
        this.bottomLabel
          .getElement()
          .transition()
          .duration(duration)
          .style("opacity", 0);
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
          // Add extra padding on the right for labels if they exist
          const rightPadding = this.topLabel || this.bottomLabel ? 40 : 0; // Estimate label width
          this.block.updateSize(
            bbox.width + contentPadding * 2 + rightPadding,
            bbox.height + contentPadding * 2,
            this.options.animationDuration,
          );
        } else {
          this.block.updateSize(80, 40, this.options.animationDuration); // Min size
        }
      } catch (e) {
        console.error("Error calculating bounding box for Stack:", e);
        this.block.updateSize(100, 50, this.options.animationDuration);
      }
    }, 50);
  }

  /** 获取指定索引的 Node 实例 (索引从栈底 0 开始) */
  public getNodeByIndex(index: number): Node | undefined {
    const nodeData = this.currentNodesData.find((d) => d.id === String(index));
    return nodeData?.nodeInstance;
  }

  public destroy(): void {
    this.currentNodesData.forEach((d) => d.nodeInstance.destroy());
    this.topLabel?.destroy();
    this.bottomLabel?.destroy();
    this.currentNodesData = [];
    this.topLabel = null;
    this.bottomLabel = null;
  }
}
