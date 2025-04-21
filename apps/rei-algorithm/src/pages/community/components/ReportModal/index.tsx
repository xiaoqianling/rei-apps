import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import { FaTimes } from 'react-icons/fa';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
}

const reportReasons = [
  '垃圾广告信息',
  '不友善内容',
  '内容涉及侵权',
  '低质量或与主题无关',
  '其他'
];

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedReason('');
      setDetails('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason || isSubmitting) return;
    setIsSubmitting(true);
    // Simulate submission delay
    setTimeout(() => {
        onSubmit(selectedReason, details);
        setIsSubmitting(false);
    }, 500);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}> {/* Close on overlay click */}
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}> {/* Prevent closing on content click */}
        <button className={styles.closeButton} onClick={onClose} aria-label="关闭">
          <FaTimes />
        </button>
        <h3 className={styles.modalTitle}>举报文章</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>请选择举报原因：</label>
            <div className={styles.reasonsContainer}>
              {reportReasons.map(reason => (
                <label key={reason} className={styles.reasonLabel}>
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    required
                  />
                  {reason}
                </label>
              ))}
            </div>
          </div>

          {selectedReason === '其他' && (
            <div className={styles.formGroup}>
              <label htmlFor="reportDetails" className={styles.label}>请补充说明：</label>
              <textarea
                id="reportDetails"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className={styles.detailsTextarea}
                rows={3}
                placeholder="请详细说明举报原因..."
              />
            </div>
          )}

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              取消
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!selectedReason || isSubmitting}
            >
              {isSubmitting ? '提交中...' : '确认举报'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal; 