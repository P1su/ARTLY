import styles from './GalleryExhibitions.module.css';
import { Link, useLocation } from 'react-router-dom';

const STATUS_CONFIG = {
  exhibited: { text: '전시중', className: styles.statusOn },
  scheduled: { text: '전시예정', className: styles.statusScheduled },
  ended: { text: '전시종료', className: styles.statusDone },
  default: { text: '기타', className: styles.statusDefault },
};

// filter prop을 제거하여 범용 목록 컴포넌트로 변경
export default function GalleryExhibitions({ exhibitions }) {
  const location = useLocation();
  const isConsolePage = location.pathname.includes('/console');
  console.log('전시회', exhibitions);
  if (!exhibitions || exhibitions.length === 0) {
    return <p className={styles.emptyContent}>전시가 없습니다.</p>;
  }

  return (
    <section className={styles.exhibitionList}>
      {/* 이제 전체 exhibitions 배열을 그대로 map으로 렌더링합니다. */}
      {exhibitions.map(
        ({
          exhibition_id: id,
          exhibition_poster: poster,
          exhibition_title: title,
          exhibition_status: status,
          organization,
          start_date,
          end_date,
        }) => {
          const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.default;

          const destinationPath = isConsolePage
            ? `/console/exhibitions/${id}`
            : `/exhibitions/${id}`;

          return (
            <Link
              className={styles.exhibitionCard}
              key={id}
              to={destinationPath}
            >
              <div className={styles.imageContainer}>
                <img
                  className={styles.exhibitionImage}
                  src={poster}
                  alt='전시 포스터 이미지'
                />
                <span
                  className={`${styles.statusTag} ${statusConfig.className}`}
                >
                  {statusConfig.text}
                </span>
              </div>

              <div className={styles.infoContainer}>
                <h4 className={styles.title}>{title}</h4>
                <p className={styles.organization}>{organization}</p>
                <p className={styles.date}>{`${start_date} - ${end_date}`}</p>
              </div>
            </Link>
          );
        },
      )}
    </section>
  );
}
