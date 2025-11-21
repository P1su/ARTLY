import React, { useState } from 'react';
import LookUp from '../../components/LookUp/LookUp';
import CountList from '../../components/CountList/CountList';
import RegisterButton from '../../components/RegisterButton/RegisterButton';
import EmptyState from '../../components/EmptyState/EmptyState';
import AlarmModal from '../../components/AlarmModal/AlarmModal';
import Spinner from '../../components/Spinner/Spinner';
import Table from './components/Table/Table';
import useUserSelection from './hooks/useUserSelection';
import useInterestedUser from './hooks/useInterestedUser';
import styles from './InterestedUserManagement.module.css';
import { userInstance } from '../../../../apis/instance';

export default function InterestedUserManagement() {
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
  } = useInterestedUser();

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

      console.log('selectedUserList:', selectedUserList);
      console.log('매핑된 userIds:', userIds);

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

      console.log('알림 발송 응답:', response.data);

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

  // --------------------
  // 렌더링 분기
  // --------------------

  if (isLoading || isSearching) {
    return (
      <div className={styles.contentContainer}>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.contentContainer}>
        <div className={styles.errorMessage}>
          오류가 발생했습니다: {error}
        </div>
      </div>
    );
  }

  // 관심 유저 있는 경우
  if (interestedUserList.length > 0) {
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

          <Table
            interestedUserList={interestedUserList}
            selectedUserList={selectedUserList}
            onUserSelect={handleUserSelect}
            onSelectAll={handleSelectAll}
            isAllSelected={isAllSelected}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
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

  // 관심 유저가 없는 경우
  return (
    <>
      <div className={styles.searchContainer}>
        <LookUp
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="사용자명, 갤러리명, 전시회명, 작품명 검색"
          isInput={true}
        />
      </div>

      <div className={styles.countAndButtonContainer}>
        <CountList count={0} />
        <RegisterButton
          buttonText="관심유저 보기"
          onButtonClick={() => alert('관심유저 보기')}
        />
      </div>

      <section className={styles.emptyStateContainer}>
        <EmptyState
          message="관심유저가 없어요."
          buttonText="관심유저 보기"
        />
      </section>

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