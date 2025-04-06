import { BlogContent } from "@/src/components/community/type/content";

export function transformBlogContent(data: any): BlogContent[] {
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
