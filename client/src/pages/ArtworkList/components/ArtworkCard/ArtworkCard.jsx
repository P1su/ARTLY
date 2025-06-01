import styles from './ArtworkCard.module.css';
import { Link } from 'react-router-dom';

export default function ArtworkList({ artworkItems }) {
  const {
    id,
    art_image: image,
    art_title: title,
    art_description: description,
  } = artworkItems;
  return (
    <Link className={styles.layout} to={`/artwork-detail/${id}`}>
      <img className={styles.artworkImage} src={image} alt='대표 이미지' />
      <h3 className={styles.artworkTitle}>{title}</h3>
      <p className={styles.subParagraph}>{description}</p>
    </Link>
  );
}
