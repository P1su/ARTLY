import styles from './GalleryArtworks.module.css';
import { Link, useLocation } from 'react-router-dom';

export default function GalleryArtworks({ artworks }) {
  const location = useLocation();
  const isConsolePage = location.pathname.includes('/console');
  console.log(artworks);
  if (!artworks || artworks.length === 0) {
    return <p className={styles.emptyContent}>현재 등록된 작품이 없습니다.</p>;
  }

  return (
    <section className={styles.artworkGrid}>
      {artworks.map(
        ({
          id,
          image_url,
          title,
          artist_name,
          artwork_materials,
          artwork_size,
          artwork_year,
        }) => {
          // 콘솔 페이지 여부에 따라 동적으로 경로 설정
          const destinationPath = isConsolePage
            ? `/console/artworks/${id}`
            : `/artworks/${id}`;

          return (
            <Link className={styles.artworkCard} key={id} to={destinationPath}>
              <img
                className={styles.artworkImage}
                src={image_url}
                alt={title}
              />
              <div className={styles.artworkInfo}>
                <h4 className={styles.title}>{title}</h4>
                <p className={styles.materials}>{artwork_materials}</p>
                <p
                  className={styles.details}
                >{`${artwork_size}, ${artwork_year}`}</p>
              </div>
            </Link>
          );
        },
      )}
    </section>
  );
}
