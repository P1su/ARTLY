import styles from './Pagination.module.css';

export default function Pagination({
  currentPage,
  onPageChange,
  totalItems,
  itemsPerPage = 10,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers = getPageNumbers(currentPage, totalPages, 5);

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.sideButtonContainer}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className={styles.pageButton}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
      </div>

      <div className={styles.pageNumbersContainer}>
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`${styles.pageButton} ${
              currentPage === page ? styles.active : ''
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <div className={styles.sideButtonContainer}>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className={styles.pageButton}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}

const getPageNumbers = (currentPage, totalPages, maxVisible) => {
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(currentPage - half, 1);
  let end = Math.min(start + maxVisible - 1, totalPages);

  if (end - start + 1 < maxVisible) {
    start = Math.max(end - maxVisible + 1, 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};
