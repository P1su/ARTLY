import styles from './SearchResultSection.module.css';
import { filterCategory } from '../../utils/filterCategory.js';
import SearchResultItem from '../SearchResultItem/SearchResultItem';

export default function SearchResultSection({ category, results }) {
  return (
    <section className={styles.layout}>
      <h2 className={styles.categoryTitle}>{filterCategory(category).label}</h2>
      <hr />
      <ul className={styles.resultList}>
        {!results || results.length === 0 ? (
          <div className={styles.emptyBox}>검색 결과가 없습니다</div>
        ) : (
          results.map(({ id, thumbnail, title }) => (
            <SearchResultItem
              key={id}
              link={`/${filterCategory(category).link}/${id}`}
              thumbnail={thumbnail}
              title={title}
            />
          ))
        )}
      </ul>
    </section>
  );
}
