import React from 'react';
import styles from './index.module.scss';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange, placeholder = "搜索算法名称、标签或描述..." }) => {
  return (
    <div className={styles.searchBarContainer}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className={styles.searchInput}
      />
      {/* 可以考虑添加一个搜索图标 */}
      {/* <span className={styles.searchIcon}>🔍</span> */}
    </div>
  );
};

export default SearchBar; 