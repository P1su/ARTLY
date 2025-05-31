import styles from './NewsCategoryTabs.module.css';

export default function NewsCategoryTabs({ filterStatus, setFilterStatus, sortOption, setSortOption }) {
  return (
    <div className={styles.tabContainer}>
      <select
        className={styles.selectBox}
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
      >
        <option value="진행중">진행중</option>
        <option value="예정">예정</option>
        <option value="종료">종료</option>
      </select>

      <select
        className={styles.selectBox}
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
      >
        <option value="최신순">최신순</option>
        <option value="종료임박순">종료순</option>
      </select>
    </div>
  );
}
