import Img from '../../../../components/Img/Img';
import styles from './SearchResultItem.module.css';
import { Link } from 'react-router-dom';

export default function SearchResultItem({ link, thumbnail, title }) {
  return (
    <Link className={styles.layout} to={link}>
      <Img className={styles.itemImage} src={thumbnail} />
      <span className={styles.itemSpan}>{title}</span>
    </Link>
  );
}
