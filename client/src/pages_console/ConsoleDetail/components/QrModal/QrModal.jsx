import { useEffect, useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { toPng } from 'html-to-image';
import styles from './QrModal.module.css';
import { userInstance } from '../../../../apis/instance';

export default function QrModal({ data, onClose, type }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasContent, setHasContent] = useState(false);
  const [qrUrl, setQrUrl] = useState('');

  const qrContainerRef = useRef(null);

  const isArtwork = type === 'artworks';
  const isExhibition = type === 'exhibitions';

  let mainTitle = '';
  let subTitle = '';
  let fileNamePrefix = '';

  if (data) {
    if (isArtwork) {
      mainTitle = data.art_title;
      subTitle = data.artist_name || data.art_medium || '';
      fileNamePrefix = data.art_title || 'artwork';
    } else if (isExhibition) {
      mainTitle = data.exhibition_title;
      subTitle = data.gallery?.gallery_name || data.gallery_name || '';
      fileNamePrefix = data.exhibition_title || 'exhibition';
    } else {
      mainTitle = data.gallery_name;
      subTitle = data.gallery_eng_name || '';
      fileNamePrefix = data.gallery_name || 'gallery';
    }
  }

  useEffect(() => {
    const checkContentExistence = async () => {
      if (!data?.id) return;
      setIsLoading(true);

      try {
        if (isArtwork) {
          const response = await userInstance.get(`/api/arts/${data.id}`);
          const artData = response.data;

          const directFileUrl =
            artData.docent_audio_path || artData.docent_video_path;

          if (directFileUrl) {
            setHasContent(true);
            setQrUrl(directFileUrl);
          } else {
            setHasContent(false);
          }
        } else {
          const apiCategory = isExhibition
            ? 'exhibitionCategory'
            : 'galleryCategory';

          const response = await userInstance.get('/api/leaflet', {
            params: {
              category: apiCategory,
              category_id: data.id,
            },
          });

          const leafletList = Array.isArray(response.data) ? response.data : [];

          if (leafletList.length > 0) {
            setHasContent(true);
            const viewerUrl = `${window.location.origin}/view/leaflet/${type}/${data.id}`;
            setQrUrl(viewerUrl);
          } else {
            setHasContent(false);
          }
        }
      } catch (error) {
        console.error('데이터 조회 실패:', error);
        setHasContent(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkContentExistence();
  }, [data, type, isArtwork, isExhibition]);

  const handleDownload = () => {
    if (qrContainerRef.current === null) return;

    toPng(qrContainerRef.current, {
      cacheBust: true,
      backgroundColor: '#ffffff',
      pixelRatio: 2,
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${fileNamePrefix}-qr-code.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('이미지 변환 실패:', err);
        alert('이미지 다운로드에 실패했습니다.');
      });
  };

  if (!data) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2 className={styles.title}>
            {isArtwork ? 'QR코드 : 작품 도슨트' : 'QR코드 : 리플렛/도록'}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </header>

        <div className={styles.body}>
          {isLoading ? (
            <div className={styles.loadingState}>
              <p>정보를 확인하는 중입니다...</p>
            </div>
          ) : hasContent ? (
            <>
              <div ref={qrContainerRef} className={styles.qrDownloadArea}>
                <div className={styles.infoArea}>
                  <p className={styles.mainName}>
                    {mainTitle || '이름 정보 없음'}
                  </p>
                  <p className={styles.subName}>{subTitle}</p>
                </div>

                <div className={styles.qrCodeWrapper}>
                  <QRCode
                    value={qrUrl}
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
            <div className={styles.noContentState}>
              <p className={styles.mainName}>{mainTitle || '이름 정보 없음'}</p>
              <p className={styles.subName}>{subTitle}</p>

              <div className={styles.emptyMessage}>
                {isArtwork
                  ? '등록된 도슨트(오디오/비디오)가 없어요.'
                  : '아직 생성된 리플렛이 없어요.'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
