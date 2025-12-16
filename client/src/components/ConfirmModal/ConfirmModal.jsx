import { useEffect, useRef } from 'react';
import styles from '../AlertModal/AlertModal.module.css'; // ★ 기존 Alert 스타일 재사용

export default function ConfirmModal({
  isOpen,
  message,
  onConfirm,
  onCancel,
  isDanger = false,
}) {
  const confirmBtnRef = useRef(null);

  // 모달 열리면 '확인' 버튼에 포커스 (엔터 치면 바로 확인)
  useEffect(() => {
    if (isOpen && confirmBtnRef.current) {
      confirmBtnRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const confirmBtnClass = isDanger
    ? `${styles.modalButton} ${styles.errorButton}`
    : styles.modalButton;

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div
        className={`${styles.modalBox} ${styles.slideUp}`}
        onClick={(e) => e.stopPropagation()}
      >
        <p className={styles.modalMessage}>{message}</p>

        <div className={styles.btnBox}>
          <button
            className={styles.modalButton}
            onClick={onCancel}
            style={{ backgroundColor: '#e9ecef', color: '#333' }}
          >
            취소
          </button>

          <button
            ref={confirmBtnRef}
            className={confirmBtnClass}
            onClick={onConfirm}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
