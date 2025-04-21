import { useParams } from "react-router-dom";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import { getBlogDetailByID } from "@/src/api/blog";
import { BlogDetail } from "@/src/components/community/type";
import { Blog } from "@/src/components/community";

/**
 * TODO: 空路由反馈
 */
function BlogArticle() {
  const { articleId } = useParams();
  const [blog, setBlog] = useState<BlogDetail>();
  const [id, setId] = useState<number>();

  useEffect(() => {
    if (articleId) {
      setId(Number(articleId));
    }
  }, [articleId]);

  useEffect(() => {
    if (typeof id !== "number") return;
    getBlogDetailByID(id).then((res) => {
      setBlog(res);
    });
  }, [id]);

  return blog && <Blog blog={blog} />;
}

export default BlogArticle;
