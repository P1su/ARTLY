import React from 'react';
import NoticeTableHeader from './NoticeTableHeader/NoticeTableHeader';
import NoticeRow from './NoticeRow/NoticeRow';
import { mockNotice } from '../../../mock/mockNotice';
import styles from './NoticeListTable.module.css';

export default function NoticeListTable({ activeTab, currentPage }) {
  const itemsPerPage = 10;
  const filtered = mockNotice.filter((item) => item.category === activeTab);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(startIndex, startIndex + itemsPerPage);

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
