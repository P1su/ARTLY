import styles from './QrScanner.module.css';
import { useNavigate } from 'react-router-dom';

export default function QrScanner() {
  const navigate = useNavigate();

  const handleFakeScan = () => {
    alert('QR 인식 성공! 작품 정보를 불러옵니다.');
    //navigate('');
  };

  return (
    <div className={styles.layout}>
      <h2 className={styles.title}>작품 QR 인식</h2>
      <div className={styles.scannerBox}>
        <div className={styles.cameraArea}>
          <p className={styles.scanGuide}>QR 코드를 카메라 영역에 맞춰주세요</p>
          <div className={styles.scanFrame} />
        </div>
        <button className={styles.scanButton} onClick={handleFakeScan}>
          QR 스캐너
        </button>
      </div>
    </div>
  );
}
