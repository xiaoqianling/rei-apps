import * as d3 from "d3";
import { BaseTreeVisual } from "./BaseTreeVisual";
import { MTreeNodeData, MTreeVisualOptions } from "./types";
import { buildMTreeHierarchy } from "./utils";

export class MTreeVisual extends BaseTreeVisual<
  MTreeNodeData,
  MTreeVisualOptions
> {
  constructor(options: MTreeVisualOptions) {
    const defaultSpecificOptions: Partial<MTreeVisualOptions> = {
      // M-trees might need more sibling spacing
      siblingSpacing: 1.5,
    };
    super(options, defaultSpecificOptions);
    this.update(options.initialData, options.rootId);
  }

  protected override getNodeId(data: MTreeNodeData): string {
    return data.id;
  }

  protected override getNodeValue(data: MTreeNodeData): any {
    return data.value;
  }

  protected override buildHierarchy(
    data: MTreeNodeData[],
    rootId: string,
  ): d3.HierarchyNode<MTreeNodeData> | null {
    const nestedData = buildMTreeHierarchy(data, rootId);
    if (!nestedData) return null;
    // Use the children accessor function to specify where the children are
    return d3.hierarchy<MTreeNodeData>(nestedData, (d) => {
      // The accessor receives the data T (MTreeNodeData in this case, potentially augmented)
      // Check if the augmented property exists on the data object itself
      return (d as any)._hierarchyChildren; // Access the dynamically added property
    });
  }

  // Override update if needed
  // public override update(newData: MTreeNodeData[], rootId: string): void {
  //     super.update(newData, rootId);
  //     // M-tree specific logic
  // }
}
