import styles from './ListHeader.module.css';
import { FaHeart } from 'react-icons/fa';
import IcSearch from './../../../../assets/svg/IcSearch';

export default function ListHeader({
  title,
  isFav,
  onEvent,
  onFav,
  onSearch,
  value,
  isNews = false,
  isArtworks = false,
}) {
  return (
    <div className={styles.layout}>
      <div className={styles.titleContainer}>
        <h1 className={styles.listTitle}>{title}</h1>
        {!isNews && !isArtworks && (
          <button
            className={`${styles.favButton} ${isFav && styles.clickedFavButton}`}
            onClick={onFav}
          >
            <FaHeart className={`${isFav && styles.clickedIcon}`} />
            좋아요
          </button>
        )}
      </div>

      {!isArtworks && (
        <form className={styles.searchForm} action={onEvent}>
          <input
            className={styles.searchInput}
            placeholder='검색...'
            onChange={onSearch}
            value={value}
          />
          <button className={styles.formButton}>
            <IcSearch />
          </button>
        </form>
      )}
    </div>
  );
}
