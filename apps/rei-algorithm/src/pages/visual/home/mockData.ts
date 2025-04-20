import { AlgoCardData } from "./types";

export const mockAlgoData: AlgoCardData[] = [
  {
    id: "bubble",
    title: "冒泡排序 (Bubble Sort)",
    description:
      "一种简单的排序算法。它重复地走访过要排序的数列，一次比较两个元素，如果他们的顺序错误就把他们交换过来。走访数列的工作是重复地进行直到没有再需要交换，也就是说该数列已经排序完成。",
    tags: ["排序", "迭代", "官方", "热门"],
    author: "官方",
    category: "排序",
  },
  {
    id: "merge",
    title: "归并排序 (Merge Sort)",
    description:
      "建立在归并操作上的一种有效的排序算法。该算法是采用分治法的一个非常典型的应用。将已有序的子序列合并，得到完全有序的序列。",
    tags: ["排序", "递归", "分治", "官方"],
    author: "官方",
    category: "排序",
  },
  {
    id: "quick",
    title: "快速排序 (Quick Sort)",
    description:
      "通过一趟排序将待排记录分隔成独立的两部分，其中一部分记录的关键字均比另一部分的关键字小，则可分别对这两部分记录继续进行排序，以达到整个序列有序。",
    tags: ["排序", "递归", "分治", "官方", "热门"],
    author: "官方",
    category: "排序",
  },
  {
    id: "binary-search",
    title: "二分查找 (Binary Search)",
    description:
      "也称折半查找，是一种在有序数组中查找某一特定元素的搜索算法。搜索过程从数组的中间元素开始，如果中间元素正好是要查找的元素，则搜索过程结束；如果某一特定元素大于或者小于中间元素，则在数组大于或小于中间元素的那一半中查找，而且跟开始一样从中间元素开始比较。",
    tags: ["搜索", "迭代", "官方"],
    author: "官方",
    category: "搜索",
  },
  {
    id: "bfs",
    title: "广度优先搜索 (BFS)",
    description:
      "一种图形搜索算法。简单的说，BFS是从根节点开始，沿着树的宽度遍历树的节点。如果所有节点均被访问，则算法中止。BFS同样适用于图的搜索。",
    tags: ["图", "树", "搜索", "迭代", "官方"],
    author: "官方",
    category: "图算法",
  },
  {
    id: "dfs",
    title: "深度优先搜索 (DFS)",
    description:
      "一种用于遍历或搜索树或图的算法。这个算法会尽可能深的搜索树的分支。当节点v的所在边都己被探寻过，搜索将回溯到发现节点v的那条边的起始节点。这一过程一直进行到已发现从源节点可达的所有节点为止。",
    tags: ["图", "树", "搜索", "递归", "官方"],
    author: "官方",
    category: "图算法",
  },
  {
    id: "user-algo-1",
    title: "用户算法示例",
    description:
      "这是一个用户上传的算法可视化示例，展示了某种自定义的数据结构操作。",
    tags: ["用户", "最新"],
    author: "User123",
    category: "其他",
  },
];
