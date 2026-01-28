import React from 'react';
import styles from './ExhibitionTable.module.css';

export default function ExhibitionTable({
  exhibitionList,
  selectedExhibitionId,
  onExhibitionChange,
  subTab,
  onSubTabChange,
  selectedUserIds,
  onUserSelect,
  onSelectAll,
  onQRManageClick,
}) {
  const selectedExhibition = exhibitionList.find((e) => e.id === selectedExhibitionId);
  const users = selectedExhibition?.users?.[subTab] || [];
  const isAllSelected = users.length > 0 && users.every((u) => selectedUserIds.includes(u.id));

  return (
    <div className={styles.tableCard}>
      {/* 드롭다운 + QR버튼 */}
      <div className={styles.selectContainer}>
        <div className={styles.selectWrapper}>
          <label className={styles.selectLabel}>전시회 선택</label>
          <select
            className={styles.select}
            value={selectedExhibitionId || ''}
            onChange={(e) => onExhibitionChange(e.target.value ? Number(e.target.value) : null)}
          >
            {exhibitionList.map((exhibition) => (
              <option key={exhibition.id} value={exhibition.id}>
                {exhibition.title}
              </option>
            ))}
          </select>
        </div>
        {selectedExhibition && (
          <button
            className={styles.qrButton}
            onClick={() => onQRManageClick(selectedExhibition)}
          >
            QR 관리
          </button>
        )}
      </div>

      {/* 서브탭 */}
      {selectedExhibitionId && (
        <div className={styles.subTabContainer}>
          <button
            className={`${styles.subTab} ${subTab === 'like' ? styles.subTabActive : ''}`}
            onClick={() => onSubTabChange('like')}
          >
            좋아요 {selectedExhibition?.likeCount || 0}
          </button>
          <button
            className={`${styles.subTab} ${subTab === 'reservation' ? styles.subTabActive : ''}`}
            onClick={() => onSubTabChange('reservation')}
          >
            예약 {selectedExhibition?.reservationCount || 0}
          </button>
          <button
            className={`${styles.subTab} ${subTab === 'verified' ? styles.subTabActive : ''}`}
            onClick={() => onSubTabChange('verified')}
          >
            관람완료 {selectedExhibition?.verifiedCount || 0}
          </button>
        </div>
      )}

      {/* 유저 테이블 */}
      {selectedExhibitionId ? (
        users.length > 0 ? (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
            {/* 테이블 헤더 */}
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
                  {(subTab === 'reservation' || subTab === 'verified') && (
                    <th className={styles.tableHeaderCell}>예약번호</th>
                  )}
                  {(subTab === 'reservation' || subTab === 'verified') && (
                    <th className={styles.tableHeaderCell}>방문일자</th>
                  )}
                  {subTab === 'like' && (
                    <th className={`${styles.tableHeaderCell} ${styles.dateCell}`}>일자</th>
                  )}
                </tr>
              </thead>

              {/* 테이블 바디 */}
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
                    {(subTab === 'reservation' || subTab === 'verified') && (
                      <td className={styles.tableCell}>
                        {user.status === 'verified' ? '현장방문' : user.id || '-'}
                      </td>
                    )}
                    {(subTab === 'reservation' || subTab === 'verified') && (
                      <td className={styles.tableCell}>
                        {user.date ? new Date(user.date).toLocaleDateString('ko-KR') : '-'}
                      </td>
                    )}
                    {subTab === 'like' && (
                      <td className={`${styles.tableCell} ${styles.dateCell}`}>
                        {user.date ? new Date(user.date).toLocaleDateString('ko-KR') : '-'}
                      </td>
                    )}
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
          <p className={styles.emptyText}>전시회를 선택하세요</p>
        </div>
      )}
    </div>
  );
}