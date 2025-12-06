import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import styles from './QrScanner.module.css';
import { userInstance } from '../../apis/instance';
import { useAlert } from '../../store/AlertProvider';

export default function QrScanner() {
  const navigate = useNavigate();
  const location = useLocation();

  const qrCodeRegionId = 'html5qr-code-full-region';
  const html5QrcodeScannerRef = useRef(null);
  const [error, setError] = useState(null);
  const [showTestMessage, setShowTestMessage] = useState(false);
  const { showAlert } = useAlert();

  const receivedExhibitionInfo = location.state?.exhibitionInfo || null;

  const handleTestBtnClick = async () => {
    const itemId = new URLSearchParams(location.search).get('itemId');
    if (!itemId) return;

    try {
      await userInstance.patch(`/api/reservations/${itemId}`, {
        reservation_status: 'used',
      });

      navigate('/mypage', {
        state: {
          successModal: true,
          exhibitionInfo: receivedExhibitionInfo,
        },
      });
    } catch (err) {
      console.error('관람 인증 실패:', err);
      showAlert('관람 인증 처리 중 문제가 발생했습니다.');
    }
  };

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
          html5QrcodeScannerRef.current
            .stop()
            .then(() => {
              navigate(`/art/${decodedText}`);
            })
            .catch((err) => {
              console.error('Failed to stop scanner:', err);
            });
        },
        () => {},
      )
      .catch((err) => {
        setError('카메라를 사용할 수 없습니다.');
        console.error('QR 에러 발생:', err);
      });

    return async () => {
      const scanner = html5QrcodeScannerRef.current;
      if (scanner) {
        try {
          if (scanner.isScanning) await scanner.stop();
          scanner.clear();
        } catch (err) {
          console.error('Cleanup 실패:', err);
        }
      }
    };
  }, [navigate]);

  const handleCloseButton = () => {
    navigate(-1);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const itemId = params.get('itemId');
    if (itemId) {
      setShowTestMessage(true);
    }
  }, [location]);

  return (
    <div className={styles.scannerContainer}>
      <div className={styles.header}>
        <button className={styles.closeButton} onClick={handleCloseButton}>
          ×
        </button>
        <h2 className={styles.title}>Artly QR Reader</h2>
      </div>

      <div className={styles.scannerArea}>
        <div id={qrCodeRegionId} className={styles.qrScannerWrapper} />
        <div className={styles.scannerOverlay}>
          <div className={`${styles.corner} ${styles.topLeft}`} />
          <div className={`${styles.corner} ${styles.topRight}`} />
          <div className={`${styles.corner} ${styles.bottomLeft}`} />
          <div className={`${styles.corner} ${styles.bottomRight}`} />
        </div>
        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>

      <button className={styles.qrIconButton}>
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M3 11H11V3H3V11ZM5 5H9V9H5V5Z' fill='black' />
          <path d='M3 21H11V13H3V21ZM5 15H9V19H5V15Z' fill='black' />
          <path d='M13 3V11H21V3H13ZM19 9H15V5H19V9Z' fill='black' />
          <path d='M21 19H19V21H21V19Z' fill='black' />
          <path d='M15 13H13V15H15V13Z' fill='black' />
          <path d='M17 15H15V17H17V15Z' fill='black' />
          <path d='M15 17H13V19H15V17Z' fill='black' />
          <path d='M17 19H15V21H17V19Z' fill='black' />
          <path d='M19 17H17V19H19V17Z' fill='black' />
          <path d='M19 13H17V15H19V13Z' fill='black' />
          <path d='M21 15H19V17H21V15Z' fill='black' />
        </svg>
      </button>

      <div className={styles.instructionBox}>
        <p>QR 코드를 화면에 인식해주세요.</p>
        {/*         <button onClick={handleTestBtnClick} className={styles.test}>
          전시회 관람인증 QR 테스트
        </button>*/}
      </div>
    </div>
  );
}
