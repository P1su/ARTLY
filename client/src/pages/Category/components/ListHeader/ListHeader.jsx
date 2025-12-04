import styles from './ListHeader.module.css';
import { FaHeart } from 'react-icons/fa';
import IcSearch from './../../../../assets/svg/IcSearch';

export default function ListHeader({
  title,
  onEvent,
  onSearch,
  value,
  isArtworks = false,
}) {
  return (
    <div className={styles.layout}>
      <div className={styles.titleContainer}>
        <h1 className={styles.listTitle}>{title}</h1>
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
