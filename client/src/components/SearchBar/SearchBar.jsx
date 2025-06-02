import styles from './SearchBar.module.css';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ onClose }) {
  const navigate = useNavigate();

  const handleSearch = (formData) => {
    onClose();
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
