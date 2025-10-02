import styles from './ConsoleDetail.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import useResponsive from '../../hooks/useResponsive';
import ArtworkDetail from '../../pages/Category/Artwork/ArtworkDetail/ArtworkDetail';
import GalleryDetail from '../../pages/Category/Gallery/GalleryDetail/GalleryDetail';
import ExhibitionDetail from '../../pages/Category/Exhibition/ExhibitionDetail/ExhibitionDetail';

const DETAIL_CONFIG = {
  gallery: {
    Component: GalleryDetail,
    tabs: [
      { label: '정보수정' },
      { label: 'QR코드' },
      { label: '리플렛/도록' },
    ],
  },
  exhibition: {
    Component: ExhibitionDetail,
    tabs: [
      { label: '정보수정' },
      { label: 'QR코드' },
      { label: '리플렛/도록' },
    ],
  },
  artwork: {
    Component: ArtworkDetail,
    tabs: [{ label: '정보수정' }, { label: 'QR코드' }, { label: '도슨트' }],
  },
};

export default function ConsoleDetail({ type }) {
  const { id } = useParams();
  useResponsive();

  const config = DETAIL_CONFIG[type];
  const { Component, tabs } = config;

  const handleTabClick = (label) => {
    alert(`${label} 페이지로 이동합니다. ID: ${id}`);
  };

  return (
    <div className={styles.layout}>
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
    </div>
  );
}
