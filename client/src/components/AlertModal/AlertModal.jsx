import { useEffect, useRef } from 'react';
import styles from './AlertModal.module.css';

export default function AlertModal({
  isOpen,
  message,
  onClose,
  type = 'default',
}) {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isError = type === 'error';

  const buttonClass = isError
    ? `${styles.modalButton} ${styles.errorButton}`
    : styles.modalButton;

  const messageClass = isError
    ? `${styles.modalMessage} ${styles.errorMessage}`
    : styles.modalMessage;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <p className={messageClass}>{message}</p>

        <button ref={buttonRef} className={buttonClass} onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
}
