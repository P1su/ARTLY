import { useNavigate } from 'react-router-dom';
import styles from './RelatedExhibitions.module.css';
import IcLocation from '../../../../../../assets/svg/IcLocation';
import MapModal from '../../../Exhibitions/components/MapModal/MapModal';
import { useState } from 'react';

export default function RelatedExhibitions({ exhibitions }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const exhibition = exhibitions.related_exhibitions;
  console.log(exhibition);
  if (!exhibition || exhibition.length === 0) {
    return <p className={styles.emptyContent}>관련 전시가 없습니다.</p>;
  }

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
    document.body.style.overflow = 'hidden';
  };

  const handleClose = () => {
    setIsOpen((prev) => !prev);
    document.body.style.overflow = 'unset';
  };
  console.log(exhibitions);

  return (
    <section className={styles.relatedSection}>
      {/* {isOpen && <MapModal item={exhibitions} onClose={handleClose} />} */}

      <div className={styles.list}>
        {exhibition.map(
          ({ id, title, poster, start_date, end_date, location }) => (
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
                  {exhibitions.organization || ''} | {location || ''}
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
