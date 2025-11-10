import styles from './ConsoleDetail.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import useResponsive from '../../hooks/useResponsive';
import GalleryDetail from '../../pages/Category/Gallery/GalleryDetail/GalleryDetail';
import ExhibitionDetail from '../../pages/Category/Exhibition/ExhibitionDetail/ExhibitionDetail';
import { useEffect, useState } from 'react';
import DetailTabs from '../../components/DetailTabs/DetailTabs';
import { userInstance } from '../../apis/instance';
import GalleryExhibitions from '../../pages/Category/Gallery/GalleryDetail/components/GalleryExhibitions/GalleryExhibitions';
import QrModal from './QrModal/QrModal';
import GalleryArtworks from './components/GalleryArtworks/GalleryArtworks';
import ArtworkDetail from '../../pages/Category/Artwork/ArtworkDetail/ArtworkDetail';

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
    fetchUrl: (id) => `/api/arts/${id}`,
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
      const response = await userInstance.get(config.fetchUrl(id));
      setData(response.data);
    };
    fetchData();
    setActiveTab('info');
  }, [id, type]);

  const config = DETAIL_CONFIG[type];
  const { Component, tabs } = config;

  const handleTabClick = (label) => {
    if (label === '정보수정') {
      navigate(`/console/${type}/edit/${id}`);
    } else if (label === 'QR코드') {
      setShowQrModal(true);
    } else {
      // navigate(`/console/reaflet/${id}`);
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
          onClick={() => navigate('/console/main')}
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

        {type !== 'artworks' ? (
          <DetailTabs
            tabs={contentTabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          >
            {activeTab === 'info' &&
              (data.gallery_description ? (
                <div
                  className={styles.descriptionParagraph}
                  dangerouslySetInnerHTML={{
                    __html: data.gallery_description,
                  }}
                />
              ) : (
                <p className={styles.emptyContent}>
                  현재 등록된 정보가 없습니다.
                </p>
              ))}
            {activeTab === 'artworks' && (
              <>
                <GalleryArtworks artworks={data.artworks} />
                <button className={styles.addButton}>+ 작품 등록</button>
              </>
            )}
            {activeTab === 'exhibitions' && (
              <>
                <GalleryExhibitions exhibitions={data.exhibitions} />
                <button className={styles.addButton}>+ 전시회 등록</button>
              </>
            )}
          </DetailTabs>
        ) : (
          ''
        )}
      </main>

      {showQrModal && (
        <QrModal data={data} onClose={() => setShowQrModal(false)} />
      )}
    </div>
  );
}
