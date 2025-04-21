import { TagTypes } from "../../slate/tag/type";
import { Descendant } from "slate";

// 一篇文章的全部信息
export interface ArticleDetail {
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

  // 内容
  contents: Descendant[];
}

// 一篇文章的简略信息(推荐卡片)
export interface ArticleCardInfo {
  pid: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  tags: TagTypes[];

  uid: number;
  username: string;
}
