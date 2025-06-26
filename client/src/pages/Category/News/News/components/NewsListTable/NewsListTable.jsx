import NewsTableHeader from './NewsTableHeader/NewsTableHeader';
import NewsRow from './NewsRow/NewsRow';
import styles from './NewsListTable.module.css';

export default function NewsListTable({ data, currentPage }) {
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageItems = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <table className={styles.table}>
      <NewsTableHeader />
      <tbody>
        {pageItems.map((notice, index) => (
          <NewsRow
            key={notice.id}
            notice={notice}
            displayId={startIndex + index + 1}
          />
        ))}
      </tbody>
    </table>
  );
}
