import { useNavigate } from 'react-router-dom';
import styles from './RelatedExhibitions.module.css';
import IcLocation from '../../../../../../assets/svg/IcLocation';

export default function RelatedExhibitions({ exhibitions = [] }) {
  const navigate = useNavigate();

  if (!exhibitions || exhibitions.length === 0) {
    return <p className={styles.emptyContent}>관련 전시가 없습니다.</p>;
  }

  return (
    <section className={styles.relatedSection}>
      <div className={styles.list}>
        {exhibitions.map(
          ({
            id,
            title,
            poster,
            start_date,
            end_date,
            organization,
            location,
          }) => (
            <div
              key={id}
              className={styles.card}
              onClick={() => navigate(`/exhibitions/${id}`)}
            >
              <div className={styles.imageWrapper}>
                <img src={poster} alt={title} className={styles.image} />
              </div>
              <div className={styles.info}>
                <h4 className={styles.title}>{title}</h4>
                <button
                  className={styles.locButton}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleOpen();
                  }}
                >
                  <IcLocation />
                </button>
                <p className={styles.meta}>
                  {organization || ''} / {location || ''}
                </p>
                <p className={styles.date}>
                  {start_date} ~ {end_date}
                </p>
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
