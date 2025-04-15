import * as d3 from "d3";
import { Block } from "../../core/block";
import { Canvas } from "../../core/canvas";
import { Node, NodeOptions, Label, LabelOptions, Position } from "../common";
import { BaseTreeVisualOptions, TreeNodeWithLayout } from "./types";

// Helper type for internal options with defaults applied
type InternalTreeOptions = Required<
  Omit<BaseTreeVisualOptions, "nodeWidth" | "nodeHeight" | "nodeRadius">
> &
  Pick<BaseTreeVisualOptions, "nodeWidth" | "nodeHeight" | "nodeRadius">;

type TreeValueType = any;

export abstract class BaseTreeVisual<
  TData,
  TOptions extends BaseTreeVisualOptions,
> {
  protected readonly options: InternalTreeOptions;
  protected readonly block: Block;
  protected readonly canvas: Canvas;
  protected readonly contentGroup: d3.Selection<
    SVGGElement,
    TreeValueType,
    null,
    undefined
  >;
  protected treeLayout: d3.TreeLayout<TData>;
  // 根
  protected hierarchyData: TreeNodeWithLayout<TData> | null = null;
  protected nodesMap: Map<string, TreeNodeWithLayout<TData>> = new Map(); // For quick access by id
  protected readonly arrowMarkerId: string;

  // 子类实现
  protected abstract buildHierarchy(
    data: any[],
    rootId: string,
  ): d3.HierarchyNode<TData> | null;
  protected abstract getNodeId(data: TData): string;
  protected abstract getNodeValue(data: TData): any;

  constructor(options: TOptions, defaultSpecificOptions: Partial<TOptions>) {
    this.block = options.block;
    this.canvas = this.block.getCanvas();
    this.contentGroup = this.block.getContentGroup();
    this.arrowMarkerId = this.canvas.defaultArrowMarkerId;

    // Merge defaults: base defaults < specific defaults < provided options
    const baseDefaults: Omit<
      InternalTreeOptions,
      "block" | "nodeWidth" | "nodeHeight" | "nodeRadius"
    > = {
      nodeShape: "circle",
      nodeFill: "#fff",
      nodeStroke: "#000",
      edgeStroke: "#ccc",
      edgeStrokeWidth: 1.5,
      maxDepth: 3,
      levelSpacing: 80,
      siblingSpacing: 1.2, // Factor for nodeSize
      animationDuration: 400,
    };

    this.options = {
      ...baseDefaults,
      nodeRadius: 20, // Default radius
      nodeWidth: 40, // Default width
      nodeHeight: 30, // Default height
      ...defaultSpecificOptions, // Apply specific defaults (like different spacing)
      ...options, // Apply user options last
    };

    // Adjust dimensions based on shape if not fully specified
    if (
      this.options.nodeShape === "circle" &&
      options.nodeRadius === undefined
    ) {
      this.options.nodeWidth = this.options.nodeHeight =
        (this.options.nodeRadius ?? 20) * 2;
    } else if (
      this.options.nodeShape === "rect" &&
      (options.nodeWidth === undefined || options.nodeHeight === undefined)
    ) {
      // Use calculated or default rect dimensions
      this.options.nodeWidth = this.options.nodeWidth ?? 40;
      this.options.nodeHeight = this.options.nodeHeight ?? 30;
    } else {
      // User provided dimensions take precedence if shape matches
      if (this.options.nodeShape === "circle") {
        this.options.nodeRadius = options.nodeRadius ?? this.options.nodeRadius;
        this.options.nodeWidth = this.options.nodeHeight =
          this.options.nodeRadius! * 2;
      }
      if (this.options.nodeShape === "rect") {
        this.options.nodeWidth = options.nodeWidth ?? this.options.nodeWidth;
        this.options.nodeHeight = options.nodeHeight ?? this.options.nodeHeight;
      }
    }

    this.treeLayout = d3
      .tree<TData>()
      .nodeSize([
        this.options.nodeWidth! * this.options.siblingSpacing,
        this.options.levelSpacing,
      ]);
    // Use separation for potentially better spacing with varying node sizes
    // .separation((a, b) => (a.parent == b.parent ? 1 : 1.5));
  }

  protected calculateLayout(data: any[], rootId: string): void {
    const hierarchyRoot = this.buildHierarchy(data, rootId);
    if (!hierarchyRoot) {
      console.error("Failed to build tree hierarchy.");
      this.hierarchyData = null;
      return;
    }

    // Apply max depth cutoff BEFORE layout
    this.hierarchyData = this.applyMaxDepth(
      hierarchyRoot,
      this.options.maxDepth,
    ) as TreeNodeWithLayout<TData>;

    // 计算树布局，现成的算法
    this.treeLayout(this.hierarchyData);

    // Store nodes in a map for easy access
    this.nodesMap.clear();
    this.hierarchyData.each((node) => {
      // D3 layout uses x for horizontal, y for vertical. We might want to swap for typical tree view.
      // Swap x and y for a top-down tree layout
      // 交换x和y以实现从上到下的树布局 (实际上交换之后是从左到右布局)
      //   const tempX = node.x;
      //   node.x = node.y; // Use d3's y (depth) as our x
      //   node.y = tempX; // Use d3's x (horizontal spread) as our y
      this.nodesMap.set(
        this.getNodeId(node.data),
        node as TreeNodeWithLayout<TData>,
      );
    });
  }

  // Recursive function to prune the hierarchy at maxDepth
  protected applyMaxDepth(
    node: d3.HierarchyNode<TData>,
    maxDepth: number,
  ): d3.HierarchyNode<TData> {
    const typedNode = node as TreeNodeWithLayout<TData>;
    typedNode._visualInfo = typedNode._visualInfo ?? {}; // Ensure visualInfo exists
    typedNode._originalChildren = node.children; // Store original children before potential pruning

    if (node.depth >= maxDepth) {
      delete node.children; // Remove children beyond max depth
      typedNode._visualInfo.ellipsisInstance = undefined; // Reset potential ellipsis
    } else if (node.children) {
      node.children = node.children.map((child) =>
        this.applyMaxDepth(child, maxDepth),
      );
      // Check if any original child was pruned
      if (
        typedNode._originalChildren &&
        node.children.length < typedNode._originalChildren.length
      ) {
        // Indicate that children were omitted
        typedNode._visualInfo.ellipsisInstance = undefined; // Mark for potential ellipsis creation
      } else {
        delete typedNode._visualInfo.ellipsisInstance; // No ellipsis needed here
      }
    } else {
      // Leaf node within depth, no ellipsis needed
      delete typedNode._visualInfo.ellipsisInstance;
    }
    return node;
  }

  public update(newData: any[], rootId: string): void {
    this.calculateLayout(newData, rootId);
    if (!this.hierarchyData) {
      // 清除可视化如果层次结构失败
      this.clearVisualization();
      this.updateBlockSize(); // Update block size for empty state
      return;
    }

    const duration = this.options.animationDuration;
    const nodes =
      this.hierarchyData!.descendants() as TreeNodeWithLayout<TData>[];
    const links = this.hierarchyData!.links() as d3.HierarchyLink<TData>[];
    const nodeKeyFn = (d: TreeNodeWithLayout<TData>) => this.getNodeId(d.data);
    const linkKeyFn = (d: d3.HierarchyLink<TData>) =>
      `${this.getNodeId(d.source.data)}-${this.getNodeId(d.target.data)}`;

    // --- Update Nodes ---
    const nodeSelection = this.contentGroup
      .selectAll<SVGGElement, TreeNodeWithLayout<TData>>(".tree-node-group")
      .data(nodes, nodeKeyFn);

    // Exit nodes
    // nodeSelection
    //   .exit()
    //   .transition()
    //   .duration(duration)
    //   .attr(
    //     "transform",
    //     (d) =>
    //       `translate(${d.parent ? d.parent.x : d.x},${d.parent ? d.parent.y : d.y})`,
    //   )
    //   .style("opacity", 0)
    //   .remove()
    //   .each((d) => {
    //     //   NOTE: d类型
    //     const nodeData = d as TreeNodeWithLayout<TData>;
    //     this.destroyNodeVisuals(nodeData);
    //   });

    // Enter nodes
    const nodeEnter = nodeSelection
      .enter()
      .append("g")
      .attr("class", "tree-node-group")
      .attr("id", (d) => `tree-node-${this.getNodeId(d.data)}`)
      .style("opacity", 0)
      .each((d, i, groupNodes) => {
        const nodeData = d as TreeNodeWithLayout<TData>;
        const currentGroup = d3.select(groupNodes[i]);
        nodeData._visualInfo = nodeData._visualInfo ?? {};
        const nodeHeight = this.options.nodeHeight ?? 30;
        const nodeOpts: NodeOptions = {
          id: this.getNodeId(nodeData.data),
          parentSelection: currentGroup,
          shape: this.options.nodeShape,
          fill: this.options.nodeFill,
          stroke: this.options.nodeStroke,
          text: String(this.getNodeValue(nodeData.data) ?? ""),
        };
        if (this.options.nodeShape === "circle")
          nodeOpts.radius = this.options.nodeRadius;
        else {
          nodeOpts.width = this.options.nodeWidth;
          nodeOpts.height = nodeHeight;
        }
        nodeData._visualInfo.nodeInstance = new Node(nodeOpts);
        if (
          nodeData._originalChildren &&
          (!nodeData.children ||
            nodeData.children.length < nodeData._originalChildren.length)
        ) {
          const labelOpts: LabelOptions = {
            id: `ellipsis-${this.getNodeId(nodeData.data)}`,
            parentSelection: currentGroup,
            text: "...",
            fontSize: 10,
            fill: "#999",
            offsetY: nodeHeight / 2 + 10,
          };
          nodeData._visualInfo.ellipsisInstance = new Label(labelOpts);
        }
      });

    // Merge enter and update selections
    const nodeUpdate = nodeEnter.merge(nodeSelection);

    // Transition nodes
    nodeUpdate
      .transition()
      .duration(duration)
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .style("opacity", 1);

    // Update node text and ellipsis
    nodeUpdate.each((d, i, groupNodes) => {
      const nodeData = d as TreeNodeWithLayout<TData>;
      const currentGroup = d3.select(groupNodes[i]);
      if (nodeData._visualInfo?.nodeInstance) {
        nodeData._visualInfo.nodeInstance.setText(
          String(this.getNodeValue(nodeData.data) ?? ""),
        );
      }
      const nodeHeight = this.options.nodeHeight ?? 30;
      if (
        nodeData._originalChildren &&
        (!nodeData.children ||
          nodeData.children.length < nodeData._originalChildren.length)
      ) {
        if (!nodeData._visualInfo?.ellipsisInstance) {
          const labelOpts: LabelOptions = {
            id: `ellipsis-${this.getNodeId(nodeData.data)}`,
            parentSelection: currentGroup,
            text: "...",
            fontSize: 10,
            fill: "#999",
            offsetY: nodeHeight / 2 + 10,
          };
          nodeData._visualInfo = nodeData._visualInfo ?? {};
          nodeData._visualInfo.ellipsisInstance = new Label(labelOpts);
          nodeData._visualInfo
            .ellipsisInstance!.getElement()
            .style("opacity", 0)
            .transition()
            .duration(duration)
            .style("opacity", 1);
        } else {
          nodeData._visualInfo.ellipsisInstance
            .getElement()
            .interrupt()
            .transition()
            .duration(duration)
            .style("opacity", 1);
        }
      } else if (nodeData._visualInfo?.ellipsisInstance) {
        nodeData._visualInfo.ellipsisInstance
          .getElement()
          .interrupt()
          .transition()
          .duration(duration)
          .style("opacity", 0)
          .remove();
        const instanceToDestroy = nodeData._visualInfo.ellipsisInstance;
        setTimeout(() => instanceToDestroy?.destroy(), duration);
        nodeData._visualInfo.ellipsisInstance = undefined;
      }
    });

    // --- Update Links (Edges) ---
    const linkSelection = this.contentGroup
      .selectAll<SVGPathElement, d3.HierarchyLink<TData>>(".tree-link")
      .data(links, linkKeyFn);

    // linkSelection
    //   .exit()
    //   .interrupt()
    //   .transition()
    //   .duration(duration)
    //   .attr("d", (d) => {
    //     const sourceNode = this.nodesMap.get(this.getNodeId(d.source.data));
    //     const startPos = sourceNode
    //       ? { x: sourceNode.x, y: sourceNode.y }
    //       : { x: 0, y: 0 };
    //     return this.generateLinkPath(startPos, startPos);
    //   })
    //   .style("opacity", 0)
    //   .remove();

    const linkEnter = linkSelection
      .enter()
      .insert("path", ".tree-node-group")
      .attr("class", "tree-link")
      .attr("id", (d) => `link-${linkKeyFn(d)}`)
      .style("fill", "none")
      .style("stroke", this.options.edgeStroke)
      .style("stroke-width", this.options.edgeStrokeWidth)
      .style("opacity", 0);

    const linkUpdate = linkEnter.merge(linkSelection);

    linkUpdate
      .interrupt()
      .transition()
      .duration(duration)
      .attr("d", (d) => {
        return this.generateLinkPath(
          d.source as Position,
          d.target as Position,
        );
      })
      .style("opacity", 1);

    // --- Update Block Size ---
    this.updateBlockSize();
  }

  protected generateLinkPath(source: Position, target: Position): string {
    const linkGenerator = d3
      .linkVertical<any, { x: number; y: number }>()
      .x((d) => d.x)
      .y((d) => d.y);
    const sourceCorrected = { x: source.x, y: source.y };
    const targetCorrected = { x: target.x, y: target.y };
    // Handle potential null return from link generator
    return (
      linkGenerator({ source: sourceCorrected, target: targetCorrected }) ?? ""
    );
  }

  protected updateBlockSize(): void {
    setTimeout(() => {
      try {
        const bbox = (this.contentGroup.node() as SVGGElement)?.getBBox();
        if (this.hierarchyData && bbox && bbox.width > 0 && bbox.height > 0) {
          // Add padding around the calculated bounding box
          const contentPadding = 20;
          this.block.updateSize(
            bbox.width + contentPadding * 2,
            bbox.height + contentPadding * 2,
            this.options.animationDuration,
            bbox.width / 1.5,
            this.options.nodeRadius,
          );
        } else {
          // Handle empty tree
          this.block.updateSize(50, 30, this.options.animationDuration); // Min size
        }
      } catch (e) {
        console.error("Error calculating bounding box for Tree:", e);
        this.block.updateSize(100, 50, this.options.animationDuration);
      }
      // 保证一个较长时间使得能稳定获取到bbox尺寸
    }, 400);
  }

  protected clearVisualization(): void {
    this.contentGroup.selectAll(".tree-node-group").remove();
    this.contentGroup.selectAll(".tree-link").remove();
    this.nodesMap.clear();
    this.hierarchyData = null;
  }

  // Helper to destroy visuals associated with a node
  protected destroyNodeVisuals(nodeData: TreeNodeWithLayout<TData>): void {
    nodeData._visualInfo?.nodeInstance?.destroy();
    nodeData._visualInfo?.edgeInstance?.destroy(); // Usually edge is tied to source, handled in link exit
    nodeData._visualInfo?.ellipsisInstance?.destroy();
    if (nodeData._visualInfo) {
      nodeData._visualInfo = undefined;
    }
  }

  public destroy(): void {
    this.clearVisualization();
    // Any other cleanup specific to the base class
  }
}

/**
 * 二叉树陷阱：
 * 1. content容器位置，头节点的中心与block左上角一致，需要Block提供API自己设置偏移
 */
