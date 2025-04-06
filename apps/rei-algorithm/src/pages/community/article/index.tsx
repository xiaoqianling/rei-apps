import { useParams } from "react-router-dom";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import { getBlogDetailByID } from "@/src/api/blog";
import { BlogDetail } from "@/src/components/community/type";
import { Blog } from "@/src/components/community";

/**
 * TODO: 空路由反馈
 */
function BlogPage() {
  const params = useParams();
  const [blog, setBlog] = useState<BlogDetail>();
  const [id, setId] = useState<number>();

  useEffect(() => {
    if (params.id) {
      setId(Number(params.id));
    }
  }, [params]);

  useEffect(() => {
    if (typeof id !== "number") return;
    getBlogDetailByID(id).then((res) => {
      console.log("id: ", id, " ", res);
      setBlog(res);
    });
  }, [id]);

  return blog && <Blog blog={blog} />;
}

export default BlogPage;
