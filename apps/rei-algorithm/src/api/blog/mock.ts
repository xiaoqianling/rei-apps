import { TagTypes } from "@/src/components/slate/tag/type";
import { ArticleCardInfo, ArticleDetail } from "@/src/components/community/type";

export const mockAllBlogs: ArticleCardInfo[] = [
  {
    pid: 777777777,
    title: "Dev Blog",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date(),
    tags: [TagTypes.TECH],
    uid: 11111111,
    username: "Dev Username Rei",
  },
];

export const mockBlogDetail: ArticleDetail = {
  pid: 0,
  title: "Dev Blog",
  createdAt: new Date(),
  tags: [],
  uid: 0,
  username: "Dev Username Rei",
  contents: [],
};
