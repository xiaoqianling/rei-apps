import React, { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { MenuItem } from "rei-design/menu/type";
import SlateRenderer from "@/src/components/community/article/slateRenderer";
// Import the constants using the index file for cleaner imports
import {
  LearnEditor,
  ArrayContent,
  LinkedListContent,
  AVLTreeContent,
  BinaryTreeContent,
  BSTContent,
  // BinaryTreeContent,
  // BSTContent,
  // AVLTreeContent,
} from "./constant";
import ReiNotFound from "../static/not-found";

// 附加到/learn/下的所有路由
export const learnRouter: RouteObject[] = [
  {
    path: "", // Base path for learn, might render the layout
    children: [
      // Define a default/index route if needed, maybe showing "Start" content?
      // { index: true, element: <SlateRenderer data={StartContent} /> },
      {
        path: "editor", // Relative to /learn
        element: <SlateRenderer data={LearnEditor} />,
      },
      // Data Structure Routes
      {
        path: "dataStructure/linear/array",
        element: <SlateRenderer data={ArrayContent} />,
      },
      {
        path: "dataStructure/linear/linked-list",
        element: <SlateRenderer data={LinkedListContent} />,
      },
      {
        path: "dataStructure/tree/binary-tree",
        element: <SlateRenderer data={BinaryTreeContent} />,
      },
      {
        path: "dataStructure/tree/binary-search-tree",
        element: <SlateRenderer data={BSTContent} />,
      },
      {
        path: "dataStructure/tree/avl-tree",
        element: <SlateRenderer data={AVLTreeContent} />,
      },
      // Add placeholders for Algorithm routes if you want them navigable
      {
        path: "algorithm/sort",
        element: <div>排序页面内容待添加...</div>, // Placeholder
      },
      {
        path: "algorithm/search",
        element: <div>搜索页面内容待添加...</div>, // Placeholder
      },
      {
        path: "algorithm/greedy",
        element: <div>贪心页面内容待添加...</div>, // Placeholder
      },
      {
        path: "practice",
        element: <div>算法实战页面内容待添加...</div>, // Placeholder
      },
      // Fallback for unmatched routes under /learn
      {
        path: "*",
        element: <ReiNotFound />,
      },
    ],
  },
];

// 渲染到menu的结构 应该和路由一致
export const learnMenuData: MenuItem[] = [
  {
    path: "",
    label: "开始",
    endPoint: true,
  },
  {
    path: "dataStructure",
    label: "数据结构基础",
    subItems: [
      {
        path: "linear",
        label: "线性表",
        subItems: [
          {
            path: "array",
            label: "数组",
          },
          {
            path: "linked-list",
            label: "链表",
          },
        ],
      },
      {
        path: "tree",
        label: "树",
        subItems: [
          {
            path: "binary-tree",
            label: "二叉树",
          },
          {
            path: "binary-search-tree",
            label: "二叉搜索树",
          },
          {
            path: "avl-tree",
            label: "AVL树",
          },
        ],
      },
    ],
  },
  {
    path: "algorithm",
    label: "算法基础",
    subItems: [
      {
        path: "sort",
        label: "排序",
      },
      {
        path: "search",
        label: "搜索",
      },
      {
        path: "greedy",
        label: "贪心",
      },
    ],
  },
  {
    path: "practice",
    label: "算法实战",
  },
  {
    path: "editor",
    label: "了解编辑器",
  },
];
