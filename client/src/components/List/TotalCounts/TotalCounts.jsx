import styles from './TotalCounts.module.css';

export default function TotalCounts({ num, label }) {
  return (
    <p className={styles.countParagraph}>
      총 <strong className={styles.counts}>{num}</strong>개의 {label} 검색 결과
    </p>
  );
}
