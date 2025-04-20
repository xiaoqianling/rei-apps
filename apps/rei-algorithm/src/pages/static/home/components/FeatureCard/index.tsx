import React from 'react';
import styles from './index.module.scss';

interface FeatureCardProps {
  iconPlaceholder: string; // 暂时用字符串代表图标占位
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ iconPlaceholder, title, description }) => {
  return (
    <div className={styles.card}>
      <div className={styles.iconPlaceholder}>{iconPlaceholder}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
};

export default FeatureCard; 