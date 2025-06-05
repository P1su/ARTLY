import styles from './StickyMenu.module.css';
import { Link } from 'react-router-dom';
import useScroll from '../../hooks/useScroll';

export default function StickyMenu({ id }) {
  const barPosition = useScroll();

  return (
    <div className={styles.layout} style={{ top: barPosition }}>
      <div className={styles.linkWrapper}>
        <Link to={`/reservation/${id}`}>신청</Link>
      </div>
      <hr className={styles.divider} />
      <div className={styles.linkWrapper}>
        <Link className={styles.navigateButton} to={`/catalog/${id}`}>
          도록 구매
        </Link>
      </div>
    </div>
  );
}
