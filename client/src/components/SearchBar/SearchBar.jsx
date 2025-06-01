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
      <input
        type='text'
        className={styles.searchInput}
        placeholder=''
        name='query'
      />
    </form>
  );
}
