import styles from './ConsoleDetail.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { userInstance } from '../../apis/instance';
import QrModal from './components/QrModal/QrModal';
import GalleryDetail from '../../pages/Category/Gallery/GalleryDetail/GalleryDetail';
import ExhibitionDetail from '../../pages/Category/Exhibition/ExhibitionDetail/ExhibitionDetail';
import ArtworkDetail from '../../pages/Category/Artwork/ArtworkDetail/ArtworkDetail';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const DETAIL_CONFIG = {
  galleries: {
    title: '갤러리',
    Component: GalleryDetail,
    tabs: ['정보수정', 'QR코드', '리플렛/도록'],
    fetchUrl: (id) => `/api/galleries/${id}`,
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
  const [showQrModal, setShowQrModal] = useState(false);

  const config = DETAIL_CONFIG[type];
  const { title, Component, fetchUrl, tabs } = config || {};

  const getTabNameByType = (t) => {
    switch (t) {
      case 'galleries':
        return '갤러리관리';
      case 'exhibitions':
        return '전시회관리';
      case 'artworks':
        return '작품관리';
      default:
        return '갤러리관리';
    }
  };

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
  }, [id, type, fetchUrl]);

  const handleTabClick = (label) => {
    switch (label) {
      case '정보수정':
        navigate(`/console/${type}/edit/${id}`);
        break;
      case 'QR코드':
        setShowQrModal(true);
        break;
      case '도슨트':
        navigate(`/console/artworks/docent/${id}`); // 작품 페이지 한정, leaflet 대신 도슨트 관리로 이동 가능
        break;
      default:
        navigate(`/console/${type}/leaflet/${id}`);
        break;
    }
  };
  const actionButtons = {
    artworks: (
      <button
        className={styles.addButton}
        // 전시회 디테일에서 눌렀다면 exhibition_id를 넘겨서 자동 선택되게 함
        onClick={() =>
          navigate(`/console/artworks/edit/new?exhibition_id=${id}`)
        }
      >
        + 작품 등록
      </button>
    ),
    exhibitions: (
      <button
        className={styles.addButton}
        // 갤러리 디테일에서 눌렀다면 gallery_id를 넘김
        onClick={() =>
          navigate(`/console/exhibitions/edit/new?gallery_id=${id}`)
        }
      >
        + 전시회 등록
      </button>
    ),
  };

  if (!data) return <LoadingSpinner />;

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() =>
            navigate('/console/main', {
              state: { activeTab: getTabNameByType(type) },
            })
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
        <Component
          showUserActions={false}
          id={id}
          actionButtons={actionButtons}
        />
      </main>

      {showQrModal && (
        <QrModal
          data={data}
          onClose={() => setShowQrModal(false)}
          type={type}
        />
      )}
    </div>
  );
}
