import React from 'react';
import styles from './GalleryTable.module.css';

export default function GalleryTable({
  galleryList,
  onGalleryClick,
}) {
  return (
    <div className={styles.tableCard}>
      {galleryList.length > 0 ? (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th className={styles.tableHeaderCell}>갤러리명</th>
                <th className={`${styles.tableHeaderCell} ${styles.countCell}`}>
                  좋아요
                </th>
                <th className={`${styles.tableHeaderCell} ${styles.dateCell}`}>
                  최근활동
                </th>
              </tr>
            </thead>
            <tbody>
              {galleryList.map((gallery) => (
                <tr key={gallery.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <span
                      className={styles.galleryName}
                      onClick={() => onGalleryClick(gallery)}
                    >
                      {gallery.name}
                    </span>
                  </td>
                  <td className={`${styles.tableCell} ${styles.countCell}`}>
                    <span className={styles.likeCount}>{gallery.likeCount}</span>
                  </td>
                  <td className={`${styles.tableCell} ${styles.dateCell}`}>
                    {gallery.lastActivity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📭</div>
          <p className={styles.emptyText}>갤러리가 없어요</p>
          <p className={styles.emptySubtext}>좋아요를 받은 갤러리가 없습니다</p>
        </div>
      )}
    </div>
  );
}