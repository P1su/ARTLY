import React, { useState } from 'react';
import LookUp from '../../components/LookUp/LookUp';
import CountList from '../../components/CountList/CountList';
import AlarmModal from '../../components/AlarmModal/AlarmModal';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import GalleryTable from './components/GalleryTable/GalleryTable';
import ExhibitionTable from './components/ExhibitionTable/ExhibitionTable';
import ArtworkTable from './components/ArtworkTable/ArtworkTable';
import UserListModal from './components/UserListModal/UserListModal';
import QRManageModal from './components/QRManageModal/QRManageModal';
import useGalleryList from './hooks/useGalleryList';
import useExhibitionList from './hooks/useExhibitionList';
import useArtworkList from './hooks/useArtworkList';
import useUserList from './hooks/useUserList';
import useUserSelection from './hooks/useUserSelection';
import styles from './InterestedUserManagement.module.css';
import { userInstance } from '../../../../apis/instance';
import { useAlert } from '../../../../store/AlertProvider';

export default function InterestedUserManagement() {
  const { showAlert } = useAlert();
  const [activeTab, setActiveTab] = useState('gallery');
  const [searchQuery, setSearchQuery] = useState('');

  // 알림 모달
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [alarmTargetUsers, setAlarmTargetUsers] = useState([]);

  // 유저 목록 모달
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState('gallery');
  const [modalSubTab, setModalSubTab] = useState('like');
  const [exhibitionCounts, setExhibitionCounts] = useState(null);

  // QR 관리 모달
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrExhibition, setQrExhibition] = useState(null);

  // 훅
  const { galleryList, isLoading: isGalleryLoading, loadGalleryList } = useGalleryList();
  const { exhibitionList, isLoading: isExhibitionLoading, loadExhibitionList } = useExhibitionList();
  const { artworkList, isLoading: isArtworkLoading, loadArtworkList } = useArtworkList();
  const { 
    userList, 
    isLoading: isUserLoading, 
    setGalleryUsers, 
    setExhibitionUsers,
    clearUserList 
  } = useUserList();
  const {
    selectedUserList,
    handleUserSelect,
    handleSelectAll,
    clearSelection,
    isAllSelected,
  } = useUserSelection();

  // 탭 변경
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery('');
    clearSelection();
  };

  // 검색
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (activeTab === 'gallery') {
      loadGalleryList(value);
    } else if (activeTab === 'exhibition') {
      loadExhibitionList(value);
    } else if (activeTab === 'art') {
      loadArtworkList(value);
    }
  };

  // 갤러리 클릭 → 유저 모달 열기
  const handleGalleryClick = (gallery) => {
    setSelectedItem(gallery);
    setModalType('gallery');
    setExhibitionCounts(null);
    setIsUserModalOpen(true);
    setGalleryUsers(gallery.users || []);
  };

  // 전시회 클릭 → 유저 모달 열기
  const handleExhibitionClick = (exhibition) => {
    setSelectedItem(exhibition);
    setModalType('exhibition');
    setModalSubTab('like');
    setExhibitionCounts({
      like: exhibition.likeCount,
      reservation: exhibition.reservationCount,
      verified: exhibition.verifiedCount,
    });
    setIsUserModalOpen(true);
    setExhibitionUsers(exhibition.users?.like || [], 'like');
  };

  // 작품 클릭 → 유저 모달 열기
  const handleArtworkClick = (artwork) => {
    setSelectedItem(artwork);
    setModalType('artwork');
    setExhibitionCounts(null);
    setIsUserModalOpen(true);
    setGalleryUsers(artwork.users || []);
  };

  // 전시회 모달 서브탭 변경
  const handleModalSubTabChange = (subTab) => {
    setModalSubTab(subTab);
    if (selectedItem) {
      if (subTab === 'like') {
        setExhibitionUsers(selectedItem.users?.like || [], 'like');
      } else if (subTab === 'reservation') {
        setExhibitionUsers(selectedItem.users?.reservation || [], 'reservation');
      } else if (subTab === 'verified') {
        setExhibitionUsers(selectedItem.users?.verified || [], 'verified');
      }
    }
  };

  // QR 관리 클릭
  const handleQRManageClick = (exhibition) => {
    setQrExhibition(exhibition);
    setIsQRModalOpen(true);
  };

  // QR 모달 닫기
  const handleCloseQRModal = () => {
    setIsQRModalOpen(false);
    setQrExhibition(null);
  };

  // 유저 모달 닫기
  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
    setSelectedItem(null);
    setExhibitionCounts(null);
    clearUserList();
  };

  // 유저 모달에서 알림 보내기 클릭
  const handleOpenAlarmFromModal = (selectedIds, users) => {
    const targetUsers = users.filter((u) => selectedIds.includes(u.id));
    setAlarmTargetUsers(targetUsers);
    setIsAlarmModalOpen(true);
  };

  // 알림 발송
  const handleSendAlarm = async (title, message) => {
    if (alarmTargetUsers.length === 0) return;

    try {
      setIsSending(true);
      const token = localStorage.getItem('ACCESS_TOKEN');

      const userIds = alarmTargetUsers
        .map((u) => u.userId)
        .filter((id) => id !== null && id !== undefined);

      if (userIds.length === 0) {
        showAlert('선택된 사용자들의 ID를 찾을 수 없습니다.');
        return;
      }

      await userInstance.post(
        '/api/notification/send',
        { userIds, title, message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      showAlert(`${userIds.length}명에게 알림이 발송되었습니다.`);
      setIsAlarmModalOpen(false);
      setAlarmTargetUsers([]);
      handleCloseUserModal();
    } catch (err) {
      console.error('알림 발송 실패:', err);
      const msg = err?.response?.data?.message || err.message || '알 수 없는 오류';
      showAlert(`알림 발송 실패: ${msg}`, 'error');
    } finally {
      setIsSending(false);
    }
  };

  // 현재 탭에 따른 리스트 개수
  const getListCount = () => {
    if (activeTab === 'gallery') return galleryList.length;
    if (activeTab === 'exhibition') return exhibitionList.length;
    if (activeTab === 'art') return artworkList.length;
    return 0;
  };

  // 현재 탭에 따른 로딩 상태
  const getIsLoading = () => {
    if (activeTab === 'gallery') return isGalleryLoading;
    if (activeTab === 'exhibition') return isExhibitionLoading;
    if (activeTab === 'art') return isArtworkLoading;
    return false;
  };

  // 모달 타이틀
  const getModalTitle = () => {
    if (!selectedItem) return '';
    if (modalType === 'gallery') {
      return `${selectedItem.name} - 좋아요 유저`;
    }
    if (modalType === 'artwork') {
      return `${selectedItem.title} - 좋아요 유저`;
    }
    return `${selectedItem.title} - 유저 관리`;
  };

  return (
    <>
      <div className={styles.contentContainer}>
        <LookUp
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder={
            activeTab === 'gallery'
              ? '갤러리명 검색'
              : activeTab === 'exhibition'
                ? '전시회명 검색'
                : '작품명 검색'
          }
          isInput
        />

        <div className={styles.countAndButtonContainer}>
          <CountList count={getListCount()} />
        </div>

        {/* 탭 */}
        <div className={styles.tabContainer}>
          <button
            className={`${styles.tabButton} ${activeTab === 'gallery' ? styles.tabButtonActive : ''}`}
            onClick={() => handleTabChange('gallery')}
          >
            갤러리
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'exhibition' ? styles.tabButtonActive : ''}`}
            onClick={() => handleTabChange('exhibition')}
          >
            전시회
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'art' ? styles.tabButtonActive : ''}`}
            onClick={() => handleTabChange('art')}
          >
            작품
          </button>
        </div>

        {/* 테이블 영역 */}
        {getIsLoading() ? (
          <div className={styles.loadingContainer}>
            <LoadingSpinner />
          </div>
        ) : activeTab === 'gallery' ? (
          <GalleryTable
            galleryList={galleryList}
            selectedGalleryIds={selectedUserList}
            onGallerySelect={handleUserSelect}
            onSelectAll={handleSelectAll}
            isAllSelected={isAllSelected}
            onGalleryClick={handleGalleryClick}
          />
        ) : activeTab === 'exhibition' ? (
          <ExhibitionTable
            exhibitionList={exhibitionList}
            selectedExhibitionIds={selectedUserList}
            onExhibitionSelect={handleUserSelect}
            onSelectAll={handleSelectAll}
            isAllSelected={isAllSelected}
            onExhibitionClick={handleExhibitionClick}
            onQRManageClick={handleQRManageClick}
          />
        ) : (
          <ArtworkTable
            artworkList={artworkList}
            selectedArtworkIds={selectedUserList}
            onArtworkSelect={handleUserSelect}
            onSelectAll={handleSelectAll}
            isAllSelected={isAllSelected}
            onArtworkClick={handleArtworkClick}
          />
        )}
      </div>

      {/* 유저 목록 모달 */}
      <UserListModal
        isOpen={isUserModalOpen}
        onClose={handleCloseUserModal}
        title={getModalTitle()}
        type={modalType}
        userList={userList}
        isLoading={isUserLoading}
        onSendAlarm={handleOpenAlarmFromModal}
        subTab={modalSubTab}
        onSubTabChange={handleModalSubTabChange}
        counts={exhibitionCounts}
      />

      {/* 알림 발송 모달 */}
      <AlarmModal
        isOpen={isAlarmModalOpen}
        onClose={() => setIsAlarmModalOpen(false)}
        selectedUsersCount={alarmTargetUsers.length}
        onSendAlarm={handleSendAlarm}
        isSending={isSending}
      />

      {/* QR 관리 모달 */}
      <QRManageModal
        isOpen={isQRModalOpen}
        onClose={handleCloseQRModal}
        exhibition={qrExhibition}
      />
    </>
  );
}