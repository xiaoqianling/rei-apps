import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './index.module.scss';
import UserInfoCard from '../components/UserInfoCard';
import PostPreviewCard from '../components/PostPreviewCard';
import { mockUserProfiles } from '../mockData'; // Use mock data
import { UserProfileData } from '../types';

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // --- Mock Data Fetching --- //
    // In a real app, you would fetch user data based on userId from an API
    console.log("Fetching profile for:", userId);
    const profile = userId ? mockUserProfiles[userId] : null;
    setTimeout(() => { // Simulate network delay
       setUserProfile(profile);
       setLoading(false);
    }, 500);
    // --- End Mock Data Fetching --- //

  }, [userId]);

  if (loading) {
    // TODO: Add a proper loading skeleton/spinner
    return <div className={styles.loading}>加载中...</div>;
  }

  if (!userProfile) {
    return <div className={styles.notFound}>未找到用户。</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <UserInfoCard user={userProfile} />

      <section className={styles.userPostsSection}>
        <h3 className={styles.sectionTitle}>发布的帖子</h3>
        {userProfile.posts.length > 0 ? (
          <div className={styles.postList}>
            {userProfile.posts.map(post => (
              <PostPreviewCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className={styles.noPosts}>该用户还没有发布任何帖子。</p>
        )}
      </section>
    </div>
  );
};

export default UserProfilePage; 