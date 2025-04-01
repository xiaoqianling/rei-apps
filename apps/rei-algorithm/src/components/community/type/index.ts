import { BlogContent } from "./content";
import { TagTypes } from "../components/post/tag/type";

export interface BlogPost {
  // 唯一id
  id: string;
  // 标题
  title: string;
  username: string;
  // 用户主页链接
  userLink?: string;
  // 内容
  contents: BlogContent[];
  // 创建时间
  createdAt: Date;
  // 更新时间
  updatedAt: Date;
  // 标签
  tags: TagTypes[];
}
