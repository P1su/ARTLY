import styles from './ConsoleDetail.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import useResponsive from '../../hooks/useResponsive';
import ExhibitionDetail from '../../pages/Category/Exhibition/ExhibitionDetail/ExhibitionDetail';

export default function ConsoleDetail() {
  const { id: exhibitionId } = useParams();
  const navigate = useNavigate();
  useResponsive();

  console.log('Current Exhibition ID:', exhibitionId);

  const handleGoBack = () => navigate(-1);
  const handleEdit = () => alert('정보 수정 페이지로 이동합니다.');
  const handleQr = () => alert('QR코드 생성 페이지로 이동합니다.');
  const handleLeaflet = () => alert('리플렛/도록 제작 페이지로 이동합니다.');

  const adminTabs = [
    { label: '정보수정', action: handleEdit },
    { label: 'QR코드', action: handleQr },
    { label: '리플렛/도록', action: handleLeaflet },
  ];

  return (
    <div className={styles.layout}>
      <nav className={styles.adminTabNav}>
        {adminTabs.map(({ label, action }) => (
          <button
            key={label}
            className={styles.adminTabButton}
            onClick={action}
          >
            {label}
          </button>
        ))}
      </nav>

      <main className={styles.content}>
        <ExhibitionDetail showUserActions={false} />
      </main>
    </div>
  );
}
