import styles from './ArtworkInfo.module.css';

export default function ArtworkInfo({ title, image, artist, info }) {
  return (
    <article className={styles.infoContainer}>
      <img src={image} alt={`${title} 이미지`} className={styles.infoImage} />
      <div className={styles.textBox}>
        <h3 className={styles.infoTitle}>{title}</h3>
        <p className={styles.artistText}>{artist}</p>
        <p className={styles.metaText}>{info}</p>
      </div>
    </article>
  );
}
