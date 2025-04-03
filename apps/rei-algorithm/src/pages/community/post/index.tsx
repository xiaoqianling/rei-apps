import { useParams } from "react-router-dom";
import styles from "./index.module.scss";
import { useEffect } from "react";
import { Post } from "@/src/components/community";
import { post1 } from "@/src/components/community/type/mock";

/**
 *
 * @returns
 */
function PostPage() {
  const params = useParams();

  useEffect(() => {
    // TODO: 调用API获取帖子数据
    // fetch(`/api/posts/${params.id}`)
  }, [params]);

  return <Post post={post1} />;
}

export default PostPage;
