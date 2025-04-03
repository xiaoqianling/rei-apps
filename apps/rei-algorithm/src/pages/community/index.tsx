import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import { BlogPost } from "@/src/components/community/type";
import { post1 } from "@/src/components/community/type/mock";
import PostCard from "@/src/components/community/components/post/card";

function CommunityPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([post1]);
  const [searchQuery, setSearchQuery] = useState("");

  // 获取推荐帖子
  useEffect(() => {
    // TODO: 调用API获取帖子数据
    // fetch('/api/posts')
    //   .then(res => res.json())
    //   .then(data => setPosts(data));
  }, []);

  // 处理搜索
  const handleSearch = () => {
    // TODO: 实现搜索逻辑
  };

  // 跳转到发帖页面
  const goToCreatePost = () => {
    navigate("/community/create-post");
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
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      </div>

      {/* 用户卡片 */}
      <div className={styles.userCard}>
        <h3>用户信息</h3>
        <button onClick={goToCreatePost}>发帖</button>
      </div>
    </div>
  );
}

export default CommunityPage;
