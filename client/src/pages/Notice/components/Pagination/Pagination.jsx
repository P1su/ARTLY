import styles from './Pagination.module.css';

export default function Pagination({ currentPage, onPageChange, totalItems, itemsPerPage = 10 }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers = getPageNumbers(currentPage, totalPages, 5);

  return (
    <div className={styles.paginationContainer}>
      {currentPage > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className={styles.pageButton}>«</button>
          <button onClick={() => onPageChange(currentPage - 1)} className={styles.pageButton}>‹</button>
        </>
      )}

      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
        >
          {page}
        </button>
      ))}

      {currentPage < totalPages && (
        <>
          <button onClick={() => onPageChange(currentPage + 1)} className={styles.pageButton}>›</button>
          <button onClick={() => onPageChange(totalPages)} className={styles.pageButton}>»</button>
        </>
      )}
    </div>
  );
}

const getPageNumbers = (currentPage, totalPages, maxVisible = 5) => {
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, currentPage + half);

  if (end - start + 1 < maxVisible) {
    if (start === 1) {
      end = Math.min(totalPages, start + maxVisible - 1);
    } else if (end === totalPages) {
      start = Math.max(1, end - maxVisible + 1);
    }
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};
