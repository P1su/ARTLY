import React from 'react';
import styles from './ExhibitionTable.module.css';

export default function ExhibitionTable({
  exhibitionList,
  selectedExhibitionIds,
  onExhibitionSelect,
  onSelectAll,
  isAllSelected,
  onExhibitionClick,
  onQRManageClick,
}) {
  const handleSelectAll = () => {
    onSelectAll(exhibitionList);
  };

  return (
    <div className={styles.tableCard}>
      {exhibitionList.length > 0 ? (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th className={styles.tableHeaderCell}>전시회명</th>
                <th className={`${styles.tableHeaderCell} ${styles.countCell}`}>
                  좋아요
                </th>
                <th className={`${styles.tableHeaderCell} ${styles.countCell}`}>
                  예약
                </th>
                <th className={`${styles.tableHeaderCell} ${styles.countCell}`}>
                  관람완료
                </th>
                <th className={`${styles.tableHeaderCell} ${styles.actionCell}`}>
                  QR
                </th>
              </tr>
            </thead>
            <tbody>
              {exhibitionList.map((exhibition) => (
                <tr
                  key={exhibition.id}
                  className={`${styles.tableRow} ${
                    selectedExhibitionIds.includes(exhibition.id)
                      ? styles.tableRowSelected
                      : ''
                  }`}
                >
                  <td className={styles.tableCell}>
                    <span
                      className={styles.exhibitionTitle}
                      onClick={() => onExhibitionClick(exhibition)}
                    >
                      {exhibition.title}
                    </span>
                  </td>
                  <td className={`${styles.tableCell} ${styles.countCell}`}>
                    <span className={styles.likeCount}>{exhibition.likeCount}</span>
                  </td>
                  <td className={`${styles.tableCell} ${styles.countCell}`}>
                    <span className={styles.reservationCount}>
                      {exhibition.reservationCount}
                    </span>
                  </td>
                  <td className={`${styles.tableCell} ${styles.countCell}`}>
                    <span className={styles.verifiedCount}>
                      {exhibition.verifiedCount}
                    </span>
                  </td>
                  <td className={`${styles.tableCell} ${styles.actionCell}`}>
                    <button
                      className={styles.qrButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        onQRManageClick(exhibition);
                      }}
                    >
                      관리
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📭</div>
          <p className={styles.emptyText}>전시회가 없어요</p>
          <p className={styles.emptySubtext}>
            등록된 전시회가 없습니다
          </p>
        </div>
      )}
    </div>
  );
}