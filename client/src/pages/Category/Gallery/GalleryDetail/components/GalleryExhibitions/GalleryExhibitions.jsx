import styles from './GalleryExhibitions.module.css';
import { Link, useLocation } from 'react-router-dom';

const STATUS_CONFIG = {
  exhibited: { text: '전시중', className: styles.statusOn },
  scheduled: { text: '전시예정', className: styles.statusScheduled },
  ended: { text: '전시종료', className: styles.statusDone },
  default: { text: '기타', className: styles.statusDefault },
};

export default function GalleryExhibitions({ exhibitions, filter }) {
  const location = useLocation();
  const isConsolePage = location.pathname.includes('/console');

  const targetStatus = filter === 'ongoing' ? 'exhibited' : 'scheduled';

  const filteredExhibitions = exhibitions.filter(
    (item) => item.status === targetStatus,
  );

  if (!filteredExhibitions || filteredExhibitions.length === 0) {
    const message =
      filter === 'ongoing'
        ? '현재 진행중인 전시가 없습니다.'
        : '예정된 전시가 없습니다.';
    return <p className={styles.emptyContent}>{message}</p>;
  }

  return (
    <section className={styles.exhibitionList}>
      {filteredExhibitions.map(
        ({ id, poster, title, status, organization, start_date, end_date }) => {
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
