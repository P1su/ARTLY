import styles from './Main.module.css';
import FilterTab from '../../components/FilterTab/FilterTab';
import Dropdown from '../../components/Dropdown/Dropdown';

export default function Main() {
  const filterList = ['최신순', '인기순', '날짜순', '조회순'];

  return (
    <div className={styles.layout}>
      <h1>아뜰리</h1>
      메인페이지입니다.
      <FilterTab filterList={filterList} />
    </div>
  );
}
