import styles from './SearchResultSection.module.css';
import SearchResultItem from '../SearchResultItem/SearchResultItem';

export default function SearchResultSection({ category, results }) {
  const transCategory = (category) => {
    switch (category) {
      case 'exhibition':
        return {
          label: '전시회',
          link: 'exhibitions',
        };
      case 'gallery':
        return {
          label: '갤러리',
          link: 'galleries',
        };
      case 'artist':
        return {
          label: '작가',
          link: 'artists',
        };
      case 'notice':
        return {
          label: '공고',
          link: 'notices',
        };
      default:
        break;
    }
  };

  return (
    <section className={styles.layout}>
      <h2 className={styles.categoryTitle}>{transCategory(category).label}</h2>
      <hr />
      <ul className={styles.resultList}>
        {results.filter((item) => item.type === category).length === 0 ? (
          <span>검색 결과가 없습니다</span>
        ) : (
          results
            .filter((item) => item.type === category)
            .map(({ id, thumbnail, title }) => (
              <SearchResultItem
                key={id}
                link={`/${transCategory(category).link}/${id}`}
                thumbnail={thumbnail}
                title={title}
              />
            ))
        )}
      </ul>
    </section>
  );
}
