// --- 通用树可视化选项 ---
export interface BaseTreeVisualOptions {
    block: import('../../core/block').Block;
    nodeShape?: 'rect' | 'circle';
    nodeWidth?: number;
    nodeHeight?: number;
    nodeRadius?: number;
    nodeFill?: string;
    nodeStroke?: string;
    edgeStroke?: string;
    edgeStrokeWidth?: number;
    maxDepth?: number; // 最大显示深度
    levelSpacing?: number; // 层级间距 (影响布局高度)
    siblingSpacing?: number; // 同级节点间距 (影响布局宽度)
    animationDuration?: number;
}

// --- 二叉树特定类型 ---
export interface BinaryTreeNodeData {
    id: string;
    value: any;
    left?: string | null; // 左子节点 ID
    right?: string | null; // 右子节点 ID
}

export interface BinaryTreeVisualOptions extends BaseTreeVisualOptions {
    initialData: BinaryTreeNodeData[];
    rootId: string; // 根节点 ID
}

// --- M叉树特定类型 (M <= 4) ---
export interface MTreeNodeData {
    id: string;
    value: any;
    children: (string | null)[]; // 子节点 ID 列表 (最多4个)
}

export interface MTreeVisualOptions extends BaseTreeVisualOptions {
    initialData: MTreeNodeData[];
    rootId: string; // 根节点 ID
}

// 内部表示节点布局信息
export interface TreeNodeWithLayout<T> extends d3.HierarchyPointNode<T> {
    // d3.HierarchyPointNode includes: data, depth, height, x, y, parent, children
    // Add any custom properties if needed
    _visualInfo?: { // Internal tracking for visual components
        nodeInstance?: import('../common').Node;
        edgeInstance?: import('../common').Edge;
        ellipsisInstance?: import('../common').Label;
    };
    _originalChildren?: d3.HierarchyNode<T>[]; // Store original children before level cutoff
} 