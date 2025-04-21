import React from 'react';
import styles from './index.module.scss';
import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange, placeholder = "搜索帖子标题、内容或标签..." }) => {
  return (
    <div className={styles.searchBarContainer}>
      <FaSearch className={styles.searchIcon} />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className={styles.searchInput}
      />
    </div>
  );
};

export default SearchBar; 