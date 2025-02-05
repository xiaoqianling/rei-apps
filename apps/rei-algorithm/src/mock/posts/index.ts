export interface Post {
  _id: string; // 帖子ID
  userId: string; // 发布该帖子的用户ID
  title: string; // 帖子标题
  content: string; // 帖子内容（Markdown），包含组件占位符
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
  markdown: boolean; // 是否是Markdown格式
  attachments: Attachment[]; // 附件数组
}

export interface Attachment {
  id: string; // 组件的ID
  type: "chart" | "image"; // 组件类型（图表或图片） TODO: enum
  data: ChartData | string; // 组件的数据，图表数据或图片URL
}

export interface ChartData {
  labels: string[]; // 图表标签
  datasets: Dataset[]; // 数据集数组
}

export interface Dataset {
  label: string; // 数据集标签
  data: number[]; // 数据集数据
}

// 模拟用户帖子
export function getPost() {
  return {
    _id: "post_id_12345", // 帖子ID
    userId: "user_id_67890", // 发布该帖子的用户ID
    title: "My first post", // 帖子标题
    content: "This is some text. {{chart_1}} More text. {{image_1}}", // 帖子内容（Markdown），包含组件占位符
    createdAt: "2025-02-05T10:00:00Z", // 创建时间
    updatedAt: "2025-02-05T10:00:00Z", // 更新时间
    markdown: true, // 是否是Markdown格式
    attachments: [
      {
        id: "chart_1", // 组件的ID
        type: "chart", // 组件类型（图表）
        data: {
          labels: ["Jan", "Feb", "Mar"],
          datasets: [
            {
              label: "Revenue",
              data: [100, 200, 300],
            },
          ],
        },
      },
      {
        id: "image_1", // 组件的ID
        type: "image", // 组件类型（图片）
        data: "https://example.com/images/my-image.png", // 图片URL
      },
    ],
  };
}

export function getMarkdown() {
  return `# My first post`;
}
