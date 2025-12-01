import styles from './ExhibitionsCards.module.css';
import { Link, useLocation } from 'react-router-dom';

const STATUS_CONFIG = {
  exhibited: { text: '전시중', className: styles.statusOn },
  scheduled: { text: '전시예정', className: styles.statusScheduled },
  ended: { text: '전시종료', className: styles.statusDone },
  default: { text: '기타', className: styles.statusDefault },
};

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export default function ExhibitionsCards({ exhibitions }) {
  const location = useLocation();
  const isConsolePage = location.pathname.includes('/console');
  console.log('갤러리 전시회', exhibitions);
  if (!exhibitions || exhibitions.length === 0) {
    return <p className={styles.emptyContent}>현재 등록된 전시가 없습니다.</p>;
  }

  return (
    <section className={styles.exhibitionList}>
      {exhibitions.map(
        ({
          id,
          exhibition_poster: poster,
          exhibition_title: title,
          exhibition_status: status,
          exhibition_location: exhibitionLocation,
          exhibition_start_date: start_date,
          exhibition_end_date: end_date,
        }) => {
          const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.default;
          const destinationPath = isConsolePage
            ? `/console/exhibitions/${id}`
            : `/exhibitions/${id}`;

          const imageUrl =
            poster && !poster.startsWith('http')
              ? `${BASE_URL}/${poster}`
              : poster;

          return (
            <Link
              className={styles.exhibitionCard}
              key={id}
              to={destinationPath}
            >
              <div className={styles.imageContainer}>
                <img
                  className={styles.exhibitionImage}
                  src={imageUrl}
                  alt='전시 포스터 이미지'
                />
                <span
                  className={`${styles.statusTag} ${statusConfig.className}`}
                >
                  {statusConfig.text}
                </span>
              </div>

              <div className={styles.infoContainer}>
                <h4 className={styles.title}>{title || '정보 없음'}</h4>
                <p className={styles.location}>
                  {exhibitionLocation || '주소 정보 없음'}
                </p>
                <p
                  className={styles.date}
                >{`${start_date || '정보 없음'} ~ ${end_date || '정보 없음'}`}</p>
              </div>
            </Link>
          );
        },
      )}
    </section>
  );
}
