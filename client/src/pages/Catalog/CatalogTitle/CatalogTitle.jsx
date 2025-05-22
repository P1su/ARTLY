import { useNavigate } from 'react-router-dom';
import styles from './CatalogTitle.module.css';

export default function CatalogTitle({ onToggleIndex }) {
  const navigate = useNavigate();

  const handleExit = () => {
    navigate('/mypage'); 
  };

  return (
    <div className={styles.titleBar}>
      <div className={styles.leftButtons}>
        <button className={styles.button} onClick={onToggleIndex}>
          목차 보기
        </button>
      </div>
      <h1 className={styles.title}>표지</h1>
      <div className={styles.rightButtons}>
        <button className={styles.button} onClick={handleExit}>
          열람 종료
        </button>
      </div>
    </div>
  );
}