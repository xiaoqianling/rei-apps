import React, { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styles from "./index.module.scss";
import SearchBar from "../../components/community/SearchBar";
import TagFilter from "../../components/community/TagFilter";
import PostPreviewCard from "../../components/community/PostPreviewCard";
import { mockPosts } from "./mockData";
import { PostPreview } from "./types";
import { FaPlus } from "react-icons/fa";

const CommunityHome: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTag = searchParams.get("tag"); // Get selected tag from URL query param

  // Filtering logic
  const filteredPosts = useMemo(() => {
    let posts = mockPosts;

    // Filter by selected tag
    if (selectedTag) {
      posts = posts.filter((post) =>
        post.tags.some((tag) => tag.name === selectedTag),
      );
    }

    // Filter by search term (title, excerpt, author name, tag name)
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(lowerSearchTerm) ||
          post.excerpt.toLowerCase().includes(lowerSearchTerm) ||
          post.author.name.toLowerCase().includes(lowerSearchTerm) ||
          post.tags.some((tag) =>
            tag.name.toLowerCase().includes(lowerSearchTerm),
          ),
      );
    }

    return posts;
  }, [searchTerm, selectedTag]);

  // Handler for tag selection
  const handleSelectTag = (tagName: string | null) => {
    setSearchParams((params) => {
      if (tagName === null) {
        params.delete("tag"); // Remove tag param if 'All' is selected
      } else {
        params.set("tag", tagName); // Set tag param
      }
      return params;
    });
  };

  return (
    <div className={styles.communityContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>社区交流</h1>
          <p className={styles.subtitle}>分享知识、提出问题、共同进步</p>
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>
        <Link to="/community/create" className={styles.createPostButton}>
          <FaPlus className={styles.createIcon} /> 发新帖
        </Link>
      </header>

      <main className={styles.mainContent}>
        <TagFilter selectedTag={selectedTag} onSelectTag={handleSelectTag} />

        <section className={styles.postListSection}>
          {filteredPosts.length > 0 ? (
            <div className={styles.postList}>
              {filteredPosts.map((post) => (
                <PostPreviewCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>找不到相关的帖子...</div>
          )}
        </section>
      </main>
    </div>
  );
};

export default CommunityHome;
