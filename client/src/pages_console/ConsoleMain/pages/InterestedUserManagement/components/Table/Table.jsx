import React from 'react';
import styles from './Table.module.css';

export default function Table({
  interestedUserList,
  selectedUserList,
  onUserSelect,
  onSelectAll,
  isAllSelected,
  activeTab,
  onTabChange,
}) {
  const handleSelectAll = () => {
    onSelectAll(interestedUserList);
  };

  return (
    <div className={styles.tableCard}>
      {/* 탭 필터 */}
      <div className={styles.tabHeader}>
        <div className={styles.tabList}>
          <button
            className={`${styles.tabButton} ${activeTab === 'all' ? styles.tabButtonActive : ''}`}
            onClick={() => onTabChange('all')}
          >
            전체
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'gallery' ? styles.tabButtonActive : ''}`}
            onClick={() => onTabChange('gallery')}
          >
            갤러리
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'exhibition' ? styles.tabButtonActive : ''}`}
            onClick={() => onTabChange('exhibition')}
          >
            전시회
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'art' ? styles.tabButtonActive : ''}`}
            onClick={() => onTabChange('art')}
          >
            작품
          </button>
        </div>
      </div>

      {/* 테이블 */}
      {interestedUserList.length > 0 ? (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th
                  className={`${styles.tableHeaderCell} ${styles.checkboxCell}`}
                >
                  <label className={styles.checkboxWrapper}>
                    <input
                      type='checkbox'
                      className={styles.checkbox}
                      checked={isAllSelected(interestedUserList)}
                      onChange={handleSelectAll}
                    />
                    <span className={styles.checkboxCustom} />
                  </label>
                </th>
                <th className={styles.tableHeaderCell}>대상</th>
                <th className={styles.tableHeaderCell}>사용자</th>
                <th className={styles.tableHeaderCell}>일자</th>
              </tr>
            </thead>
            <tbody>
              {interestedUserList.map((user) => (
                <tr
                  key={`${user.type}-${user.id}`}
                  className={`${styles.tableRow} ${selectedUserList.includes(user.id) ? styles.tableRowSelected : ''}`}
                >
                  <td className={`${styles.tableCell} ${styles.checkboxCell}`}>
                    <label className={styles.checkboxWrapper}>
                      <input
                        type='checkbox'
                        className={styles.checkbox}
                        checked={selectedUserList.includes(user.id)}
                        onChange={() => onUserSelect(user.id)}
                      />
                      <span className={styles.checkboxCustom} />
                    </label>
                  </td>
                  <td className={styles.tableCell}>
                    <span className={styles.categoryName}>{user.category}</span>
                  </td>
                  <td className={styles.tableCell}>
                    <span className={styles.userName}>
                      {user.name === 'string' || !user.name
                        ? '이름 없음'
                        : user.name}
                    </span>
                  </td>
                  <td className={`${styles.tableCell} ${styles.dateCell}`}>
                    {user.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📭</div>
          <p className={styles.emptyText}>관심유저가 없어요</p>
          <p className={styles.emptySubtext}>
            {activeTab === 'all'
              ? '전체'
              : activeTab === 'gallery'
                ? '갤러리'
                : activeTab === 'exhibition'
                  ? '전시회'
                  : '작품'}
            에 좋아요한 사용자가 없습니다
          </p>
        </div>
      )}
    </div>
  );
}
