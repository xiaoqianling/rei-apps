import React from 'react';
import styles from './index.module.scss';

interface HighlightSectionProps {
  title: string;
  description: string;
  imagePlaceholderText: string;
  imageOnLeft?: boolean; // 控制图片是在左边还是右边
}

const HighlightSection: React.FC<HighlightSectionProps> = ({
  title,
  description,
  imagePlaceholderText,
  imageOnLeft = false,
}) => {
  const containerClasses = `${styles.highlightContainer} ${imageOnLeft ? styles.imageLeft : styles.imageRight}`;

  return (
    <section className={containerClasses}>
      <div className={styles.textContent}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <p className={styles.sectionDescription}>{description}</p>
        {/* 可以根据需要添加按钮 */}
        {/* <button className={styles.learnMoreButton}>了解更多</button> */}
      </div>
      <div className={styles.imageContent}>
        <div className={styles.imagePlaceholder}>{imagePlaceholderText}</div>
      </div>
    </section>
  );
};

export default HighlightSection; 