import React from 'react';
import styles from './AttendanceModal.module.css';
import { FaCheck, FaTimes } from 'react-icons/fa';

const AttendanceModal = ({
  isOpen,
  onClose,
  exhibitionTitle,
  imageUrl,
  visitDate,
  onViewExhibition,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
          <div>{exhibitionTitle}</div>
        </div>

        <div className={styles.imageContainer}>
          <img src={imageUrl} alt={exhibitionTitle} />
        </div>

        <div className={styles.checkIconContainer}>
          <FaCheck />
        </div>

        <div className={styles.confirmText}>관람 확인 완료</div>
        <div className={styles.visitDate}>이용해주셔서 감사합니다.</div>

        <div className={styles.visitDate}>방문일시 : {visitDate}</div>

        <button className={styles.infoButton} onClick={onViewExhibition}>
          다른 전시 둘러보기
        </button>
      </div>
    </div>
  );
};

export default AttendanceModal;
