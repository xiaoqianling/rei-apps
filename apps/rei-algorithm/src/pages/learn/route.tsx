import { RouteObject } from "react-router-dom";
import { MenuItem } from "rei-design/menu/type";

// 附加到/docs/下的所有路由
export const learnRouter: RouteObject[] = [
  {
    path: "",
    element: <>learnRouter</>,
    index: true,
  },
  {
    path: "*",
    element: "404",
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
];
