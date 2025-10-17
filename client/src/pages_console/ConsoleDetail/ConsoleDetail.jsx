import styles from './ConsoleDetail.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import useResponsive from '../../hooks/useResponsive';
import ArtworkDetail from '../../pages/Category/Artwork/ArtworkDetail/ArtworkDetail';
import GalleryDetail from '../../pages/Category/Gallery/GalleryDetail/GalleryDetail';
import ExhibitionDetail from '../../pages/Category/Exhibition/ExhibitionDetail/ExhibitionDetail';
import { useEffect, useState } from 'react';
import DetailTabs from '../../components/DetailTabs/DetailTabs';
import { instance } from '../../apis/instance';
import GalleryExhibitions from '../../pages/Category/Gallery/GalleryDetail/components/GalleryExhibitions/GalleryExhibitions';
import QrModal from './QrModal/QrModal';
import GalleryArtworks from './components/GalleryArtworks/GalleryArtworks';

const DETAIL_CONFIG = {
  galleries: {
    title: '갤러리',
    Component: GalleryDetail,
    tabs: [
      { label: '정보수정' },
      { label: 'QR코드' },
      { label: '리플렛/도록' },
    ],
    fetchUrl: (id) => `/api/galleries/${id}`,
  },
  exhibitions: {
    title: '전시회',
    Component: ExhibitionDetail,
    tabs: [
      { label: '정보수정' },
      { label: 'QR코드' },
      { label: '리플렛/도록' },
    ],
    fetchUrl: (id) => `/api/exhibitions/${id}`,
  },
  artworks: {
    title: '작품',
    Component: ArtworkDetail,
    tabs: [{ label: '정보수정' }, { label: 'QR코드' }, { label: '도슨트' }],
    fetchUrl: (id) => `/api/artworks/${id}`,
  },
};

export default function ConsoleDetail({ type }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [showQrModal, setShowQrModal] = useState(false);

  useResponsive(); //??

  useEffect(() => {
    const fetchData = async () => {
      const response = await instance.get(config.fetchUrl(id));
      setData(response.data);
    };
    fetchData();
  }, [id, type]);

  const config = DETAIL_CONFIG[type];
  const { Component, tabs } = config;

  const handleTabClick = (label) => {
    if (label === '정보수정') {
      navigate(`/console/${type}/edit/${id}`);
    } else if (label === 'QR코드') {
      setShowQrModal(true);
    } else {
      alert(`${label} 페이지로 이동합니다. ID: ${id}`);
    }
  };

  const contentTabs = [
    { key: 'info', label: '정보' },
    { key: 'artworks', label: `작품(${data?.artworks?.length || 0})` },
    { key: 'exhibitions', label: `전시(${data?.exhibitions?.length || 0})` },
  ];
  console.log(data);
  if (!data) return <div>데이터 로딩 중...</div>;

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => navigate(`/console/${type}`)}
        >
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

        <DetailTabs
          tabs={contentTabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        >
          {activeTab === 'info' && (
            <div
              className={styles.descriptionParagraph}
              dangerouslySetInnerHTML={{
                __html: data.gallery_description,
              }}
            />
          )}
          {activeTab === 'artworks' && <GalleryArtworks />}
          {activeTab === 'exhibitions' && (
            <>
              <GalleryExhibitions exhibitions={data.exhibitions} />
              <button className={styles.addButton}>+ 전시회 등록</button>
            </>
          )}
        </DetailTabs>
      </main>

      {showQrModal && (
        <QrModal data={data} onClose={() => setShowQrModal(false)} />
      )}
    </div>
  );
}
