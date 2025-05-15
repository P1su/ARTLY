import NoticeTableHeader from './NoticeTableHeader/NoticeTableHeader';
import NoticeRow from './NoticeRow/NoticeRow';
import styles from './NoticeListTable.module.css';

export default function NoticeListTable({ data, currentPage, itemsPerPage }) {

  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageItems = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <table className={styles.table}>
      <NoticeTableHeader />
      <tbody>
        {pageItems.map((notice, index) => (
          <NoticeRow
            key={notice.id}
            notice={notice}
            displayId={startIndex + index + 1}
          />
        ))}
      </tbody>
    </table>
  );
}
