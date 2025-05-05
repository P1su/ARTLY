import styles from './StickyMenu.module.css';
import { Link, useParams } from 'react-router-dom';

export default function StickyMenu() {
  const { exhibitionId } = useParams();

  return (
    <div className={styles.layout}>
      <div className={styles.linkWrapper}>
        <Link to={`/reservation/${exhibitionId}`}>신청</Link>
      </div>
      <hr className={styles.divider} />
      <div className={styles.linkWrapper}>
        <Link className={styles.navigateButton} to={`/catalog/${exhibitionId}`}>
          도록 구매
        </Link>
      </div>
    </div>
  );
}
