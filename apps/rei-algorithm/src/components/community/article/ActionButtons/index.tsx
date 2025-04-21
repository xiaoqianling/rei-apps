import React from 'react';
import styles from './index.module.scss';
import { FaShareAlt, FaPencilAlt, FaFlag } from 'react-icons/fa';

interface ActionButtonsProps {
  // Add callbacks for actual functionality
  onShare?: () => void;
  onEdit?: () => void; // Only show if user is author (logic handled in parent)
  onReport?: () => void; // Add report handler prop
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onShare, onEdit, onReport }) => {

  const handleShare = () => {
    // Implement basic share functionality (e.g., copy link)
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('链接已复制到剪贴板！'))
      .catch(err => console.error('复制失败: ', err));
    onShare?.(); // Call prop callback if provided
  };

  return (
    <div className={styles.actionButtonsContainer}>
      {onEdit && (
        <button onClick={onEdit} className={`${styles.actionButton} ${styles.editButton}`}>
          <FaPencilAlt /> 编辑
        </button>
      )}
      <button onClick={handleShare} className={`${styles.actionButton} ${styles.shareButton}`}>
        <FaShareAlt /> 分享
      </button>
      {onReport && (
        <button onClick={onReport} className={`${styles.actionButton} ${styles.reportButton}`}>
          <FaFlag /> 举报
        </button>
      )}
    </div>
  );
};

export default ActionButtons; 