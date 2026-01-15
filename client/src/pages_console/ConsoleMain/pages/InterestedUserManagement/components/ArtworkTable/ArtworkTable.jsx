import React from 'react';
import styles from './ArtworkTable.module.css';

export default function ArtworkTable({
  artworkList,
  selectedArtworkIds,
  onArtworkSelect,
  onSelectAll,
  isAllSelected,
  onArtworkClick,
}) {
  const handleSelectAll = () => {
    onSelectAll(artworkList);
  };

  return (
    <div className={styles.tableCard}>
      {artworkList.length > 0 ? (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th className={styles.tableHeaderCell}>작품명</th>
                <th className={`${styles.tableHeaderCell} ${styles.countCell}`}>
                  좋아요
                </th>
                <th className={`${styles.tableHeaderCell} ${styles.dateCell}`}>
                  최근활동
                </th>
              </tr>
            </thead>
            <tbody>
              {artworkList.map((artwork) => (
                <tr
                  key={artwork.id}
                  className={`${styles.tableRow} ${
                    selectedArtworkIds.includes(artwork.id)
                      ? styles.tableRowSelected
                      : ''
                  }`}
                >
                  <td className={styles.tableCell}>
                    <span
                      className={styles.artworkTitle}
                      onClick={() => onArtworkClick(artwork)}
                    >
                      {artwork.title}
                    </span>
                  </td>
                  <td className={`${styles.tableCell} ${styles.countCell}`}>
                    <span className={styles.likeCount}>{artwork.likeCount}</span>
                  </td>
                  <td className={`${styles.tableCell} ${styles.dateCell}`}>
                    {artwork.lastActivity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📭</div>
          <p className={styles.emptyText}>작품이 없어요</p>
          <p className={styles.emptySubtext}>
            좋아요를 받은 작품이 없습니다
          </p>
        </div>
      )}
    </div>
  );
}