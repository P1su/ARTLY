import styles from './ConsoleDetail.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useResponsive from '../../hooks/useResponsive';
import { userInstance } from '../../apis/instance';
import DetailTabs from '../../components/DetailTabs/DetailTabs';
import QrModal from './components/QrModal/QrModal';
import GalleryDetail from '../../pages/Category/Gallery/GalleryDetail/GalleryDetail';
import ExhibitionDetail from '../../pages/Category/Exhibition/ExhibitionDetail/ExhibitionDetail';
import ArtworkDetail from '../../pages/Category/Artwork/ArtworkDetail/ArtworkDetail';
import ArtworksCards from './components/ArtworksCards/ArtworksCards';
import ExhibitionsCards from '../../pages/Category/Gallery/GalleryDetail/components/ExhibitionsCards/ExhibitionsCards';

const DETAIL_CONFIG = {
  galleries: {
    title: '갤러리',
    Component: GalleryDetail,
    fetchUrl: (id) => `/api/galleries/${id}`,
    tabs: ['정보수정', 'QR코드', '리플렛/도록'],
  },
  exhibitions: {
    title: '전시회',
    Component: ExhibitionDetail,
    fetchUrl: (id) => `/api/exhibitions/${id}`,
    tabs: ['정보수정', 'QR코드', '리플렛/도록'],
  },
  artworks: {
    title: '작품',
    Component: ArtworkDetail,
    fetchUrl: (id) => `/api/arts/${id}`,
    tabs: ['정보수정', 'QR코드', '도슨트'],
  },
};

export default function ConsoleDetail({ type }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [showQrModal, setShowQrModal] = useState(false);

  const config = DETAIL_CONFIG[type];
  const { title, Component, fetchUrl, tabs } = config || {};

  useEffect(() => {
    if (!fetchUrl || !id) return;

    const fetchData = async () => {
      try {
        const res = await userInstance.get(fetchUrl(id));
        setData(res.data);
      } catch (error) {
        console.error('데이터 불러오기 실패:', error);
      }
    };

    fetchData();
    setActiveTab('info');
  }, [id, type]);

  const handleTabClick = (label) => {
    switch (label) {
      case '정보수정':
        navigate(`/console/${type}/edit/${id}`);
        break;
      case 'QR코드':
        setShowQrModal(true);
        break;
      default:
        navigate(`/console/leaflet/${id}`);
        break;
    }
  };

  const contentTabs = [
    { key: 'info', label: '정보' },
    { key: 'artworks', label: `작품(${data?.artworks?.length || 0})` },
    { key: 'exhibitions', label: `전시(${data?.exhibitions?.length || 0})` },
  ];

  if (!data) return <div>데이터 로딩 중...</div>;

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() =>
            navigate('/console/main', { state: { activeTab: `${title}관리` } })
          }
        >
          {'<'}
        </button>
        <h1 className={styles.title}>{title}</h1>
      </header>

      <nav className={styles.adminTabNav}>
        {tabs.map((label) => (
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

        {/* 갤러리는 컴포넌트 안에 이미 정보/작품/전시 탭이 있으므로 중복 출력 X */}
        {type !== 'artworks' && type !== 'galleries' && (
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
                <ArtworksCards artworks={data.artworks} />
                <button className={styles.addButton}>+ 작품 등록</button>
              </>
            )}

            {activeTab === 'exhibitions' && (
              <>
                <ExhibitionsCards exhibitions={data.exhibitions} />
                <button className={styles.addButton}>+ 전시회 등록</button>
              </>
            )}
          </DetailTabs>
        )}
      </main>

      {showQrModal && (
        <QrModal data={data} onClose={() => setShowQrModal(false)} />
      )}
    </div>
  );
}
