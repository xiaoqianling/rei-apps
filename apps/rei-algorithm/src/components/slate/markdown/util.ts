import { AnchorItem } from "rei-design/anchor";

// 按层级解析h1-h3
export const parseBlogAnchors = (dom: HTMLDivElement | null): AnchorItem[] => {
  if (!dom) {
    return [];
  }

  const anchors: AnchorItem[] = [];
  // 获取所有h1-h3标题元素，保持DOM顺序
  const headings = dom.querySelectorAll("h1, h2, h3");

  // 使用栈结构维护层级关系
  const stack: { level: number; children?: AnchorItem[] }[] = [
    { level: 0, children: anchors }, // 根节点
  ];

  headings.forEach((heading) => {
    const level = parseInt(heading.tagName[1], 10);
    const item: AnchorItem = {
      id: heading.id,
      title: heading.textContent || "",
      children: [],
    };

    // 弹出不匹配的层级直到找到父级
    while (stack.length > 1 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    // 将当前项添加到父级children
    const currentLevel = stack[stack.length - 1];
    currentLevel.children?.push(item);

    // 推入栈作为新的父级
    if (level > currentLevel.level) {
      stack.push({ level, children: item.children });
    }
  });

  // 过滤空children属性
  return anchors.map((anchor) => ({
    ...anchor,
    children: anchor.children?.length ? anchor.children : undefined,
  }));
};
