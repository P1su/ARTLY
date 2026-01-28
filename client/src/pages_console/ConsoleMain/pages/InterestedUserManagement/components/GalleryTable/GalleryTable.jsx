import React from 'react';
import styles from './GalleryTable.module.css';

export default function GalleryTable({
  galleryList,
  selectedGalleryId,
  onGalleryChange,
  selectedUserIds,
  onUserSelect,
  onSelectAll,
}) {
  const selectedGallery = galleryList.find((g) => g.id === selectedGalleryId);
  const users = selectedGallery?.users || [];
  const isAllSelected = users.length > 0 && users.every((u) => selectedUserIds.includes(u.id));

  return (
    <div className={styles.tableCard}>
      {/* 드롭다운 */}
      <div className={styles.selectContainer}>
        <label className={styles.selectLabel}>갤러리 선택</label>
        <select
          className={styles.select}
          value={selectedGalleryId || ''}
          onChange={(e) => onGalleryChange(e.target.value ? Number(e.target.value) : null)}
        >
          {galleryList.map((gallery) => (
            <option key={gallery.id} value={gallery.id}>
              {gallery.name}
            </option>
          ))}
        </select>
      </div>

      {/* 서브탭 */}
      {selectedGalleryId && (
        <div className={styles.subTabContainer}>
          <button className={`${styles.subTab} ${styles.subTabActive}`}>
            좋아요 {selectedGallery?.likeCount || 0}
          </button>
        </div>
      )}

      {/* 유저 테이블 */}
      {selectedGalleryId ? (
        users.length > 0 ? (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.checkboxCell}>
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={() => onSelectAll(users)}
                    />
                  </th>
                  <th className={styles.tableHeaderCell}>사용자</th>
                  <th className={`${styles.tableHeaderCell} ${styles.dateCell}`}>일자</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className={`${styles.tableRow} ${
                      selectedUserIds.includes(user.id) ? styles.tableRowSelected : ''
                    }`}
                  >
                    <td className={styles.checkboxCell}>
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(user.id)}
                        onChange={() => onUserSelect(user)}
                      />
                    </td>
                    <td className={styles.tableCell}>{user.userName}</td>
                    <td className={`${styles.tableCell} ${styles.dateCell}`}>
                      {user.date ? new Date(user.date).toLocaleDateString('ko-KR') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>유저가 없습니다</p>
          </div>
        )
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>갤러리를 선택하세요</p>
        </div>
      )}
    </div>
  );
}