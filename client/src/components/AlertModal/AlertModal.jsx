import { useEffect, useRef } from 'react';
import styles from './AlertModal.module.css';

export default function AlertModal({
  isOpen,
  message,
  onClose,
  type = 'default',
}) {
  const buttonRef = useRef(null);

  // 1. 모달이 열리면 버튼에 자동으로 포커스를 줍니다.
  // 이렇게 하면 별도의 키보드 이벤트 없이도 '엔터'를 치면 버튼이 눌립니다.
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [isOpen]);

  // 2. 렌더링 방지 조건은 Hook보다 아래에 있어야 안전합니다.
  if (!isOpen) return null;

  // 3. 스타일 클래스 결정
  const isError = type === 'error';

  const buttonClass = isError
    ? `${styles.modalButton} ${styles.errorButton}`
    : styles.modalButton;

  const messageClass = isError
    ? `${styles.modalMessage} ${styles.errorMessage}`
    : styles.modalMessage;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      {/* 모달 박스 클릭 시 닫기 방지 */}
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <p className={messageClass}>{message}</p>

        <button
          ref={buttonRef} // 포커스용 ref 연결
          className={buttonClass}
          onClick={onClose}
        >
          확인
        </button>
      </div>
    </div>
  );
}
