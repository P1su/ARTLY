import styles from './FavButton.module.css';
import { FaStar } from 'react-icons/fa6';

export default function FavButton({ onFav, isFav }) {
  return (
    <button
      className={`${styles.favButton} ${isFav && styles.clickedFavButton}`}
      onClick={onFav}
    >
      <FaStar className={`${isFav && styles.clickedIcon}`} />
    </button>
  );
}
