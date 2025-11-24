import React, { useState } from 'react';
import styles from './Table.module.css';

export default function Table({ 
  interestedUserList, 
  selectedUserList, 
  onUserSelect,
  onSelectAll,
  isAllSelected,
  activeTab,
  onTabChange
}) {
  const handleFilterClick = (filter) => {
    onTabChange(filter);
  };

  const handleSelectAll = () => {
    onSelectAll(interestedUserList);
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableFilters}>
        <button 
          className={`${styles.filterButton} ${activeTab === 'all' ? styles.filterButtonActive : ''}`}
          onClick={() => handleFilterClick('all')}
        >
          전체
        </button>
        <button 
          className={`${styles.filterButton} ${activeTab === 'gallery' ? styles.filterButtonActive : ''}`}
          onClick={() => handleFilterClick('gallery')}
        >
          갤러리
        </button>
        <button 
          className={`${styles.filterButton} ${activeTab === 'exhibition' ? styles.filterButtonActive : ''}`}
          onClick={() => handleFilterClick('exhibition')}
        >
          전시회
        </button>
        <button 
          className={`${styles.filterButton} ${activeTab === 'art' ? styles.filterButtonActive : ''}`}
          onClick={() => handleFilterClick('art')}
        >
          작품
        </button>
      </div>

      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr>
            <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellCheckbox}`}>
              <input 
                type="checkbox" 
                className="w-4 h-4"
                checked={isAllSelected(interestedUserList)}
                onChange={handleSelectAll}
              />
            </th>
            <th className={styles.tableHeaderCell}>분류</th>
            <th className={styles.tableHeaderCell}>사용자</th>
            <th className={styles.tableHeaderCell}>일자</th>
          </tr>
        </thead>
        <tbody>
          {interestedUserList.map(user => (
            <tr key={`${user.type}-${user.id}`} className={styles.tableRow}>
              <td className={styles.tableCell}>
                <input 
                  type="checkbox" 
                  className="w-4 h-4"
                  checked={selectedUserList.includes(user.id)}
                  onChange={() => onUserSelect(user.id)}
                />
              </td>
              <td className={styles.tableCell}>{user.category}</td>
              <td className={styles.tableCell}>{user.name}</td>
              <td className={`${styles.tableCell} ${styles.tableCellGray}`}>{user.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}