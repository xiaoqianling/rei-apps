import React from 'react';
import styles from './index.module.scss';

const HeroSection: React.FC = () => {
  return (
    <section className={styles.heroContainer}>
      <div className={styles.heroContent}>
        <h1 className={styles.mainHeadline}>
          <span className={styles.highlightText}>可视化</span>算法，
          <br />
          掌控<span className={styles.highlightText}>数据结构</span>
        </h1>
        <p className={styles.subHeadline}>
          一个集学习、创建、分享于一体的交互式算法可视化平台。
          <br />
          探索、理解并创造属于你自己的算法世界。
        </p>
        <div className={styles.ctaButtons}>
          <button className={`${styles.ctaButton} ${styles.primary}`}>开始探索</button>
          <button className={`${styles.ctaButton} ${styles.secondary}`}>了解编辑器</button>
        </div>
      </div>
      <div className={styles.heroVisual}>
        {/* Placeholder for Lottie animation or dynamic graphic */}
        <div className={styles.visualPlaceholder}>
          动态视觉效果区域
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 