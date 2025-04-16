import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import BlogCard from "@/src/components/community/components/blog/card";
import { getAllBlogs } from "@/src/api/blog";
import { BlogCardInfo } from "@/src/components/community/type";
import UserCard from "@/src/components/community/components/userCard";

function CommunityPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [blogs, setBlogs] = useState<BlogCardInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // 获取推荐帖子
  useEffect(() => {
    getAllBlogs().then((data) => {
      setBlogs(data);
    });
  }, []);

  // 处理搜索
  const handleSearch = () => {
    // TODO: 实现搜索逻辑
  };

  // 跳转到发帖页面
  const goToCreatePost = () => {
    navigate(`${location.pathname}/create-post`);
  };

  return (
    <div className={styles.container}>
      {/* 分类导航 */}
      <aside className={styles.sidebar}>
        <h3>分类</h3>
        <ul>
          <li>技术讨论</li>
          <li>项目分享</li>
          <li>求职招聘</li>
        </ul>
      </aside>

      {/* 主内容区域 */}
      <div className={styles.mainContent}>
        {/* 搜索栏 */}
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="搜索帖子..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>搜索</button>
        </div>
        {/* 帖子推荐 */}
        <section className={styles.postSection}>
          <h2>推荐帖子</h2>
          <div className={styles.postList}>
            {blogs.map((post) => (
              <BlogCard key={post.pid} blog={post} />
            ))}
          </div>
        </section>
      </div>

      {/* 用户卡片 */}
      <UserCard onClickCreate={goToCreatePost} />
    </div>
  );
}

export default CommunityPage;
