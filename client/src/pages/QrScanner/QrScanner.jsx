import styles from './QrScanner.module.css';
import { useNavigate } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';

export default function QrScanner() {
  const navigate = useNavigate();

  const handleScan = (result) => {
    console.log(result);
    navigate('art/:artId');
  };

  const handleError = (err) => {
    console.log(err);
  };

  return (
    <div className={styles.layout}>
      <button className={styles.backBtn} onClick={() => navigate('/')}>
        &larr;
      </button>
      <div className={styles.scanLayout}>
        <h1 className={styles.title}>작품 QR 스캔</h1>
        <p className={styles.scanGuide}>작품에 있는 QR 코드를 스캔해주세요.</p>

        <div className={styles.cameraArea}>
          <Scanner
            onResult={handleScan}
            onError={handleError}
            constraints={{
              facingMode: 'environment', // 후면 카메라 사용 (전면: 'user')
            }}
            scanDelay={300} // 0.3초마다 스캔 시도
          />
        </div>
        {/* 추가적인 UI 요소 (예: 설명 텍스트, 취소 버튼 등) */}
      </div>
    </div>
  );
}
