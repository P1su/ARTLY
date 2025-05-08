import styles from './StickyMenu.module.css';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function StickyMenu() {
  const { exhibitionId } = useParams();

  const initialBarPosition = 200;
  const [barPosition, setBarPosition] = useState(initialBarPosition);

  const handleScroll = () => {
    const position =
      1000 < initialBarPosition + window.scrollY
        ? 1000
        : initialBarPosition + window.scrollY;
    setBarPosition(position);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={styles.layout} style={{ top: barPosition }}>
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
