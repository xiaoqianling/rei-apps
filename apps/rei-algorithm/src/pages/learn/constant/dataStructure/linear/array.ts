import { TipLevelsTypes } from "@/src/components";
import { Descendant } from "slate";

export const ArrayContent: Descendant[] = [
  {
    type: "h1",
    children: [{ text: "数组 (Array)" }],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "数组是最基础且广泛使用的数据结构之一。它将元素存储在",
      },
      { text: "连续的内存位置", bold: true },
      {
        text: "中，允许通过索引（通常是基于0的整数）快速访问任何元素。",
      },
    ],
  },
  {
    type: "h2",
    children: [{ text: "核心特性" }],
  },
  {
    type: "bulleted-list",
    children: [
      {
        type: "list-item",
        children: [
          { text: "连续内存:", bold: true },
          { text: " 元素物理上相邻存储，这通常有利于缓存性能。" },
        ],
      },
      {
        type: "list-item",
        children: [
          { text: "固定大小 (静态数组):", bold: true },
          {
            text: " 传统数组大小在创建时确定，无法改变（如 C/C++ 中的数组）。",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          { text: "动态大小 (动态数组):", bold: true },
          {
            text: " 许多现代语言（如 Python 的 list, Java 的 ArrayList, C++ 的 vector）提供动态数组，可以自动调整大小，但扩容/缩容可能涉及性能开销。",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          { text: "随机访问:", bold: true },
          { text: " 通过索引访问元素非常快，时间复杂度为 O(1)。" },
        ],
      },
    ],
  },
  {
    type: "h2",
    children: [{ text: "基本操作与时间复杂度" }],
  },
  {
    type: "bulleted-list",
    children: [
      {
        type: "list-item",
        children: [
          { text: "访问 (Access):", bold: true },
          { text: " O(1) - 直接通过索引计算地址。" },
        ],
      },
      {
        type: "list-item",
        children: [
          { text: "查找 (Search):", bold: true },
          {
            text: " O(n) - 平均情况下需要遍历数组查找特定值（除非数组有序，可用二分查找 O(log n)）。",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          { text: "插入 (Insertion):", bold: true },
          {
            text: " O(n) - 在开头或中间插入需要移动后续元素。在末尾插入（如果容量足够）通常是 O(1)。动态数组扩容时可能是摊销 O(1)。",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          { text: "删除 (Deletion):", bold: true },
          {
            text: " O(n) - 在开头或中间删除需要移动后续元素。删除末尾元素通常是 O(1)。",
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
        text: "摊销 O(1): 动态数组在末尾插入/删除通常很快 (O(1))，但偶尔需要调整容量（例如加倍或减半），这会产生较大的瞬时开销 (O(n))。将这些开销分摊到多次操作上，平均时间复杂度接近 O(1)。",
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
    code: `// 创建数组
let fruits = ["Apple", "Banana", "Cherry"];

// 访问元素 (O(1))
console.log(fruits[1]); // 输出: Banana

// 查找元素 (O(n))
console.log(fruits.indexOf("Cherry")); // 输出: 2
console.log(fruits.includes("Orange")); // 输出: false

// 插入元素
// 末尾插入 (通常 O(1) 摊销)
fruits.push("Orange"); 
console.log(fruits); // ["Apple", "Banana", "Cherry", "Orange"]

// 开头插入 (O(n))
fruits.unshift("Mango");
console.log(fruits); // ["Mango", "Apple", "Banana", "Cherry", "Orange"]

// 中间插入 (O(n))
fruits.splice(2, 0, "Strawberry"); // 在索引2处插入
console.log(fruits); // ["Mango", "Apple", "Strawberry", "Banana", "Cherry", "Orange"]

// 删除元素
// 末尾删除 (O(1))
fruits.pop();
console.log(fruits); // ["Mango", "Apple", "Strawberry", "Banana", "Cherry"]

// 开头删除 (O(n))
fruits.shift();
console.log(fruits); // ["Apple", "Strawberry", "Banana", "Cherry"]

// 中间删除 (O(n))
fruits.splice(1, 1); // 从索引1处删除1个元素
console.log(fruits); // ["Apple", "Banana", "Cherry"]

// 遍历数组 (O(n))
fruits.forEach(fruit => {
  console.log(fruit);
});`,
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
        children: [{ text: "快速随机访问 (O(1))。" }],
      },
      {
        type: "list-item",
        children: [{ text: "内存局部性好，有利于 CPU 缓存。" }],
      },
      {
        type: "list-item",
        children: [{ text: "实现简单直观。" }],
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
        children: [
          { text: "插入和删除操作（尤其是在开头和中间）效率低 (O(n))。" },
        ],
      },
      {
        type: "list-item",
        children: [{ text: "静态数组大小固定，可能造成空间浪费或不足。" }],
      },
      {
        type: "list-item",
        children: [{ text: "动态数组的扩容/缩容可能导致性能抖动。" }],
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
        text: "下面的可视化组件演示了向数组中插入和删除元素的过程，注意观察元素移动情况。",
      },
    ],
  },
  // {
  //   type: "visualizer", // 假设的可视化组件类型
  //   algorithmId: "array-operations", // 假设的算法标识符
  //   initialData: [10, 20, 30, 40, 50], // 假设的初始数据
  // },
];

// Add a default export for easier dynamic import if needed
export default ArrayContent;
