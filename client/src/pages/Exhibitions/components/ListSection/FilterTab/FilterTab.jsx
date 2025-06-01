import styles from './FilterTab.module.css';

export default function FilterTab({ count }) {
  return <p className={styles.resultText}>{count}개의 전시 검색 결과</p>;
}
