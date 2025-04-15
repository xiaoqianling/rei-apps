import * as d3 from 'd3';
import { BinaryTreeNodeData, MTreeNodeData } from './types';

// Helper type for nested structure D3 expects (now with explicit children property)
type HierarchyInputNode<T> = T & { _hierarchyChildren?: HierarchyInputNode<T>[] };

/**
 * 将扁平的二叉树节点数据（通过 ID 引用）转换为 D3 Hierarchy 需要的嵌套结构。
 * @param flatData 包含所有节点的数组
 * @param rootId 根节点的 ID
 * @returns 嵌套结构的根节点，如果找不到根或数据无效则返回 null
 */
export function buildBinaryTreeHierarchy(flatData: BinaryTreeNodeData[], rootId: string): HierarchyInputNode<BinaryTreeNodeData> | null {
    const dataMap = new Map(flatData.map(node => [node.id, { ...node, children: [] as HierarchyInputNode<BinaryTreeNodeData>[] }]));
    const root = dataMap.get(rootId);

    if (!root) return null;

    dataMap.forEach(node => {
        if (node.left && dataMap.has(node.left)) {
            node.children[0] = dataMap.get(node.left)!;
        }
        if (node.right && dataMap.has(node.right)) {
             // Ensure right child is always at index 1, even if left is missing
            node.children[1] = dataMap.get(node.right)!;
        }
    });

    // Cleanup empty children arrays if desired, though d3.hierarchy handles them
    // dataMap.forEach(node => { if (node.children.length === 0) delete node.children; });

    return root;
}

/**
 * 将扁平的 M 叉树节点数据转换为 D3 Hierarchy 需要的嵌套结构。
 * @param flatData 包含所有节点的数组
 * @param rootId 根节点的 ID
 * @returns 嵌套结构的根节点，如果找不到根或数据无效则返回 null
 */
export function buildMTreeHierarchy(flatData: MTreeNodeData[], rootId: string): HierarchyInputNode<MTreeNodeData> | null {
    const dataMap = new Map(flatData.map(node => [node.id, { ...node, _hierarchyChildren: [] as HierarchyInputNode<MTreeNodeData>[] }]));
    const root = dataMap.get(rootId);

    if (!root) return null;

    dataMap.forEach(node => {
        node._hierarchyChildren = (node.children ?? [])
            .map((childId: string | null): HierarchyInputNode<MTreeNodeData> | undefined => childId ? dataMap.get(childId) : undefined)
            .filter((child?: HierarchyInputNode<MTreeNodeData>): child is HierarchyInputNode<MTreeNodeData> => child !== undefined);
    });

    return root;
} 