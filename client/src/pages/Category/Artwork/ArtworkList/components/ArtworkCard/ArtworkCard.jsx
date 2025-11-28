import styles from './ArtworkCard.module.css';
import { Link } from 'react-router-dom';

export default function ArtworkList({ artworkItems }) {
  const {
    id,
    art_image: image,
    art_title: title,
    art_description: description,
  } = artworkItems;
  const cleanDescription = description
    ? description.replace(/(<([^>]+)>)/gi, '')
    : '정보 없음';

  return (
    <Link className={styles.layout} to={`/artworks/${id}`}>
      <img className={styles.artworkImage} src={image} alt='대표 이미지' />
      <h3 className={styles.artworkTitle}>{title}</h3>
      <p className={styles.subParagraph}>{cleanDescription}</p>
    </Link>
  );
}
