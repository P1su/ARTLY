import { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { toPng } from 'html-to-image';
import styles from './QRManageModal.module.css';
import { useAlert } from '../../../../../../store/AlertProvider';

export default function QRManageModal({ isOpen, exhibition, onClose }) {
  const { showAlert } = useAlert();
  const qrContainerRef = useRef(null);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen || !exhibition) return null;

  if (!exhibition) return null;

  // 배포 URL 사용
  const BASE_URL = 'https://artly.soundgram.co.kr';
  const verifyUrl = `${BASE_URL}/verify/${exhibition.id}`;

  // QR 다운로드
  const handleDownload = () => {
    if (qrContainerRef.current === null) return;

    toPng(qrContainerRef.current, {
      cacheBust: true,
      backgroundColor: '#ffffff',
      pixelRatio: 2,
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${exhibition.title || 'exhibition'}-verify-qr.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('이미지 변환 실패:', err);
        showAlert('이미지 다운로드에 실패했습니다.', 'error');
      });
  };

  // URL 복사
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(verifyUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('URL 복사 실패:', err);
      showAlert('URL 복사에 실패했습니다.', 'error');
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2 className={styles.title}>QR코드 : 관람 인증</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </header>

        <div className={styles.body}>
          {/* QR 다운로드 영역 */}
          <div ref={qrContainerRef} className={styles.qrDownloadArea}>
            <div className={styles.infoArea}>
              <p className={styles.mainName}>
                {exhibition.title || '전시회 정보 없음'}
              </p>
              {exhibition.startDate && exhibition.endDate && (
                <p className={styles.subName}>
                  {exhibition.startDate} ~ {exhibition.endDate}
                </p>
              )}
            </div>

            <div className={styles.qrCodeWrapper}>
              <QRCode
                value={verifyUrl}
                size={200}
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="H"
                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              />
            </div>
          </div>

          {/* URL 표시 */}
          <div className={styles.urlSection}>
            <p className={styles.urlLabel}>인증 URL</p>
            <div className={styles.urlBox}>
              <span className={styles.urlText}>{verifyUrl}</span>
            </div>
          </div>

          {/* 버튼들 */}
          <div className={styles.buttonGroup}>
            <button className={styles.downloadButton} onClick={handleDownload}>
              QR 다운로드
            </button>
            <button className={styles.copyButton} onClick={handleCopyUrl}>
              {isCopied ? '복사됨!' : 'URL 복사'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}