import {
  PostPreview,
  CommunityUser,
  CommunityTag,
  UserProfileData,
  ArticleData,
  CommentData,
} from "./types";

// --- Mock Users ---
export const mockUsers: Record<string, CommunityUser> = {
  user1: { id: "user1", name: "算法爱好者", avatarUrl: "/avatars/avatar1.png" },
  user2: {
    id: "user2",
    name: "数据结构大师",
    avatarUrl: "/avatars/avatar2.png",
  },
  user3: {
    id: "user3",
    name: "代码可视化者",
    avatarUrl: "/avatars/avatar3.png",
  },
  admin: { id: "admin", name: "官方管理员", avatarUrl: "/avatars/admin.png" },
};

// --- Mock Tags ---
export const mockTags: Record<string, CommunityTag> = {
  tag1: { id: "tag1", name: "排序算法" },
  tag2: { id: "tag2", name: "React" },
  tag3: { id: "tag3", name: "可视化技巧" },
  tag4: { id: "tag4", name: "提问" },
  tag5: { id: "tag5", name: "经验分享" },
  tag6: { id: "tag6", name: "树结构" },
};

// --- Mock Posts ---
export const mockPosts: PostPreview[] = [
  {
    id: "post1",
    title: "深入理解快速排序的可视化实现",
    author: mockUsers.user1,
    excerpt:
      "大家好，今天我用这个平台的编辑器做了一个快速排序的可视化，希望能帮助大家更好地理解其分区过程...",
    tags: [mockTags.tag1, mockTags.tag3, mockTags.tag5],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    likes: 25,
    commentsCount: 5,
  },
  {
    id: "post2",
    title: "如何在 React 项目中集成可视化组件？",
    author: mockUsers.user2,
    excerpt:
      "我在尝试将这里的可视化组件嵌入到我的项目中时遇到了一些问题，主要是关于 API 调用和状态管理...有人能分享下经验吗？",
    tags: [mockTags.tag2, mockTags.tag4],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    likes: 10,
    commentsCount: 8,
  },
  {
    id: "post3",
    title: "分享一个我自己实现的二叉搜索树动态插入/删除可视化",
    author: mockUsers.user3,
    excerpt:
      "基于平台提供的 API，我扩展实现了一个二叉搜索树的动态可视化，包括插入、删除和查找高亮，欢迎大家体验和提出改进意见！",
    tags: [mockTags.tag6, mockTags.tag3, mockTags.tag5],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    likes: 42,
    commentsCount: 12,
  },
  {
    id: "post4",
    title: "社区功能建议与反馈",
    author: mockUsers.admin,
    excerpt:
      "大家好，我们正在积极开发和完善社区功能，欢迎大家在此帖下提出宝贵的建议和反馈，帮助我们共同建设更好的交流平台！",
    tags: [mockTags.tag4],
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    likes: 5,
    commentsCount: 2,
  },
];

// --- Mock Full Article Data ---
export const mockArticleData: Record<string, ArticleData> = {
  post1: {
    id: "post1",
    title: "编辑器教程",
    author: mockUsers.user1,
    tags: [mockTags.tag1, mockTags.tag3, mockTags.tag5],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    likes: 25,
    dislikes: 2,
    views: 158,
    commentsCount: 2,
    content: `
      <h1 id="intro">引言</h1>
      <p>快速排序（Quicksort）是一种非常高效的排序算法，由Tony Hoare发明。它的基本思想是采用分治策略...</p>
      <h2 id="partition">分区操作 (Partition)</h2>
      <p>快速排序的核心在于分区操作。选取一个基准元素（pivot），将数组分为两部分：一部分小于基准，另一部分大于基准。</p>
      <pre><code>// 伪代码
function partition(arr, low, high) {
  pivot = arr[high]
  i = low - 1
  for j = low to high - 1 {
    if arr[j] < pivot {
      i++
      swap arr[i], arr[j]
    }
  }
  swap arr[i+1], arr[high]
  return i + 1
}</code></pre>
      <h3 id="pivot-choice">基准选择</h3>
      <p>基准的选择会影响算法的性能。常见的选择有：第一个元素、最后一个元素、中间元素、随机元素。</p>
      <h2 id="visualization">可视化展示</h2>
      <p>下面是一个使用本平台API实现的交互式可视化组件：</p>
      <div class="visualization-placeholder">[嵌入的可视化组件]</div>
      <p>你可以点击"下一步"观察每次分区的过程，高亮显示了当前的基准和比较的元素。</p>
      <h2 id="conclusion">总结</h2>
      <p>通过可视化，我们可以更直观地理解快速排序的工作原理，特别是递归和分区的细节。</p>
    `, // Placeholder for actual Slate-rendered HTML
  },
  // Add mock data for other posts if needed
};

// --- Mock Comments ---
export const mockComments: Record<string, CommentData[]> = {
  post1: [
    {
      id: "comment1",
      author: mockUsers.user2,
      content: "这个可视化做得真棒！分区过程一目了然。",
      createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 90 mins ago
    },
    {
      id: "comment2",
      author: mockUsers.user3,
      content: "感谢分享！请问基准选择策略对可视化的影响大吗？",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    },
    {
      id: "comment3",
      author: mockUsers.admin,
      content: "基准选择策略对性能影响不大，通常选择最后一个元素或随机元素。",
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
      parentId: "comment2", // Nested comment
    },
  ],
  post2: [], // Example with no comments
  post3: [],
  post4: [],
};

// --- Mock User Profiles ---
export const mockUserProfiles: Record<string, UserProfileData> = {
  user1: {
    ...mockUsers.user1,
    bio: "热衷于算法学习和可视化分享。",
    joinDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
    posts: [mockPosts[0]],
    postCount: 1,
  },
  user2: {
    ...mockUsers.user2,
    bio: "专注于数据结构和后端技术。",
    joinDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(), // 60 days ago
    posts: [mockPosts[1]],
    postCount: 1,
  },
  user3: {
    ...mockUsers.user3,
    bio: "探索代码可视化的无限可能。",
    joinDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days ago
    posts: [mockPosts[2]],
    postCount: 1,
  },
  admin: {
    ...mockUsers.admin,
    bio: "网站管理员，致力于打造最佳学习社区。",
    joinDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 100).toISOString(), // 100 days ago
    posts: [mockPosts[3]],
    postCount: 1,
  },
};
