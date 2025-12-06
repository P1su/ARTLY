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

  // 모달 열리면 '확인' 버튼에 포커스 (엔터 치면 바로 확인되게)
  useEffect(() => {
    if (isOpen && confirmBtnRef.current) {
      confirmBtnRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 위험한 작업(삭제 등)일 때 확인 버튼을 빨간색으로
  const confirmBtnClass = isDanger
    ? `${styles.modalButton} ${styles.errorButton}`
    : styles.modalButton;

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <p className={styles.modalMessage}>{message}</p>

        {/* 버튼 영역: 취소 / 확인 */}
        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
          {/* 취소 버튼 (회색 톤으로 스타일 오버라이드 필요하거나 인라인 스타일 사용) */}
          <button
            className={styles.modalButton}
            onClick={onCancel}
            style={{ backgroundColor: '#e9ecef', color: '#333' }}
          >
            취소
          </button>

          {/* 확인 버튼 */}
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
