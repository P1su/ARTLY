import styles from './ArtworkDetailSection.module.css';
import ArtworkInfo from './ArtworkInfo/ArtworkInfo';
import DocentScript from './DocentScript/DocentScript';

const ArtworkDetailSection = ({ title, image, artist, info, script }) => {
  return (
    <div className={styles.detailSection}>
      <ArtworkInfo
        title={title}
        image={image}
        artist={artist}
        info={info}
      />
      <DocentScript script={script} /> 
    </div>
  );
};


export default ArtworkDetailSection;