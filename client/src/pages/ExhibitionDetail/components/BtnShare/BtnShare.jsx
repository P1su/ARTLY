import styles from './BtnShare.module.css';

export default function BtnShare() {
  const handleShare = () => {
    alert('공유하기 구현 예정');
  };

  return (
    <button className={styles.buttonWrapper} onClick={handleShare}>
      {/* 아이콘 대체 예정 */}
      <span>공유하기</span>
    </button>
  );
}
