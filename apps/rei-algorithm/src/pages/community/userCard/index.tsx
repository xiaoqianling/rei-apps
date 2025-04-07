import styles from "./index.module.scss";
import { FunctionComponent } from "react";

interface UserCardProps {
  // 可后续添加 props
}

const UserCard: FunctionComponent<UserCardProps> = () => {
  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <img src="/img/avatar.jpeg" alt="用户头像" className={styles.avatar} />
        <h3 className={styles.username}>用户名</h3>
      </div>

      <div className={styles.stats}>
        <a href="#posts" className={styles.statItem}>
          发布 5 篇帖子
        </a>
        <a href="#favorites" className={styles.statItem}>
          收藏 12 篇
        </a>
        <a href="#history" className={styles.statItem}>
          阅读 32 次
        </a>
      </div>

      <div className={styles.actions}>
        <button className={styles.profileBtn}>个人主页</button>
        <button className={styles.postBtn}>发帖</button>
        <button className={styles.logoutBtn}>退出登录</button>
      </div>
    </div>
  );
};

export default UserCard;
