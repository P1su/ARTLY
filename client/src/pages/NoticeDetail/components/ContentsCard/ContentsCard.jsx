import styles from './ContentsCard.module.css';

export default function ContentsCard({ image, alt }) {
  return (
    <div className={styles.card}>
      <img src={image} alt={alt} className={styles.image} />
    </div>
  );
}
