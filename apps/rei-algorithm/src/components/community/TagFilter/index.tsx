import React from "react";
import styles from "./index.module.scss";
import { CommunityTag } from "../../../pages/community/types";
import { mockTags } from "../../../pages/community/mockData"; // Use mock tags for now

interface TagFilterProps {
  selectedTag: string | null;
  onSelectTag: (tagId: string | null) => void;
  // Pass available tags or fetch them
  availableTags?: CommunityTag[];
}

const TagFilter: React.FC<TagFilterProps> = ({
  selectedTag,
  onSelectTag,
  availableTags = Object.values(mockTags), // Default to mock tags
}) => {
  return (
    <div className={styles.tagFilterContainer}>
      <button
        className={`${styles.tagButton} ${selectedTag === null ? styles.active : ""}`}
        onClick={() => onSelectTag(null)}
      >
        全部
      </button>
      {availableTags.map((tag) => (
        <button
          key={tag.id}
          className={`${styles.tagButton} ${selectedTag === tag.name ? styles.active : ""}`}
          onClick={() => onSelectTag(tag.name)} // Filter by name for simplicity now
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
};

export default TagFilter;
