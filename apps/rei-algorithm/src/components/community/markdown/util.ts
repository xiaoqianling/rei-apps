import { BlogPost } from "../type/post";

export interface Heading {
  level: number; // 标题级别 (1, 2, 3)
  text: string; // 标题文本
  anchor: string; // 锚点 ID
}

// 新增函数：解析 Markdown 的前三级标题
export const parseMarkdownHeadings = (markdown: string): Heading[] => {
  const headingRegex = /^#{1,3}\s+(.+)$/gm; // 匹配 1-3 级标题
  const headings: Heading[] = [];
  let match;

  // 去除每行前面的空格
  const cleanedMarkdown = markdown.replace(/^\s+/gm, "");

  while ((match = headingRegex.exec(cleanedMarkdown)) !== null) {
    const level = match[0].match(/#/g)?.length || 0; // 标题级别
    const text = match[1].trim(); // 标题文本
    const anchor = text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, "-") // 生成锚点 ID, 只保留中文和英文
      .replace(/^-|-$/g, "");

    if (level <= 3) {
      headings.push({ level, text, anchor });
    }
  }

  return headings;
};

// 新增函数：解析 BlogPost 对象中的所有 Markdown 内容
export const parseBlogPostHeadings = (post: BlogPost): Heading[] => {
  const headings: Heading[] = [];

  post.contents.forEach((content) => {
    if (content.type === "markdown") {
      const markdownHeadings = parseMarkdownHeadings(content.content);
      headings.push(...markdownHeadings);
    }
  });

  return headings;
};
