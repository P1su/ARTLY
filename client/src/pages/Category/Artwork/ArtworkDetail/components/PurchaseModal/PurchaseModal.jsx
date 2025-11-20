import styles from './PurchaseModal.module.css';
import { FaPhone, FaXmark } from 'react-icons/fa6';

export default function PurchaseModal({ phoneNumber, onClose }) {
  const handleCall = () => {
    if (!phoneNumber) return;
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <FaXmark />
        </button>

        <div className={styles.modalContent}>
          <div className={styles.modalIconBox}>
            <FaPhone className={styles.modalIcon} />
          </div>

          <h3 className={styles.modalTitle}>구매 문의</h3>
          <p className={styles.modalDesc}>
            작품 구매에 관심이 있으신가요?
            <br />
            갤러리 홈페이지 방문 후 문의 바랍니다.
          </p>

          {phoneNumber ? (
            <div className={styles.phoneInfo}>
              <span className={styles.phoneNumber}>{phoneNumber}</span>
              <button className={styles.callButton} onClick={handleCall}>
                전화 걸기
              </button>
              {/* PC 등 전화 기능이 없는 환경을 위한 안내 */}
              <p className={styles.pcInfo}>
                * 모바일에서는 버튼을 누르면 바로 연결됩니다.
              </p>
            </div>
          ) : (
            <p className={styles.errorText}>
              등록된 갤러리 전화번호가 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
