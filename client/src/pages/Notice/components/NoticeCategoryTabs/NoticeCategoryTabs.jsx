import styles from './NoticeCategoryTabs.module.css';

export default function NoticeCategoryTabs({
  filterOption,
  setFilterOption,
}) {
  const options = ['공모', '프로그램', '레지던시', '지원사업', '채용'];

  return (
    <div className={styles.dropdownContainer}>
      <select className={styles.dropdown}>
        <option value="최신순">최신순</option>
        <option value="종료순">종료순</option>
      </select>

      <select
        className={styles.dropdown}
        value={filterOption}
        onChange={(e) => setFilterOption(e.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
