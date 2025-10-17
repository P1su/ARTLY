import styles from './ConsoleDetail.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import useResponsive from '../../hooks/useResponsive';
import ArtworkDetail from '../../pages/Category/Artwork/ArtworkDetail/ArtworkDetail';
import GalleryDetail from '../../pages/Category/Gallery/GalleryDetail/GalleryDetail';
import ExhibitionDetail from '../../pages/Category/Exhibition/ExhibitionDetail/ExhibitionDetail';
import QrModal from './ConsoleQR/QrModal';
import { useEffect, useState } from 'react';

const DETAIL_CONFIG = {
  galleries: {
    title: '갤러리',
    Component: GalleryDetail,
    tabs: [
      { label: '정보수정' },
      { label: 'QR코드' },
      { label: '리플렛/도록' },
    ],
  },
  exhibitions: {
    title: '전시회',
    Component: ExhibitionDetail,
    tabs: [
      { label: '정보수정' },
      { label: 'QR코드' },
      { label: '리플렛/도록' },
    ],
  },
  artworks: {
    title: '작품',
    Component: ArtworkDetail,
    tabs: [{ label: '정보수정' }, { label: 'QR코드' }, { label: '도슨트' }],
  },
};

export default function ConsoleDetail({ type }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null); // 상세 페이지 데이터
  const [showQrModal, setShowQrModal] = useState(false); // QR 모달 표시 상태

  useResponsive();

  useEffect(() => {
    // API로부터 상세 데이터를 가져오는 로직 (임시 데이터 사용)
    const fetchData = async () => {
      // const response = await instance.get(DETAIL_CONFIG[type].fetchUrl(id));
      // setData(response.data);
      setData({
        gallery_name: '대림미술관',
        gallery_name_en: 'DAELIM MUSEUM',
        leafletUrl: 'https://artly-nine.vercel.app/', // 리플렛이 있다고 가정
        // leafletUrl: null // 리플렛이 없다고 가정
      });
    };
    fetchData();
  }, [id, type]);

  const config = DETAIL_CONFIG[type];
  const { Component, tabs } = config;

  const handleTabClick = (label) => {
    if (label === '정보수정') {
      navigate(`/console/${type}/edit/${id}`);
    } else if (label === 'QR코드') {
      setShowQrModal(true); // QR코드 탭 클릭 시 모달 열기
    } else {
      alert(`${label} 페이지로 이동합니다. ID: ${id}`);
    }
  };

  if (!data) return <div>데이터 로딩 중...</div>;

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          {'<'}
        </button>
        <h1 className={styles.title}>{config.title}</h1>
      </header>
      <nav className={styles.adminTabNav}>
        {tabs.map(({ label }) => (
          <button
            key={label}
            className={styles.adminTabButton}
            onClick={() => handleTabClick(label)}
          >
            {label}
          </button>
        ))}
      </nav>

      <main className={styles.content}>
        <Component showUserActions={false} id={id} />
      </main>

      {/* QR 모달 (showQrModal이 true일 때만 렌더링) */}
      {showQrModal && (
        <QrModal data={data} onClose={() => setShowQrModal(false)} />
      )}
    </div>
  );
}
