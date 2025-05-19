import styles from './ArtworkInfo.module.css';

const ArtworkInfo = ({ title, image, artist, info }) => {
  return (
    <div className={styles.infoContainer}>
      <img src={image} alt={`${title} 이미지`} className={styles.image} />
      <div className={styles.textBox}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.artist}>{artist}</p>
        <p className={styles.meta}>{info}</p>
      </div>
    </div>
  );
};

export default ArtworkInfo;