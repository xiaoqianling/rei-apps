import Anchor, { AnchorItem } from "rei-design/anchor";
import styles from "./index.module.scss";
import { FunctionComponent, useMemo, useRef } from "react";
import { ArticleDetail } from "../type";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { parseBlogAnchors } from "../../slate/markdown/util";
import { FaUser } from "react-icons/fa";
import { LuTag } from "react-icons/lu";
import { MdOutlineDateRange } from "react-icons/md";
import Tooltip from "rei-design/tooltip";
import Tag from "../../slate/tag";
import { SlateMock } from "../../slate/slateEditor/mock";
import SlateRenderer from "./slateRenderer";
import { getArticleDetailByID } from "@/src/api/blog";

/**
export interface AnchorItem {
  id: string;
  title: string;
  children?: AnchorItem[];
  active?: boolean;
  expanded?: boolean;
}
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

  // 内容
  contents: Descendant[];
}
 */

// 文章页面 对应/article/:articleId路由
const Article: FunctionComponent = () => {
  const [headings, setHeadings] = useState<AnchorItem[]>([]);
  const blogRef = useRef<HTMLDivElement>(null);
  const navigation = useNavigate();
  const { articleId } = useParams();
  const [articleInfo, setArticleInfo] = useState<ArticleDetail>();
  const [id, setId] = useState<number>();

  useEffect(() => {
    if (articleId) {
      setId(Number(articleId));
    }
  }, [articleId]);

  useEffect(() => {
    if (typeof id !== "number") return;
    getArticleDetailByID(id).then((res) => {
      setArticleInfo(res);
    });
  }, [id]);

  // 获取所有h1标题元素及其位置
  useEffect(() => {
    const headingData: AnchorItem[] = parseBlogAnchors(blogRef.current);
    setHeadings(headingData);
  }, [blogRef]);

  const handleClickAnchor = (id: string) => {
    navigation(`#${id}`);
  };

  const anchor = <Anchor items={headings} onClick={handleClickAnchor} />;

  const content = useMemo(() => {
    return <SlateRenderer data={SlateMock} />;
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.anchor}>
        <span>此页内容:</span>
        <div className={styles.anchor_list}>{anchor}</div>
      </div>
      <div className={styles.main} ref={blogRef}>
        <header>{articleInfo.title}</header>
        <hr />
        <div className={styles.info}>
          <Tooltip content="作者" className={styles.author}>
            <FaUser />
            <span>{articleInfo.username}</span>
          </Tooltip>
          <Tooltip content="创建时间" className={styles.createAt}>
            <MdOutlineDateRange size={22} />
            <span>{articleInfo.createdAt.toLocaleString()}</span>
          </Tooltip>
          <Tooltip content="标签" className={styles.tag}>
            <LuTag size={24} />
            {articleInfo.tags.map((tag, index) => (
              <Tag key={index} tag={tag}></Tag>
            ))}
          </Tooltip>
        </div>
        <hr />
        <div className={styles.content}>{content}</div>
      </div>
    </div>
  );
};

export default Article;
