import styles from './ArtworkDetailSection.module.css';
import ArtworkInfo from './ArtworkInfo/ArtworkInfo';
import DocentScript from './DocentScript/DocentScript';

export default function ArtworkDetailSection({ title, image, artist, info, script }) {
  return (
    <section className={styles.detailContainer}>
      <ArtworkInfo
        title={title}
        image={image}
        artist={artist}
        info={info}
      />
      <DocentScript script={script} />
    </section>
  );
}
