import { TipLevelsTypes } from "@/src/components";
import { Descendant } from "slate";

export const AVLTreeContent: Descendant[] = [
  {
    type: "h1",
    children: [{ text: "AVL 树 (AVL Tree)" }],
  },
  {
    type: "paragraph",
    children: [
      { text: "AVL 树是最早被发明的" },
      {
        text: "自平衡二叉搜索树 (Self-Balancing Binary Search Tree)",
        bold: true,
      },
      { text: "。它通过在每次插入和删除操作后进行检查，并在必要时执行" },
      { text: "旋转 (Rotations)", bold: true },
      {
        text: "操作来维持树的平衡，从而确保所有基本操作（查找、插入、删除）的时间复杂度在最坏情况下仍然保持 O(log n)。",
      },
    ],
  },
  {
    type: "h2",
    children: [{ text: "平衡因子 (Balance Factor)" }],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "AVL 树的关键在于维持每个节点的平衡因子。一个节点的平衡因子定义为其",
      },
      { text: "右子树的高度减去其左子树的高度", bold: true },
      {
        text: " (或者反过来，定义需一致)。在 AVL 树中，所有节点的平衡因子必须是 ",
      },
      { text: "-1, 0, 或 1", code: true },
      {
        text: "。如果任何节点的平衡因子变成了 -2 或 +2，则树失去平衡，需要进行旋转操作。",
      },
    ],
  },
  {
    type: "h2",
    children: [{ text: "旋转操作" }],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "当插入或删除导致某个节点的平衡因子变为 -2 或 +2 时，需要执行旋转来恢复平衡。主要有四种旋转情况：",
      },
    ],
  },
  {
    type: "fold",
    title: '1. 左旋 (Left Rotation) - 用于处理 "右右" (RR) 情况',
    children: [
      {
        type: "paragraph",
        children: [
          {
            text: "当一个节点的右子节点的平衡因子为 +1 (或 0)，且该节点的平衡因子为 +2 时，执行左旋。这通常发生在向右子树的右侧插入新节点时。",
          },
        ],
      },
      {
        type: "paragraph",
        children: [
          {
            text: "旋转操作：将右子节点 (B) 提升为新的根，原子树根 (A) 成为新根的左子节点，原子树根的右子节点的左子树 (如果存在) 成为原子树根的右子节点。",
          },
        ],
      },
    ],
  },
  {
    type: "mermaid",
    children: [
      {
        text: `graph TD
    subgraph Before ["Before (Balance Factor +2)"]
        direction LR
        A[+2] --> B[0]
        B --> C[+1]
    end
    subgraph After ["After (Balance Factors 0)"]
        direction LR
        B2[0] --> A2[0]
        B2 --> C2[0]
    end`,
      },
    ],
  },
  {
    type: "fold",
    title: '2. 右旋 (Right Rotation) - 用于处理 "左左" (LL) 情况',
    children: [
      {
        type: "paragraph",
        children: [
          {
            text: "当一个节点的左子节点的平衡因子为 -1 (或 0)，且该节点的平衡因子为 -2 时，执行右旋。这通常发生在向左子树的左侧插入新节点时。",
          },
        ],
      },
      {
        type: "paragraph",
        children: [
          {
            text: "旋转操作：将左子节点 (B) 提升为新的根，原子树根 (C) 成为新根的右子节点，原子树根的左子节点的右子树 (如果存在) 成为原子树根的左子节点。",
          },
        ],
      },
    ],
  },
  {
    type: "mermaid",
    children: [
      {
        text: `graph TD
    subgraph Before ["Before (Balance Factor -2)"]
        direction RL
        C([-2]) --> B([0])
        B --> A([-1])
    end
    subgraph After ["After (Balance Factors 0)"]
        direction RL
        B2([0]) --> A2([0])
        B2 --> C2([0])
    end`,
      },
    ],
  },
  {
    type: "fold",
    title: '3. 左右旋 (Left-Right Rotation - LR) - 用于处理 "左右" (LR) 情况',
    children: [
      {
        type: "paragraph",
        children: [
          {
            text: '当一个节点的左子节点的平衡因子为 +1，且该节点的平衡因子为 -2 时，先对其左子节点执行一次左旋，将其转换为 "左左" (LL) 情况，然后再对原节点执行一次右旋。',
          },
        ],
      },
    ],
  },
  {
    type: "mermaid",
    children: [
      {
        text: `graph TD
    subgraph Before ["Before (BF -2)"]
      direction LR
      C([C: -2]) --> A([A: +1])
      A --> B([B: 0])
    end
    subgraph Step1 ["Step 1: Left Rotate A"]
      direction LR
      C2([C: -2]) --> B2([B: 0])
      B2 --> A2([A: 0])
    end
    subgraph Step2 ["Step 2: Right Rotate C"]
      direction LR
      B3([B: 0]) --> A3([A: 0])
      B3 --> C3([C: 0])
    end`,
      },
    ],
  },
  {
    type: "fold",
    title: '4. 右左旋 (Right-Left Rotation - RL) - 用于处理 "右左" (RL) 情况',
    children: [
      {
        type: "paragraph",
        children: [
          {
            text: '当一个节点的右子节点的平衡因子为 -1，且该节点的平衡因子为 +2 时，先对其右子节点执行一次右旋，将其转换为 "右右" (RR) 情况，然后再对原节点执行一次左旋。',
          },
        ],
      },
    ],
  },
  {
    type: "mermaid",
    children: [
      {
        text: `graph TD
    subgraph Before ["Before (BF +2)"]
      direction LR
      A([A: +2]) --> C([C: -1])
      C --> B([B: 0])
    end
    subgraph Step1 ["Step 1: Right Rotate C"]
      direction LR
      A2([A: +2]) --> B2([B: 0])
      B2 --> C2([C: 0])
    end
    subgraph Step2 ["Step 2: Left Rotate A"]
      direction LR
      B3([B: 0]) --> A3([A: 0])
      B3 --> C3([C: 0])
    end`,
      },
    ],
  },
  {
    type: "h2",
    children: [{ text: "时间复杂度" }],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "由于 AVL 树通过旋转始终保持平衡（树的高度维持在 O(log n)），因此其查找、插入和删除操作的",
      },
      { text: "最坏时间复杂度都是 O(log n)", bold: true },
      {
        text: "。这比普通的 BST 在最坏情况下的 O(n) 有显著优势。但是，维护平衡需要额外的旋转操作，因此 AVL 树的插入和删除常数因子可能比非自平衡 BST 或其他自平衡树（如红黑树）稍大。",
      },
    ],
  },
  {
    type: "h2",
    children: [{ text: "代码实现说明" }],
  },
  {
    type: "tip",
    level: TipLevelsTypes.WARNING,
    children: [
      {
        text: "AVL 树的完整代码实现（特别是删除和旋转逻辑）相对复杂，涉及较多细节。以下仅提供节点结构概念和旋转函数的伪代码提示。",
      },
    ],
  },
  {
    type: "code-block",
    language: "js",
    code: `class AVLNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1; // Store node height for balance factor calculation
  }
}

// Function to get height of a node (handles null nodes)
function getHeight(node) {
  return node ? node.height : 0;
}

// Function to get balance factor
function getBalanceFactor(node) {
  return node ? getHeight(node.right) - getHeight(node.left) : 0;
}

// Function to update node height
function updateHeight(node) {
  node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
}

// --- Rotation Functions (Conceptual) ---

function leftRotate(nodeY) {
  /*
     y (+2)         x (0 or +1)
    / \
   T1  x (-1)  ->  / \
      / \
     T2  z
          |
          T3 (Becomes y.right)

   Returns new root (x)
  */
  const nodeX = nodeY.right;
  const T2 = nodeX.left;

  // Perform rotation
  nodeX.left = nodeY;
  nodeY.right = T2;

  // Update heights (order matters: update children first)
  updateHeight(nodeY);
  updateHeight(nodeX);

  return nodeX; // New root of the rotated subtree
}

function rightRotate(nodeY) {
  /*
       y (-2)           x (0 or -1)
      / \
     x (+1) T3   ->    / \
    / \
   z  T2
  |
  T1 (Becomes y.left)

  Returns new root (x)
  */
  const nodeX = nodeY.left;
  const T2 = nodeX.right;

  // Perform rotation
  nodeX.right = nodeY;
  nodeY.left = T2;

  // Update heights
  updateHeight(nodeY);
  updateHeight(nodeX);

  return nodeX; // New root
}

// --- Insertion (Conceptual) ---
function insert(root, value) {
  // 1. Perform standard BST insertion
  // ... (recursive insertion logic)

  // 2. Update height of the current node
  updateHeight(root);

  // 3. Get balance factor
  const balance = getBalanceFactor(root);

  // 4. Check for imbalance and perform rotations if needed
  // LL Case
  if (balance < -1 && value < root.left.value) {
    return rightRotate(root);
  }
  // RR Case
  if (balance > 1 && value > root.right.value) {
    return leftRotate(root);
  }
  // LR Case
  if (balance < -1 && value > root.left.value) {
    root.left = leftRotate(root.left);
    return rightRotate(root);
  }
  // RL Case
  if (balance > 1 && value < root.right.value) {
    root.right = rightRotate(root.right);
    return leftRotate(root);
  }

  // Return the (potentially new) root of the subtree
  return root;
}

// Deletion is even more complex, involving similar balancing checks after BST deletion.
`,
    children: [{ text: "" }],
  },
  {
    type: "h2",
    children: [{ text: "可视化演示 (概念)" }],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "下面的可视化组件演示了向 AVL 树中插入节点并触发旋转以保持平衡的过程。",
      },
    ],
  },
  // {
  //     type: 'visualizer',
  //     algorithmId: 'avl-insertion',
  //     initialData: [] // Start empty for insertion demo
  // }
];

export default AVLTreeContent;
