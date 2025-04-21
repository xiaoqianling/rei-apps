import { ArticleCardInfo, ArticleDetail } from "@/src/components/community/type";
import { transformBlogContent } from "../contentBlock/util";

export function transformBlogResponseDTO(data: any): ArticleCardInfo[] {
  if (!data) {
    return [];
  }
  return data.map((post: any) => ({
    pid: post.id,
    title: post.title,
    createdAt: new Date(post.createTime),
    updatedAt: new Date(post.updateTime),
    tags: post.tags ?? [],
    uid: post.uid,
    username: post.username,
  }));
}

export function transformBlogDetailResponseDTO(data: any): ArticleDetail {
  const ret: ArticleDetail = {
    pid: data.pid,
    title: data.title,
    createdAt: new Date(data.createTime),
    tags: data.tags ?? [],
    uid: data.uid,
    username: data.username,
    contents: transformBlogContent(data.contentBlocks),
    updatedAt: data.updateTime,
  };
  return ret;
}
