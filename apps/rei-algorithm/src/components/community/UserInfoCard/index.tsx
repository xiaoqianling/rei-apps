import React from "react";
import styles from "./index.module.scss";
import { UserProfileData } from "../../../pages/community/types";

interface UserInfoCardProps {
  user: UserProfileData;
}

// Helper to format date (basic example)
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "未知";
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const UserInfoCard: React.FC<UserInfoCardProps> = ({ user }) => {
  return (
    <div className={styles.userInfoCard}>
      <img
        src={user.avatarUrl || "/avatars/default.png"}
        alt={`${user.name} avatar`}
        className={styles.profileAvatar}
      />
      <h2 className={styles.userName}>{user.name}</h2>
      {user.bio && <p className={styles.userBio}>{user.bio}</p>}
      <div className={styles.userDetails}>
        {user.joinDate && (
          <span className={styles.detailItem}>
            加入时间: {formatDate(user.joinDate)}
          </span>
        )}
        <span className={styles.detailItem}>发布帖子: {user.postCount}</span>
        {/* Add more stats placeholders here */}
      </div>
      {/* Optional: Add follow button or other actions */}
    </div>
  );
};

export default UserInfoCard;
