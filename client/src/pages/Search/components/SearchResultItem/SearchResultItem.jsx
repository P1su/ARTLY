import styles from './SearchResultItem.module.css';
import { Link } from 'react-router-dom';

export default function SearchResultItem({ link, title, image }) {
  return (
    <Link className={styles.layout} to={link}>
      <img className={styles.itemImage} src={image} />
      <span>{title}</span>
    </Link>
  );
}
