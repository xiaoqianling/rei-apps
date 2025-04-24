import { TipLevelsTypes } from "@/src/components";
import { Descendant } from "slate";

export const LinkedListContent: Descendant[] = [
  {
    type: "h1",
    children: [{ text: "链表 (Linked List)" }],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "链表是另一种重要的线性数据结构。与数组不同，链表的元素（称为",
      },
      { text: "节点 Nodes", bold: true },
      {
        text: "）在内存中不必是连续存储的。每个节点包含数据以及一个或多个指向其他节点（通常是下一个节点）的引用（指针）。",
      },
    ],
  },
  {
    type: "mermaid", // 假设的Mermaid块类型
    children: [
      {
        text: `graph LR
    A[Node 1 | Data: 10 | Next: B] --> B[Node 2 | Data: 20 | Next: C];
    B --> C[Node 3 | Data: 30 | Next: null];`,
      },
    ],
  },
  {
    type: "h2",
    children: [{ text: "核心特性与类型" }],
  },
  {
    type: "bulleted-list",
    children: [
      {
        type: "list-item",
        children: [
          { text: "非连续内存:", bold: true },
          { text: " 节点可以在内存中分散存储。" },
        ],
      },
      {
        type: "list-item",
        children: [
          { text: "动态大小:", bold: true },
          {
            text: " 链表天然支持动态增删节点，无需像动态数组那样进行复杂的扩容/缩容。",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          { text: "顺序访问:", bold: true },
          {
            text: " 访问特定位置的元素通常需要从头节点开始遍历，时间复杂度为 O(n)。",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          { text: "类型:", bold: true },
          {
            text: " 主要有单向链表 (Singly Linked List，节点只有指向下一个节点的指针)、双向链表 (Doubly Linked List，节点有指向上一个和下一个节点的指针) 和循环链表 (Circular Linked List，尾节点指向头节点)。",
          },
        ],
      },
    ],
  },
  {
    type: "h2",
    children: [{ text: "基本操作与时间复杂度 (单向链表)" }],
  },
  {
    type: "bulleted-list",
    children: [
      {
        type: "list-item",
        children: [
          { text: "访问 (Access):", bold: true },
          { text: " O(n) - 需要从头遍历。" },
        ],
      },
      {
        type: "list-item",
        children: [
          { text: "查找 (Search):", bold: true },
          { text: " O(n) - 需要从头遍历。" },
        ],
      },
      {
        type: "list-item",
        children: [
          { text: "插入 (Insertion):", bold: true },
          {
            text: " 在头部插入是 O(1)。在尾部插入需要遍历到尾部，是 O(n)（除非维护尾指针，则为 O(1)）。在中间插入，找到位置需要 O(n)，插入操作本身是 O(1)。",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          { text: "删除 (Deletion):", bold: true },
          {
            text: " 删除头部是 O(1)。删除尾部或中间元素，需要找到前一个节点，是 O(n)。",
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
        text: "双向链表在某些删除和插入操作上（如果已知要操作的节点）会更高效，因为它能轻松访问前驱节点，但每个节点需要额外的空间存储前驱指针。",
      },
    ],
  },
  {
    type: "h2",
    children: [{ text: "代码示例 (JavaScript - 单向链表)" }],
  },
  {
    type: "multi-code-block", // 假设的多语言块类型
    content: [
      {
        language: "js",
        label: "JavaScript",
        code: `class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null; // Optional: Maintain tail pointer
    this.length = 0;
  }

  // Insert at the end (O(1) with tail pointer)
  append(value) {
    const newNode = new ListNode(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
    return this;
  }

  // Insert at the beginning (O(1))
  prepend(value) {
    const newNode = new ListNode(value);
    newNode.next = this.head;
    this.head = newNode;
    if (!this.tail) { // If list was empty
        this.tail = newNode;
    }
    this.length++;
    return this;
  }

  // Traverse and print
  printList() {
    const nodes = [];
    let currentNode = this.head;
    while (currentNode) {
      nodes.push(currentNode.value);
      currentNode = currentNode.next;
    }
    console.log(nodes.join(' -> '));
  }
  
  // ... (Add methods for insertAt, remove, search etc.)
}

const myList = new LinkedList();
myList.append(10).append(20).prepend(5);
myList.printList(); // Output: 5 -> 10 -> 20`,
      },
      {
        language: "python",
        label: "Python",
        code: `class ListNode:
    def __init__(self, value=0, next=None):
        self.value = value
        self.next = next

class LinkedList:
    def __init__(self):
        self.head = None
        self.tail = None # Optional
        self.length = 0

    def append(self, value):
        new_node = ListNode(value)
        if not self.head:
            self.head = new_node
            self.tail = new_node
        else:
            self.tail.next = new_node
            self.tail = new_node
        self.length += 1
        return self

    def prepend(self, value):
        new_node = ListNode(value)
        new_node.next = self.head
        self.head = new_node
        if not self.tail:
            self.tail = new_node
        self.length += 1
        return self
        
    def print_list(self):
        nodes = []
        current_node = self.head
        while current_node:
            nodes.append(str(current_node.value))
            current_node = current_node.next
        print(" -> ".join(nodes))

# Example usage
my_list = LinkedList()
my_list.append(10).append(20).prepend(5)
my_list.print_list() # Output: 5 -> 10 -> 20
`,
      },
    ],
    children: [{ text: "" }],
  },
  {
    type: "h2",
    children: [{ text: "优缺点" }],
  },
  {
    type: "h3",
    children: [{ text: "优点" }],
  },
  {
    type: "numbered-list",
    children: [
      {
        type: "list-item",
        children: [
          {
            text: "插入和删除操作通常比数组高效（尤其是当操作位置已知或在两端时），因为只需要修改指针。",
          },
        ],
      },
      {
        type: "list-item",
        children: [{ text: "大小灵活，按需分配内存，不易造成空间浪费。" }],
      },
    ],
  },
  {
    type: "h3",
    children: [{ text: "缺点" }],
  },
  {
    type: "numbered-list",
    children: [
      {
        type: "list-item",
        children: [{ text: "访问和查找元素效率低 (O(n))，无法随机访问。" }],
      },
      {
        type: "list-item",
        children: [{ text: "需要额外的空间存储指针。" }],
      },
      {
        type: "list-item",
        children: [{ text: "内存非连续，可能不如数组对 CPU 缓存友好。" }],
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
      { text: "下面的可视化组件演示了向链表头部和尾部插入节点的过程。" },
    ],
  },
  // {
  //   type: "visualizer",
  //   algorithmId: "linkedlist-operations",
  //   initialData: null, // 假设链表可视化从空开始
  // },
];

export default LinkedListContent;
