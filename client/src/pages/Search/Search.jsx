import styles from './Search.module.css';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { instance } from '../../apis/instance.js';
import { filterResults } from './utils/filterResults.js';
import SearchResultSection from './components/SearchResultSection/SearchResultSection';

export default function Search() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const queryString = params.get('query');
  const [results, setResults] = useState({});

  const getSearchResult = async () => {
    try {
      const response = await instance.get('/api/search', {
        params: {
          search: queryString,
        },
      });

      setResults(response.data);
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    getSearchResult();
  }, [queryString]);

  return (
    <div className={styles.layout}>
      <h1 className={styles.summaryTitle}>
        <span className={styles.queryStringSpan}>{queryString} </span>에 대한
        검색 결과
      </h1>
      <section className={styles.resultSection}>
        <SearchResultSection
          category='exhibition'
          results={filterResults(results.exhibitions, 'exhibition')}
        />
        <SearchResultSection
          category='gallery'
          results={filterResults(results.galleries, 'gallery')}
        />
        <SearchResultSection
          category='artist'
          results={filterResults(results.artists, 'artist')}
        />
        <SearchResultSection
          category='notice'
          results={filterResults(results.announcements, 'notice')}
        />
      </section>
    </div>
  );
}
