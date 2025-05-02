import styles from './Test.module.css';
import SearchList from './components/SearchList/SearchList';
import Menu from '../../components/Menu/Menu';

export default function Test() {
  return (
    <div className={styles.layout}>
      <h1>아뜰리</h1>
      테스트페이지입니다.
      <SearchList />
    </div>
  );
}
