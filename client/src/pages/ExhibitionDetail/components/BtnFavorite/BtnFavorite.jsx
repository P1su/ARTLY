import styles from './BtnFavorite.module.css';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function BtnFavorite() {
  const [isFavorite, setIsFavorite] = useState(false);
  const { exhibitionId } = useParams();

  const handleFavorite = () => {
    // id를 바탕으로 좋아요 업데이트 api 연결
    console.log(exhibitionId);

    setIsFavorite(!isFavorite);
  };

  return (
    <button className={styles.buttonWrapper} onClick={handleFavorite}>
      {/* 아이콘 수정 예정 */}
      <span>{isFavorite ? '좋아요 취소' : '좋아요'}</span>
    </button>
  );
}
