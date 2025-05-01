import styles from './SearchBar.module.css';

export default function SearchBar() {
  return (
    <div className={styles.searchBarContainer}>
      <span className={styles.searchIcon}>🔍</span>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="참여하고 싶은 행사를 검색해 보세요"
      />
      <button className={styles.searchButton}>검색</button>
    </div>
  );
}
