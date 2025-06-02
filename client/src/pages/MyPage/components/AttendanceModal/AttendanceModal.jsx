import React from 'react';
import styles from './AttendanceModal.module.css';
import { FaTimes } from 'react-icons/fa';

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

        <div className={styles.checkIconContainer}>관람확인</div>

        <div className={styles.confirmText}>관람 확인 완료</div>
        <div className={styles.visitDate}>방문일시 : {visitDate}</div>

        <button className={styles.infoButton} onClick={onViewExhibition}>
          전시회 정보 보기
        </button>

        <div className={styles.footerText}>관람 확인 처리</div>
      </div>
    </div>
  );
};

export default AttendanceModal;
