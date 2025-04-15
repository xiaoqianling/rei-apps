import * as d3 from "d3";
import { BaseTreeVisual } from "./BaseTreeVisual";
import { BinaryTreeNodeData, BinaryTreeVisualOptions } from "./types";
import { buildBinaryTreeHierarchy } from "./utils";

export class BinaryTreeVisual extends BaseTreeVisual<
  BinaryTreeNodeData,
  BinaryTreeVisualOptions
> {
  constructor(options: BinaryTreeVisualOptions) {
    // Pass specific defaults if needed, otherwise use base defaults
    const defaultSpecificOptions: Partial<BinaryTreeVisualOptions> = {
      // Add specific defaults for Binary Tree here if different from BaseTree
      // e.g., siblingSpacing: 1.5
    };
    super(options, defaultSpecificOptions);

    // Initial rendering
    this.update(options.initialData, options.rootId);
  }

  protected override getNodeId(data: BinaryTreeNodeData): string {
    return data.id;
  }

  protected override getNodeValue(data: BinaryTreeNodeData): any {
    return data.value;
  }

  protected override buildHierarchy(
    data: BinaryTreeNodeData[],
    rootId: string,
  ): d3.HierarchyNode<BinaryTreeNodeData> | null {
    const nestedData = buildBinaryTreeHierarchy(data, rootId);
    if (!nestedData) return null;
    // Use the default children accessor (which expects a 'children' property)
    return d3.hierarchy(nestedData);
  }

  // Override update if specific binary tree logic is needed beyond base class
  // public override update(newData: BinaryTreeNodeData[], rootId: string): void {
  //     super.update(newData, rootId);
  //     // Add any binary tree specific post-update logic here
  // }
}
