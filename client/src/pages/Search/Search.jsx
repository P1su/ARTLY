import styles from './Search.module.css';
import { useLocation } from 'react-router-dom';
import { mockResults } from './mock/mockSearchResult.js';
import SearchResultSection from './components/SearchResultSection/SearchResultSection';

export default function Search() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const queryString = params.get('query');

  return (
    <div className={styles.layout}>
      <h1 className={styles.summaryTitle}>
        <span className={styles.queryStringSpan}>{queryString} </span>에 대한
        검색 결과
      </h1>
      <section className={styles.resultSection}>
        <SearchResultSection category='exhibition' results={mockResults} />
        <SearchResultSection category='gallery' results={mockResults} />
        <SearchResultSection category='artist' results={mockResults} />
        <SearchResultSection category='notice' results={mockResults} />
      </section>
    </div>
  );
}
