import Anchor, { AnchorItem } from "rei-design/anchor";
import styles from "./index.module.scss";
import { FunctionComponent, useRef } from "react";
import { BlogDetail } from "../../community/type";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import BlogContent from "../blogContent";
import { parseBlogAnchors } from "../markdown/util";

interface BlogProps {
  blog: BlogDetail;
}

// 把post渲染为一个页面 不负责数据获取
const Blog: FunctionComponent<BlogProps> = ({ blog }) => {
  const [headings, setHeadings] = useState<AnchorItem[]>([]);
  const blogRef = useRef<HTMLDivElement>(null);
  const navigation = useNavigate();

  // 获取所有h1标题元素及其位置
  useEffect(() => {
    console.log("!!! Blog useEffect重新计算！");
    const headingData: AnchorItem[] = parseBlogAnchors(blogRef.current);
    console.log("headingData: ", headingData);
    setHeadings(headingData);
  }, [blogRef]);

  const handleClickAnchor = (id: string) => {
    navigation(`#${id}`);
  };

  const content = <Anchor items={headings} onClick={handleClickAnchor} />;

  return (
    <div className={styles.container}>
      <div className={styles.anchor}>
        <span>此页内容:</span>
        <div className={styles.anchor_list}>{content}</div>
      </div>
      {blog && <BlogContent blog={blog} ref={blogRef} />}
    </div>
  );
};

export default Blog;
