import { BlogContent } from "./content";
import { TagTypes } from "../components/blog/tag/type";

// 一篇文章的全部信息
export interface BlogDetail {
  // 唯一id
  pid: number;
  title: string;
  // 创建时间
  createdAt: Date;
  // 更新时间
  updatedAt?: Date;
  // 标签
  tags: TagTypes[];

  uid: number;
  username: string;
  // 用户主页链接
  userLink?: string;

  // 内容
  contents: BlogContent[];
}

// 一篇文章的简略信息(推荐卡片)
export interface BlogCardInfo {
  pid: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  tags: TagTypes[];

  uid: number;
  username: string;
}
