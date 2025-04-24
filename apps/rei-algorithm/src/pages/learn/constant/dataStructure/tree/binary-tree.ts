import { Descendant } from "slate";

export const BinaryTreeContent: Descendant[] = [
  {
    type: "h1",
    children: [{ text: "二叉树 (Binary Tree)" }],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "树是一种重要的非线性数据结构，用于表示具有层级关系的数据。二叉树是树的一种特殊形式，其中每个节点最多有两个子节点，通常称为左子节点 (Left Child) 和右子节点 (Right Child)。",
      },
    ],
  },
  {
    type: "mermaid",
    children: [
      {
        text: `graph TD
    A((Root)) --> B((Left Child));
    A --> C((Right Child));
    B --> D((Left-Left));
    B --> E((Left-Right));
    C --> F((Right-Left));`,
      },
    ],
  },
  {
    type: "h2",
    children: [{ text: "基本术语" }],
  },
  {
    type: "bulleted-list",
    children: [
      {
        type: "list-item",
        children: [
          { text: "根节点 (Root):", bold: true },
          { text: " 树的顶层节点，没有父节点。" },
        ],
      },
      {
        type: "list-item",
        children: [
          { text: "子节点 (Child):", bold: true },
          { text: " 一个节点的直接后代。" },
        ],
      },
      {
        type: "list-item",
        children: [
          { text: "父节点 (Parent):", bold: true },
          { text: " 一个节点的直接祖先。" },
        ],
      },
      {
        type: "list-item",
        children: [
          { text: "叶节点 (Leaf):", bold: true },
          { text: " 没有子节点的节点。" },
        ],
      },
      {
        type: "list-item",
        children: [
          { text: "内部节点 (Internal Node):", bold: true },
          { text: " 至少有一个子节点的非叶节点。" },
        ],
      },
      {
        type: "list-item",
        children: [
          { text: "边 (Edge):", bold: true },
          { text: " 连接两个节点的线。" },
        ],
      },
      {
        type: "list-item",
        children: [
          { text: "路径 (Path):", bold: true },
          { text: " 从一个节点到另一个节点的边的序列。" },
        ],
      },
      {
        type: "list-item",
        children: [
          { text: "深度 (Depth):", bold: true },
          {
            text: " 从根节点到一个节点的路径长度（边的数量）。根节点深度为0。",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          { text: "高度 (Height):", bold: true },
          {
            text: " 从一个节点到其最远叶节点的最长路径长度。叶节点高度为0。树的高度是根节点的高度。",
          },
        ],
      },
    ],
  },
  {
    type: "h2",
    children: [{ text: "二叉树的类型" }],
  },
  {
    type: "bulleted-list",
    children: [
      {
        type: "list-item",
        children: [
          {
            text: "满二叉树 (Full Binary Tree): 每个节点要么是叶节点，要么恰好有两个子节点。",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          {
            text: "完全二叉树 (Complete Binary Tree): 除了最后一层外，其他层都是完全充满的，且最后一层的节点都尽可能地靠左排列。",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          {
            text: "完美二叉树 (Perfect Binary Tree): 所有内部节点都有两个子节点，且所有叶节点都在同一层。它既是满二叉树也是完全二叉树。",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          {
            text: "平衡二叉树 (Balanced Binary Tree): （广义上）左右子树的高度差不超过某个阈值（例如 AVL 树的高度差不超过1）。",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          {
            text: "二叉搜索树 (Binary Search Tree - BST): 左子树所有节点的值小于根节点，右子树所有节点的值大于根节点，且左右子树也都是二叉搜索树。",
          },
        ],
      },
    ],
  },
  {
    type: "h2",
    children: [{ text: "二叉树遍历 (Traversal)" }],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "遍历是指按照特定顺序访问树中的所有节点。常见的遍历方式有：",
      },
    ],
  },
  {
    type: "fold", // 假设的可折叠块
    title: "深度优先搜索 (DFS) 类",
    children: [
      {
        type: "h3",
        children: [{ text: "前序遍历 (Pre-order): 根 -> 左 -> 右" }],
      },
      {
        type: "paragraph",
        children: [
          {
            text: "首先访问根节点，然后递归地前序遍历左子树，最后递归地前序遍历右子树。",
          },
        ],
      },
      {
        type: "code-block",
        language: "js",
        code: `function preOrderTraversal(node) {
  if (node === null) return;
  console.log(node.value); // Visit root
  preOrderTraversal(node.left); // Traverse left subtree
  preOrderTraversal(node.right); // Traverse right subtree
}`,
        children: [{ text: "" }],
      },
      {
        type: "h3",
        children: [{ text: "中序遍历 (In-order): 左 -> 根 -> 右" }],
      },
      {
        type: "paragraph",
        children: [
          {
            text: "首先递归地中序遍历左子树，然后访问根节点，最后递归地中序遍历右子树。对于二叉搜索树，中序遍历会按升序访问所有节点。",
          },
        ],
      },
      {
        type: "code-block",
        language: "js",
        code: `function inOrderTraversal(node) {
  if (node === null) return;
  inOrderTraversal(node.left); // Traverse left subtree
  console.log(node.value); // Visit root
  inOrderTraversal(node.right); // Traverse right subtree
}`,
        children: [{ text: "" }],
      },
      {
        type: "h3",
        children: [{ text: "后序遍历 (Post-order): 左 -> 右 -> 根" }],
      },
      {
        type: "paragraph",
        children: [
          {
            text: "首先递归地后序遍历左子树，然后递归地后序遍历右子树，最后访问根节点。常用于计算表达式树或释放树节点内存。",
          },
        ],
      },
      {
        type: "code-block",
        language: "js",
        code: `function postOrderTraversal(node) {
  if (node === null) return;
  postOrderTraversal(node.left); // Traverse left subtree
  postOrderTraversal(node.right); // Traverse right subtree
  console.log(node.value); // Visit root
}`,
        children: [{ text: "" }],
      },
    ],
  },
  {
    type: "fold",
    title: "广度优先搜索 (BFS) 类",
    children: [
      {
        type: "h3",
        children: [{ text: "层序遍历 (Level-order)" }],
      },
      {
        type: "paragraph",
        children: [
          {
            text: "从根节点开始，按层级逐层访问节点，同一层内从左到右访问。通常使用队列来实现。",
          },
        ],
      },
      {
        type: "code-block",
        language: "js",
        code: `function levelOrderTraversal(root) {
  if (root === null) return;
  const queue = [root]; // Use an array as a queue
  while (queue.length > 0) {
    const currentNode = queue.shift(); // Dequeue
    console.log(currentNode.value); // Visit node

    if (currentNode.left !== null) {
      queue.push(currentNode.left); // Enqueue left child
    }
    if (currentNode.right !== null) {
      queue.push(currentNode.right); // Enqueue right child
    }
  }
}`,
        children: [{ text: "" }],
      },
    ],
  },
  {
    type: "h2",
    children: [{ text: "节点实现 (JavaScript)" }],
  },
  {
    type: "code-block",
    language: "js",
    code: `class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;  // Pointer to the left child
    this.right = null; // Pointer to the right child
  }
}

// Example Usage:
const root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);

console.log("Pre-order Traversal:");
preOrderTraversal(root); // Example call
console.log("\nIn-order Traversal:");
inOrderTraversal(root);
console.log("\nPost-order Traversal:");
postOrderTraversal(root);
console.log("\nLevel-order Traversal:");
levelOrderTraversal(root);
`,
    children: [{ text: "" }],
  },
];

export default BinaryTreeContent;
