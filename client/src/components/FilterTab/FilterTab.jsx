import styles from './FilterTab.module.css';

export default function FilterTab({ filterList }) {
  return (
    <div className={styles.layout}>
      <ul className={styles.filterList}>
        {filterList.map((item) => (
          <li className={styles.filterItem}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
