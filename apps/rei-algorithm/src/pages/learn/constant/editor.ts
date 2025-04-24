import { Descendant } from "slate";

export const LearnEditor: Descendant[] = [
  { type: "h1", children: [{ text: "学习编辑器" }] },
  {
    type: "paragraph",
    children: [
      {
        text: "编辑器是一个非常重要的工具，它可以帮助我们更好地管理和编辑文本。",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      { text: "在学习编辑器的过程中，我们需要掌握一些基本的概念和技巧。" },
    ],
  },
  {
    type: "h2",
    children: [{ text: "编辑器的基本概念" }],
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
];
