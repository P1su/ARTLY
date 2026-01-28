import React from 'react';
import styles from './ArtworkTable.module.css';

export default function ArtworkTable({
  artworkList,
  selectedArtworkId,
  onArtworkChange,
  selectedUserIds,
  onUserSelect,
  onSelectAll,
}) {
  const selectedArtwork = artworkList.find((a) => a.id === selectedArtworkId);
  const users = selectedArtwork?.users || [];
  const isAllSelected = users.length > 0 && users.every((u) => selectedUserIds.includes(u.id));

  return (
    <div className={styles.tableCard}>
      {/* 드롭다운 */}
      <div className={styles.selectContainer}>
        <label className={styles.selectLabel}>작품 선택</label>
        <select
          className={styles.select}
          value={selectedArtworkId || ''}
          onChange={(e) => onArtworkChange(e.target.value ? Number(e.target.value) : null)}
        >
          {artworkList.map((artwork) => (
            <option key={artwork.id} value={artwork.id}>
              {artwork.title}
            </option>
          ))}
        </select>
      </div>

      {/* 서브탭 */}
      {selectedArtworkId && (
        <div className={styles.subTabContainer}>
          <button className={`${styles.subTab} ${styles.subTabActive}`}>
            좋아요 {selectedArtwork?.likeCount || 0}
          </button>
        </div>
      )}

      {/* 유저 테이블 */}
      {selectedArtworkId ? (
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
          <p className={styles.emptyText}>작품을 선택하세요</p>
        </div>
      )}
    </div>
  );
}