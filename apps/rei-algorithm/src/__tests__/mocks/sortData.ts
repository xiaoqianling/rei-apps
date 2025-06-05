export const mockSortData = {
  id: 'bubble-sort',
  title: '冒泡排序',
  description: '冒泡排序是一种简单的排序算法，它重复地遍历要排序的数列，一次比较两个元素，如果它们的顺序错误就把它们交换过来。',
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)'
  },
  spaceComplexity: 'O(1)',
  steps: [
    {
      step: 1,
      array: [64, 34, 25, 12, 22, 11, 90],
      compared: [0, 1],
      swapped: false
    },
    {
      step: 2,
      array: [34, 64, 25, 12, 22, 11, 90],
      compared: [1, 2],
      swapped: true
    },
    {
      step: 3,
      array: [34, 25, 64, 12, 22, 11, 90],
      compared: [2, 3],
      swapped: true
    }
  ],
  code: {
    javascript: `function bubbleSort(arr) {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
    python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr`
  }
}

export const mockAlgorithmList = [
  {
    id: 'bubble-sort',
    title: '冒泡排序',
    category: '排序',
    difficulty: '简单',
    tags: ['基础', '排序', '交换排序']
  },
  {
    id: 'quick-sort',
    title: '快速排序',
    category: '排序',
    difficulty: '中等',
    tags: ['分治', '排序', '交换排序']
  }
]

export const mockPost = {
  id: '1',
  title: '排序算法性能对比分析',
  content: '本文将对常见的排序算法进行性能对比分析...',
  author: {
    id: 'user1',
    name: '张三',
    avatar: 'https://example.com/avatar1.jpg'
  },
  tags: ['排序', '性能分析', '算法'],
  createdAt: '2024-03-20T10:30:00Z',
  updatedAt: '2024-03-20T10:30:00Z',
  likes: 42,
  comments: 15
} 