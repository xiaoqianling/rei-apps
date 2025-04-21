import { Descendant } from "slate";

export function transformBlogContent(data: any): Descendant[] {
  if (!data) {
    return [];
  }
  return data.map((block: any) => {
    const metadata = JSON.parse(block.metadata);
    return {
      type: block.type,
      ...metadata,
    };
  });
}
