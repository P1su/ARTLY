import styles from './Poster.module.css';
import ImageGenerator from './../../components/ImageGenerator/ImageGenerator';
import { useNavigate } from 'react-router-dom';

export default function Poster() {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.layout}>
      <ImageGenerator />
      <button className={styles.backButton} onClick={handleBack}>
        목록으로 돌아가기
      </button>
    </div>
  );
}
