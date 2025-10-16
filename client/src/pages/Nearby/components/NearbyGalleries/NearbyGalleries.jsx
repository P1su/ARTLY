import styles from './NearbyGalleries.module.css';
import GalleryCard from '../GalleryCard/GalleryCard';
import usePagination from '../../../../hooks/usePagination';
import Pagination from '../../../../components/Pagination/Pagination';

export default function NearbyGalleries({ results }) {
  const { currentPage, setCurrentPage, pageItems } = usePagination(10, results);

  return (
    <section className={styles.layout}>
      <div>
        <h2 className={styles.searchTitle}>주변 갤러리 검색 결과</h2>
        <p className={styles.resultNumParagraph}>
          총 <span className={styles.highlightSpan}>{results.length}</span> 개의
          갤러리
        </p>
      </div>
      {results.length === 0 && <div>조회된 데이터가 없습니다.</div>}
      {pageItems.map((item) => (
        <GalleryCard key={item.id} galleryItem={item} />
      ))}
      <div className={styles.paginationRow}>
        <Pagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalItems={results.length}
        />
      </div>
    </section>
  );
}
