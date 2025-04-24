import { TipLevelsTypes } from "@/src/components";
import { Descendant } from "slate";

export const BSTContent: Descendant[] = [
  {
    type: "h1",
    children: [{ text: "二叉搜索树 (Binary Search Tree - BST)" }],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "二叉搜索树是一种特殊的二叉树，它具有以下关键属性，使得查找、插入和删除操作通常非常高效：",
      },
    ],
  },
  {
    type: "bulleted-list",
    children: [
      {
        type: "list-item",
        children: [
          { text: "左子树 (Left Subtree):", bold: true },
          { text: " 所有节点的值都小于其父节点的值。" },
        ],
      },
      {
        type: "list-item",
        children: [
          { text: "右子树 (Right Subtree):", bold: true },
          { text: " 所有节点的值都大于其父节点的值。" },
        ],
      },
      {
        type: "list-item",
        children: [
          { text: "递归性:", bold: true },
          { text: " 每个节点的左子树和右子树本身也都是二叉搜索树。" },
        ],
      },
      {
        type: "list-item",
        children: [
          { text: "无重复值 (通常):", bold: true },
          {
            text: " 大多数BST的定义不允许存在重复值，但也可以通过特定规则允许（例如，允许重复值存在于右子树）。",
          },
        ],
      },
    ],
  },
  {
    type: "tip",
    level: TipLevelsTypes.TIP,
    children: [
      {
        text: "BST最重要的特性是：对BST进行中序遍历 (In-order Traversal) 会得到一个有序的序列。",
      },
    ],
  },
  {
    type: "h2",
    children: [{ text: "基本操作与时间复杂度" }],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "以下复杂度是在平均情况（树相对平衡）下的表现。在最坏情况（树退化成链表）下，复杂度可能降至 O(n)。",
      },
    ],
  },
  {
    type: "bulleted-list",
    children: [
      {
        type: "list-item",
        children: [
          { text: "查找 (Search):", bold: true },
          {
            text: " O(log n) - 从根节点开始，比较目标值与当前节点值，决定向左或向右子树搜索，每次将搜索空间减半。",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          { text: "插入 (Insertion):", bold: true },
          {
            text: " O(log n) - 类似于查找，找到合适的插入位置（一个空的子节点链接），然后创建新节点。",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          { text: "删除 (Deletion):", bold: true },
          {
            text: " O(log n) - 删除操作相对复杂，需要考虑三种情况：1) 删除叶节点：直接删除。 2) 删除只有一个子节点的节点：用其子节点替换。 3) 删除有两个子节点的节点：用其右子树中的最小节点（或左子树中的最大节点）替换，然后递归删除那个替换节点。",
          },
        ],
      },
    ],
  },
  {
    type: "h2",
    children: [{ text: "代码示例 (JavaScript)" }],
  },
  {
    type: "code-block",
    language: "js",
    code: `class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  // 插入节点 (递归)
  insert(value) {
    const newNode = new TreeNode(value);
    if (this.root === null) {
      this.root = newNode;
    } else {
      this.insertNode(this.root, newNode);
    }
  }

  insertNode(node, newNode) {
    if (newNode.value < node.value) {
      if (node.left === null) {
        node.left = newNode;
      } else {
        this.insertNode(node.left, newNode);
      }
    } else { // Assume no duplicates or duplicates go right
      if (node.right === null) {
        node.right = newNode;
      } else {
        this.insertNode(node.right, newNode);
      }
    }
  }

  // 查找节点 (递归)
  search(value) {
    return this.searchNode(this.root, value);
  }

  searchNode(node, value) {
    if (node === null) {
      return null; // Not found
    }

    if (value < node.value) {
      return this.searchNode(node.left, value);
    } else if (value > node.value) {
      return this.searchNode(node.right, value);
    } else {
      return node; // Found
    }
  }
  
  // 中序遍历 (用于验证)
  inOrderTraversal(node = this.root, result = []) {
    if (node !== null) {
        this.inOrderTraversal(node.left, result);
        result.push(node.value);
        this.inOrderTraversal(node.right, result);
    }
    return result;
  }

  // ... (删除操作比较复杂，通常需要辅助函数) ...
}

const bst = new BinarySearchTree();
bst.insert(50);
bst.insert(30);
bst.insert(70);
bst.insert(20);
bst.insert(40);
bst.insert(60);
bst.insert(80);

console.log("In-order Traversal:", bst.inOrderTraversal()); // Output: [20, 30, 40, 50, 60, 70, 80]
console.log("Search for 40:", bst.search(40)); // Output: TreeNode { value: 40, ... }
console.log("Search for 90:", bst.search(90)); // Output: null`,
    children: [{ text: "" }],
  },
  {
    type: "tip",
    level: TipLevelsTypes.WARNING,
    children: [
      {
        text: "BST 的性能高度依赖于树的平衡状态。如果插入的元素是顺序的（例如，1, 2, 3, 4, 5），BST 会退化成一个链表，所有操作的时间复杂度都会变成 O(n)。这就是为什么需要 AVL 树、红黑树等自平衡二叉搜索树。",
      },
    ],
  },
  {
    type: "h2",
    children: [{ text: "可视化演示 (概念)" }],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "下面的可视化组件演示了向二叉搜索树中插入节点的过程，观察节点如何根据值找到正确的位置。",
      },
    ],
  },
  // {
  //     type: 'visualizer',
  //     algorithmId: 'bst-insertion',
  //     initialData: [50, 30, 70, 20, 40, 60, 80] // 可以预设一些数据或让用户输入
  // }
];

export default BSTContent;
