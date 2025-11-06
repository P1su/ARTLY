import React, { useState } from 'react';
import LookUp from '../../components/LookUp/LookUp';
import CountList from '../../components/CountList/CountList';
import RegisterButton from '../../components/RegisterButton/RegisterButton';
import EmptyState from '../../components/EmptyState/EmptyState';
import AlarmModal from '../../components/AlarmModal/AlarmModal';
import Table from './components/Table/Table';
import useUserSelection from './hooks/useUserSelection';
import useInterestedUser from './hooks/useInterestedUser';
import styles from './InterestedUserManagement.module.css';

export default function InterestedUserManagement() {
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const {
    selectedUserList,
    handleUserSelect,
    handleSelectAll,
    clearSelection,
    isAllSelected
  } = useUserSelection();

  const {
    interestedUserList,
    searchQuery,
    isLoading,
    error,
    activeTab,
    handleSearchChange,
    handleTabChange
  } = useInterestedUser();

  const handleSendAlarm = () => {
    if (selectedUserList.length === 0) return;
    
    // 성공 메시지 표시
    alert(`${selectedUserList.length}명에게 앱 알림이 성공적으로 발송되었습니다.`);
    
    // 모달 닫기 및 선택 초기화
    setIsAlarmModalOpen(false);
    clearSelection();
  };

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
          />
        </div>

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
        />
      </>
    );
  }

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
      />
    </>
  );
}
