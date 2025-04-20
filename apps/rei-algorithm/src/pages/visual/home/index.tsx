import React, { useState, useMemo } from 'react';
import styles from './index.module.scss';
import SearchBar from './components/SearchBar'; // Assuming index.tsx export
import AlgoCard from './components/AlgoCard';   // Assuming index.tsx export
import { mockAlgoData } from './mockData';
import { AlgoCardData } from './types';

const AlgoPlazaHome: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Memoized filtering logic
  const filteredData = useMemo(() => {
    if (!searchTerm) {
      return mockAlgoData;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return mockAlgoData.filter(item =>
      item.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.description.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm)) ||
      item.category.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.author.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [searchTerm]);

  // Group data by category for sectioned display
  const groupedData = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      const category = item.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, AlgoCardData[]>);
  }, [filteredData]);

  const categories = Object.keys(groupedData);

  return (
    <div className={styles.plazaContainer}>
      <header className={styles.header}>
        <h1 className={styles.mainTitle}>算法广场</h1>
        <p className={styles.subtitle}>探索、学习和分享算法的可视化实现</p>
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      </header>

      <main className={styles.mainContent}>
        {categories.length > 0 ? (
          categories.map(category => (
            <section key={category} className={styles.categorySection}>
              <h2 className={styles.categoryTitle}>{category}</h2>
              <div className={styles.cardGrid}>
                {groupedData[category].map(item => (
                  <AlgoCard key={item.id} data={item} />
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className={styles.noResults}>未找到匹配的算法。</div>
        )}
      </main>

      <footer className={styles.footer}>
        {/* 可以添加页脚信息 */}
        <p>© 2024 Rei-Apps Algo Plaza. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AlgoPlazaHome;
