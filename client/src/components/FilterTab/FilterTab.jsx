import styles from './FilterTab.module.css';

export default function FilterTab() {
  const tmpList = ['최신순', '인기순', '날짜순'];
  return (
    <div className={styles.layout}>
      <ul className={styles.filterList}>
        {tmpList.map((item) => (
          <li className={styles.filterItem}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
