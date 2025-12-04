import styles from './AlertModal.module.css';

export default function AlertModal({ isOpen, message, onClose }) {
  if (!isOpen) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <p className={styles.modalMessage}>{message}</p>
        <button className={styles.modalButton} onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
}
