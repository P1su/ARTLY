import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';
import styles from './QrScanner.module.css';

export default function QrScanner() {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleScan = (detectedCodes) => {
    console.log('스캔 결과:', detectedCodes);

    if (detectedCodes && detectedCodes.length > 0) {
      const firstCode = detectedCodes[0];
      console.log('rawValue:', firstCode.rawValue);

      if (firstCode.rawValue) {
        setScanResult(firstCode.rawValue);
        setError(null);
      } else {
        console.warn('유효하지 않은 스캔 결과: 빈 값');
        setError('유효하지 않은 QR 코드입니다.');
        setScanResult(null);
      }
    } else {
      console.log('detectedCodes 배열이 비었음');
    }
  };

  const handleError = (err) => {
    console.error('QR 코드 스캔 중 에러 발생:', err);
    setError(err);
    setScanResult(null);
  };

  const handleConfirmArt = () => {
    if (scanResult) {
      console.log(`'작품 확인하기' 클릭. ${scanResult} 페이지로 이동.`);
      navigate(`/art/${scanResult}`);
    }
  };

  useEffect(() => {
    if (scanResult) {
      console.log(`스캔 결과 업데이트: ${scanResult}`);
    }
  }, [scanResult]);

  return (
    <div className={styles.layout}>
      <button className={styles.backBtn} onClick={() => navigate('/')}>
        &larr;
      </button>
      <div className={styles.scanLayout}>
        <h1 className={styles.title}>작품 QR 스캔</h1>
        {!scanResult && !error && (
          <p className={styles.scanGuide}>
            작품에 있는 QR 코드를 스캔해주세요.
          </p>
        )}
        {scanResult && (
          <p className={styles.scanGuide}>버튼을 눌러 작품을 확인해보세요!</p>
        )}
        {error && (
          <p className={`${styles.scanGuide} ${styles.errorText}`}>
            에러: {error.message || error}
          </p>
        )}

        <div className={styles.cameraArea}>
          <Scanner
            onScan={handleScan}
            onError={handleError}
            constraints={{
              facingMode: 'environment',
            }}
            scanDelay={300}
          />
        </div>

        <button
          className={`${styles.confirmButton} ${scanResult ? styles.active : ''}`}
          onClick={handleConfirmArt}
          disabled={!scanResult}
        >
          작품 보기
        </button>
      </div>
    </div>
  );
}
