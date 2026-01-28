import React, { useState, useEffect } from 'react';
import CountList from '../../components/CountList/CountList';
import AlarmModal from '../../components/AlarmModal/AlarmModal';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import GalleryTable from './components/GalleryTable/GalleryTable';
import ExhibitionTable from './components/ExhibitionTable/ExhibitionTable';
import ArtworkTable from './components/ArtworkTable/ArtworkTable';
import QRManageModal from './components/QRManageModal/QRManageModal';
import useGalleryList from './hooks/useGalleryList';
import useExhibitionList from './hooks/useExhibitionList';
import useArtworkList from './hooks/useArtworkList';
import styles from './InterestedUserManagement.module.css';
import { userInstance } from '../../../../apis/instance';
import { useAlert } from '../../../../store/AlertProvider';

export default function InterestedUserManagement() {
  const { showAlert } = useAlert();
  const [activeTab, setActiveTab] = useState('gallery');

  // 선택된 항목 ID
  const [selectedGalleryId, setSelectedGalleryId] = useState(null);
  const [selectedExhibitionId, setSelectedExhibitionId] = useState(null);
  const [selectedArtworkId, setSelectedArtworkId] = useState(null);
  const [exhibitionSubTab, setExhibitionSubTab] = useState('like');

  // 선택된 유저들
  const [selectedUsers, setSelectedUsers] = useState([]);

  // 알림 모달
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // QR 모달
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrExhibition, setQrExhibition] = useState(null);

  // 훅
  const { galleryList, isLoading: isGalleryLoading, loadGalleryList } = useGalleryList();
  const { exhibitionList, isLoading: isExhibitionLoading, loadExhibitionList } = useExhibitionList();
  const { artworkList, isLoading: isArtworkLoading, loadArtworkList } = useArtworkList();

  // 첫 번째 항목 자동 선택
  useEffect(() => {
    if (galleryList.length > 0 && !selectedGalleryId) {
      setSelectedGalleryId(galleryList[0].id);
    }
  }, [galleryList]);

  useEffect(() => {
    if (exhibitionList.length > 0 && !selectedExhibitionId) {
      setSelectedExhibitionId(exhibitionList[0].id);
    }
  }, [exhibitionList]);

  useEffect(() => {
    if (artworkList.length > 0 && !selectedArtworkId) {
      setSelectedArtworkId(artworkList[0].id);
    }
  }, [artworkList]);
  
  // 탭 변경
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedUsers([]);
    setExhibitionSubTab('like');

    if (tab === 'gallery') {
      loadGalleryList();
      setSelectedGalleryId(galleryList[0]?.id || null);
    } else if (tab === 'exhibition') {
      loadExhibitionList();
      setSelectedExhibitionId(exhibitionList[0]?.id || null);
    } else if (tab === 'art') {
      loadArtworkList();
      setSelectedArtworkId(artworkList[0]?.id || null);
    }
  };


  // 항목 변경 시 유저 선택 초기화
  const handleGalleryChange = (id) => {
    setSelectedGalleryId(id);
    setSelectedUsers([]);
  };

  const handleExhibitionChange = (id) => {
    setSelectedExhibitionId(id);
    setExhibitionSubTab('like');
    setSelectedUsers([]);
  };

  const handleArtworkChange = (id) => {
    setSelectedArtworkId(id);
    setSelectedUsers([]);
  };

  const handleExhibitionSubTabChange = (subTab) => {
    setExhibitionSubTab(subTab);
    setSelectedUsers([]);
  };

  // 유저 선택
  const handleUserSelect = (user) => {
    setSelectedUsers((prev) => {
      const exists = prev.find((u) => u.id === user.id);
      if (exists) return prev.filter((u) => u.id !== user.id);
      return [...prev, user];
    });
  };

  // 전체 선택
  const handleSelectAll = (users) => {
    const allSelected = users.every((u) => selectedUsers.find((s) => s.id === u.id));
    if (allSelected) {
      setSelectedUsers((prev) => prev.filter((u) => !users.find((s) => s.id === u.id)));
    } else {
      setSelectedUsers((prev) => {
        const newUsers = users.filter((u) => !prev.find((s) => s.id === u.id));
        return [...prev, ...newUsers];
      });
    }
  };

  // QR 관리
  const handleQRManageClick = (exhibition) => {
    setQrExhibition(exhibition);
    setIsQRModalOpen(true);
  };

  // 알림 발송
  const handleSendAlarm = async (title, message) => {
    if (selectedUsers.length === 0) return;

    try {
      setIsSending(true);
      const token = localStorage.getItem('ACCESS_TOKEN');
      const userIds = selectedUsers.map((u) => u.userId).filter((id) => id != null);

      if (userIds.length === 0) {
        showAlert('선택된 사용자들의 ID를 찾을 수 없습니다.');
        return;
      }

      await userInstance.post(
        '/api/notification/send',
        { userIds, title, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showAlert(`${userIds.length}명에게 알림이 발송되었습니다.`);
      setIsAlarmModalOpen(false);
      setSelectedUsers([]);
    } catch (err) {
      showAlert(`알림 발송 실패: ${err.message}`, 'error');
    } finally {
      setIsSending(false);
    }
  };

  const getListCount = () => {
    if (activeTab === 'gallery') return galleryList.length;
    if (activeTab === 'exhibition') return exhibitionList.length;
    return artworkList.length;
  };

  const getIsLoading = () => {
    if (activeTab === 'gallery') return isGalleryLoading;
    if (activeTab === 'exhibition') return isExhibitionLoading;
    return isArtworkLoading;
  };

  return (
    <>
      <div className={styles.contentContainer}>
        <div className={styles.countAndButtonContainer}>
          <CountList count={getListCount()} />
        </div>

        {/* 탭 */}
          <div className={styles.tabContainer}>
            <div className={styles.tabButtons}>
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
            <button
              className={styles.sendAlarmButton}
              disabled={selectedUsers.length === 0}
              onClick={() => setIsAlarmModalOpen(true)}
            >
              알림 보내기 ({selectedUsers.length})
            </button>
          </div>

        {/* 테이블 */}
        {getIsLoading() ? (
          <LoadingSpinner />
        ) : activeTab === 'gallery' ? (
          <GalleryTable
            galleryList={galleryList}
            selectedGalleryId={selectedGalleryId}
            onGalleryChange={handleGalleryChange}
            selectedUserIds={selectedUsers.map((u) => u.id)}
            onUserSelect={handleUserSelect}
            onSelectAll={handleSelectAll}
          />
        ) : activeTab === 'exhibition' ? (
          <ExhibitionTable
            exhibitionList={exhibitionList}
            selectedExhibitionId={selectedExhibitionId}
            onExhibitionChange={handleExhibitionChange}
            subTab={exhibitionSubTab}
            onSubTabChange={handleExhibitionSubTabChange}
            selectedUserIds={selectedUsers.map((u) => u.id)}
            onUserSelect={handleUserSelect}
            onSelectAll={handleSelectAll}
            onQRManageClick={handleQRManageClick}
          />
        ) : (
          <ArtworkTable
            artworkList={artworkList}
            selectedArtworkId={selectedArtworkId}
            onArtworkChange={handleArtworkChange}
            selectedUserIds={selectedUsers.map((u) => u.id)}
            onUserSelect={handleUserSelect}
            onSelectAll={handleSelectAll}
          />
        )}
      </div>

      <AlarmModal
        isOpen={isAlarmModalOpen}
        onClose={() => setIsAlarmModalOpen(false)}
        selectedUsersCount={selectedUsers.length}
        onSendAlarm={handleSendAlarm}
        isSending={isSending}
      />

      <QRManageModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        exhibition={qrExhibition}
      />
    </>
  );
}