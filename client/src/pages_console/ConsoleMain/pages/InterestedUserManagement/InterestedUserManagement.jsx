import React, { useState } from 'react';
import LookUp from '../../components/LookUp/LookUp';
import CountList from '../../components/CountList/CountList';
import RegisterButton from '../../components/RegisterButton/RegisterButton';
import AlarmModal from '../../components/AlarmModal/AlarmModal';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner.jsx';
import Table from './components/Table/Table';
import useUserSelection from './hooks/useUserSelection';
import useInterestedUser from './hooks/useInterestedUser';
import styles from './InterestedUserManagement.module.css';
import { userInstance } from '../../../../apis/instance';

export default function InterestedUserManagement({
  galleryList = [],
  exhibitionList = [],
  artworkList = [],
}) {
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState(null);

  const {
    selectedUserList,
    handleUserSelect,
    handleSelectAll,
    clearSelection,
    isAllSelected,
  } = useUserSelection();

  const {
    interestedUserList,
    searchQuery,
    isLoading,
    isSearching,
    error,
    activeTab,
    handleSearchChange,
    handleTabChange,
  } = useInterestedUser({ galleryList, exhibitionList, artworkList });

  /**
   * 알림 보내기
   */
  const handleSendAlarm = async (title, message) => {
    if (!selectedUserList || selectedUserList.length === 0) return;

    try {
      setIsSending(true);
      setSendError(null);

      const token = localStorage.getItem('ACCESS_TOKEN');

      // 선택된 좋아요 id → 관심유저 리스트에서 userId로 변환
      const userIds = selectedUserList
        .map((selectedId) => {
          const found = interestedUserList.find(
            (user) => String(user.id) === String(selectedId)
          );
          return found?.userId ?? null;
        })
        .filter((id) => id != null);

      if (userIds.length === 0) {
        alert('선택된 사용자들의 ID를 찾을 수 없습니다.');
        return;
      }

      const response = await userInstance.post(
        '/api/notification/send',
        {
          userIds,
          title,
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      alert(`${userIds.length}명에게 앱 알림이 성공적으로 발송되었습니다.`);

      setIsAlarmModalOpen(false);
      clearSelection();
    } catch (err) {
      console.error('알림 발송 실패:', err);
      const msg =
        err?.response?.data?.message ||
        err.message ||
        '알 수 없는 오류가 발생했습니다.';
      setSendError(msg);
      alert(`알림 발송에 실패했습니다.\n${msg}`);
    } finally {
      setIsSending(false);
    }
  };

  // 탭 변경 시 현재 검색어를 함께 전달하는 래퍼 함수
  const handleTabChangeWithSearch = (tab) => {
    handleTabChange(tab, searchQuery);
  };

  return (
    <>
      <div className={styles.contentContainer}>
        <LookUp
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="사용자명, 갤러리명, 전시회명, 작품명 검색"
          isInput={true}
        />

        <div className={styles.countAndButtonContainer}>
          <CountList count={interestedUserList.length} />
          <RegisterButton
            buttonText="알림 보내기"
            onButtonClick={() => setIsAlarmModalOpen(true)}
            disabled={selectedUserList.length === 0 || isSending}
          />
        </div>

        {sendError && (
          <div className={styles.errorMessage}>
            알림 발송 중 오류가 발생했습니다: {sendError}
          </div>
        )}

        {isLoading || isSearching ? (
          <div className={styles.loadingContainer}>
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <div className={styles.errorMessage}>
              오류가 발생했습니다: {error}
            </div>
          </div>
        ) : (
          <Table
            interestedUserList={interestedUserList}
            selectedUserList={selectedUserList}
            onUserSelect={handleUserSelect}
            onSelectAll={handleSelectAll}
            isAllSelected={isAllSelected}
            activeTab={activeTab}
            onTabChange={handleTabChangeWithSearch}
          />
        )}
      </div>

      <AlarmModal
        isOpen={isAlarmModalOpen}
        onClose={() => setIsAlarmModalOpen(false)}
        selectedUsersCount={selectedUserList.length}
        onSendAlarm={handleSendAlarm}
        isSending={isSending}
      />
    </>
  );
}