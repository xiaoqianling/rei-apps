import { isProduction } from "@/src/util/env/env";
import { axiosInstance } from "..";
import { ArticleCardInfo, ArticleDetail } from "@/src/components/community/type";
import { mockAllBlogs, mockBlogDetail } from "./mock";
import {
  transformBlogDetailResponseDTO,
  transformBlogResponseDTO,
} from "./util";

export async function getMockBlog(): Promise<ArticleDetail> {
  return axiosInstance.get("post/1/contents").then((res) => {
    return res.data;
  });
}

export async function getAllBlogs(): Promise<ArticleCardInfo[]> {
  if (isProduction()) {
    return axiosInstance.get("/post/getAllBlogs").then((res) => {
      return transformBlogResponseDTO(res.data);
    });
  } else {
    return Promise.resolve(mockAllBlogs);
  }
}

export async function getArticleDetailByID(id: number): Promise<ArticleDetail> {
  if (isProduction()) {
    return axiosInstance.get(`/post/detail/${id}`).then((res) => {
      console.log(id, res.data);
      return transformBlogDetailResponseDTO(res.data);
    });
  } else {
    return Promise.resolve(mockBlogDetail);
  }
}
