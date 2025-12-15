import { useNavigate } from 'react-router-dom';
import styles from './RelatedExhibitions.module.css';
import Img from '../../../../../../components/Img/Img';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export default function RelatedExhibitions({ exhibitions }) {
  const navigate = useNavigate();

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
            location,
            organization,
          }) => {
            const imageUrl =
              poster && !poster.startsWith('http')
                ? `${BASE_URL}/${poster}`
                : poster;

            return (
              <div
                key={id}
                className={styles.card}
                onClick={() => navigate(`/exhibitions/${id}`)}
              >
                <div className={styles.imageWrapper}>
                  <Img src={imageUrl} alt={title} className={styles.image} />
                </div>
                <div className={styles.info}>
                  <h4 className={styles.title}>{title || '정보 없음'}</h4>
                  <p className={styles.meta}>
                    {organization || '갤러리 정보 없음'} |{' '}
                    {location || '주소 정보 없음'}
                  </p>
                  <p className={styles.date}>
                    {start_date} ~ {end_date}
                  </p>
                </div>
              </div>
            );
          },
        )}
      </div>
    </section>
  );
}
