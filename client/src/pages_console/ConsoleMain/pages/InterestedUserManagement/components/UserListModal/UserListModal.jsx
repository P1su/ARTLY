import React, { useState, useEffect } from 'react';
import styles from './UserListModal.module.css';
import LoadingSpinner from '../../../../../../components/LoadingSpinner/LoadingSpinner';

export default function UserListModal({
  isOpen,
  onClose,
  title,
  type, // 'gallery' | 'exhibition'
  userList,
  isLoading,
  selectedUserIds,
  onUserSelect,
  onSelectAll,
  isAllSelected,
  onSendAlarm,
  // 전시회 전용
  subTab,
  onSubTabChange,
  counts, // { like: 15, reservation: 78, verified: 23 }
}) {
  const [localSelectedIds, setLocalSelectedIds] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setLocalSelectedIds([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLocalSelect = (userId) => {
    setLocalSelectedIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleLocalSelectAll = () => {
    if (localSelectedIds.length === userList.length) {
      setLocalSelectedIds([]);
    } else {
      setLocalSelectedIds(userList.map((user) => user.id));
    }
  };

  const handleSendAlarm = () => {
    if (localSelectedIds.length > 0) {
      onSendAlarm(localSelectedIds, userList);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'like':
        return '좋아요';
      case 'reservation':
        return '예약신청';
      case 'verified':
        return '관람완료';
      default:
        return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'like':
        return styles.statusLike;
      case 'reservation':
        return styles.statusReservation;
      case 'verified':
        return styles.statusVerified;
      default:
        return '';
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* 전시회: 서브탭 */}
        {type === 'exhibition' && counts && (
          <div className={styles.subTabContainer}>
            <button
              className={`${styles.subTab} ${subTab === 'like' ? styles.subTabActive : ''}`}
              onClick={() => onSubTabChange('like')}
            >
              좋아요 {counts.like}
            </button>
            <button
              className={`${styles.subTab} ${subTab === 'reservation' ? styles.subTabActive : ''}`}
              onClick={() => onSubTabChange('reservation')}
            >
              예약 {counts.reservation}
            </button>
            <button
              className={`${styles.subTab} ${subTab === 'verified' ? styles.subTabActive : ''}`}
              onClick={() => onSubTabChange('verified')}
            >
              관람완료 {counts.verified}
            </button>
          </div>
        )}

        {/* 유저 목록 */}
        <div className={styles.content}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <LoadingSpinner />
            </div>
          ) : userList.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.checkboxCell}>
                    <label className={styles.checkboxWrapper}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={
                          userList.length > 0 &&
                          localSelectedIds.length === userList.length
                        }
                        onChange={handleLocalSelectAll}
                      />
                      <span className={styles.checkboxCustom} />
                    </label>
                  </th>
                  <th>사용자</th>
                  {type === 'exhibition' && <th>상태</th>}
                  <th>일자</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((user) => (
                  <tr
                    key={user.id}
                    className={
                      localSelectedIds.includes(user.id)
                        ? styles.rowSelected
                        : ''
                    }
                  >
                    <td className={styles.checkboxCell}>
                      <label className={styles.checkboxWrapper}>
                        <input
                          type="checkbox"
                          className={styles.checkbox}
                          checked={localSelectedIds.includes(user.id)}
                          onChange={() => handleLocalSelect(user.id)}
                        />
                        <span className={styles.checkboxCustom} />
                      </label>
                    </td>
                    <td className={styles.userName}>{user.name}</td>
                    {type === 'exhibition' && (
                      <td>
                        <span
                          className={`${styles.statusBadge} ${getStatusClass(user.status)}`}
                        >
                          {getStatusLabel(user.status)}
                        </span>
                      </td>
                    )}
                    <td className={styles.dateCell}>{user.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className={styles.emptyState}>
              <p>유저가 없습니다</p>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className={styles.footer}>
          <span className={styles.selectedCount}>
            {localSelectedIds.length}명 선택
          </span>
          <button
            className={styles.sendButton}
            disabled={localSelectedIds.length === 0}
            onClick={handleSendAlarm}
          >
            알림 보내기
          </button>
        </div>
      </div>
    </div>
  );
}