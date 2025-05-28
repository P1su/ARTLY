import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import styles from './QrScanner.module.css';

export default function QrScanner() {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const qrCodeRegionId = 'html5qr-code-full-region';
  const html5QrcodeScannerRef = useRef(null);

  useEffect(() => {
    const config = {
      fps: 10,
      qrbox: 250,
      aspectRatio: 1,
      disableFlip: false,
    };

    html5QrcodeScannerRef.current = new Html5Qrcode(qrCodeRegionId);

    html5QrcodeScannerRef.current
      .start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          setScanResult(decodedText);
          setError(null);
        },
        (errorMessage) => {
          console.log('QR scan error:', errorMessage);
        },
      )
      .catch((err) => {
        setError('카메라를 사용할 수 없습니다.');
        console.error(err);
      });

    return () => {
      if (html5QrcodeScannerRef.current) {
        html5QrcodeScannerRef.current.stop().catch(() => {});
        html5QrcodeScannerRef.current.clear();
      }
    };
  }, []);

  const handleConfirmArt = () => {
    if (scanResult) {
      navigate(`/art/${scanResult}`);
    }
  };

  return (
    <div className={styles.layout}>
      <button className={styles.closeBtn} onClick={() => navigate('/')}>
        ×
      </button>
      <div className={styles.scanLayout}>
        <h1 className={styles.header}>Artly QR Reader</h1>

        <div id={qrCodeRegionId} className={styles.qrRegion} />

        <div className={styles.frame}>
          <div className={styles.cornerTopLeft} />
          <div className={styles.cornerTopRight} />
          <div className={styles.cornerBottomLeft} />
          <div className={styles.cornerBottomRight} />
          <div className={styles.crosshair}>+</div>
          <img src='/qr-icon.png' alt='QR 아이콘' className={styles.qrIcon} />
        </div>

        {!scanResult && !error && (
          <p className={styles.guideText}>QR코드를 화면에 인식해주세요.</p>
        )}
        {scanResult && (
          <p className={styles.guideText}>버튼을 눌러 작품을 확인해보세요!</p>
        )}
        {error && (
          <p className={`${styles.guideText} ${styles.errorText}`}>
            에러: {error}
          </p>
        )}

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
