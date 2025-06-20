import styles from './ListHeader.module.css';
import { FaHeart, FaSearch } from 'react-icons/fa';

export default function ListHeader({
  title,
  placeholder,
  isFav,
  onEvent,
  onFav,
  onSearch,
  value,
  isNews = false,
}) {
  return (
    <div className={styles.layout}>
      <div className={styles.titleContainer}>
        <h1 className={styles.listTitle}>{title}</h1>
        {!isNews && (
          <button
            className={`${styles.favButton} ${isFav && styles.clickedFavButton}`}
            onClick={onFav}
          >
            <FaHeart className={`${isFav && styles.clickedIcon}`} />
            좋아요
          </button>
        )}
      </div>
      <form className={styles.searchForm} action={onEvent}>
        <input
          className={styles.searchInput}
          placeholder={placeholder}
          onChange={onSearch}
          value={value}
        />
        <button className={styles.formButton}>
          <FaSearch />
        </button>
      </form>
    </div>
  );
}
