import styles from './SearchBar.module.css';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const navigate = useNavigate();

  const handleSearch = (formData) => {
    const query = formData.get('query');
    navigate(`/search?query=${query}`);
  };

  return (
    <form className={styles.searchBarContainer} action={handleSearch}>
      <span className={styles.searchIcon}>🔍</span>
      <input
        type='text'
        className={styles.searchInput}
        placeholder='참여하고 싶은 행사를 검색해 보세요'
        name='query'
      />
      <button className={styles.searchButton} type='submit'>
        검색
      </button>
    </form>
  );
}
