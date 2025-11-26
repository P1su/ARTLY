import styles from './LogoutModal.module.css';

export default function LogoutModal({ onClose }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        로그아웃 되었습니다.
        <button className={styles.closeButton} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}
