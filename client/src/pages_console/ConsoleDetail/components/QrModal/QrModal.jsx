import { useRef } from 'react';
import QRCode from 'react-qr-code';
import { toPng } from 'html-to-image';
import styles from './QrModal.module.css';

export default function QrModal({ data, onClose, type }) {
  const safeData = data || {};

  const hasLeaflet = safeData.leafletUrl;
  const qrContainerRef = useRef(null);

  const isExhibition = type === 'exhibitions';

  const displayName = isExhibition
    ? safeData.exhibition_title
    : safeData.gallery_name;

  const displaySubName = isExhibition
    ? safeData.gallery?.gallery_name || safeData.gallery_name || ''
    : safeData.gallery_eng_name || '';

  const filePrefix = isExhibition
    ? safeData.exhibition_title || 'exhibition'
    : safeData.gallery_name || 'gallery';

  const handleDownload = () => {
    if (qrContainerRef.current === null) {
      return;
    }

    toPng(qrContainerRef.current, {
      cacheBust: true,
      backgroundColor: '#ffffff',
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${filePrefix}-qr-code.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('이미지 변환에 실패했습니다.', err);
        alert('이미지 다운로드에 실패했습니다. 다시 시도해주세요.');
      });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2 className={styles.title}>QR코드 : 리플렛/도록</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </header>

        <div className={styles.body}>
          {hasLeaflet ? (
            <>
              <div ref={qrContainerRef} className={styles.qrDownloadArea}>
                <div className={styles.galleryInfo}>
                  <p className={styles.galleryName}>
                    {displayName || '이름 정보 없음'}
                  </p>
                  <p className={styles.galleryNameEn}>{displaySubName}</p>
                </div>
                <div className={styles.qrCodeWrapper}>
                  <QRCode
                    value={safeData.leafletUrl}
                    size={200}
                    bgColor='#FFFFFF'
                    fgColor='#000000'
                    level='L'
                    style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                  />
                </div>
              </div>
              <button
                className={styles.downloadButton}
                onClick={handleDownload}
              >
                다운로드
              </button>
            </>
          ) : (
            <div className={styles.noLeaflet}>
              <p className={styles.galleryName}>
                {displayName || '이름 정보 없음'}
              </p>
              <p className={styles.galleryNameEn}>{displaySubName}</p>
              <p className={styles.noLeafletMessage}>
                아직 생성된 리플렛이 없어요.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
