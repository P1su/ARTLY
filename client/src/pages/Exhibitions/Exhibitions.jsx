import styles from './Exhibitions.module.css';
import { mockExhibitionList } from './mock/mockExhibitionList.js';

export default function Exhibitions() {
  return (
    <div className={styles.layout}>
      <section className={styles.exhibitionListSection}>
        {mockExhibitionList.map(({ id, image, name, gallery, date }) => (
          <div className={styles.exhibitionItemContainer} key={id}>
            <img
              className={styles.exhibitionImage}
              src={image}
              alt='전시회 대표 이미지'
            />
            <span className={styles.titleSpan}>{name}</span>
            <span className={styles.subSpan}>{gallery}</span>
            <span className={styles.subSpan}>{date}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
