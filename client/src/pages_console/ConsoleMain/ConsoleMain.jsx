import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // useNavigate 추가
import ActionBar from './components/ActionBar/ActionBar';
import GalleryManagement from './pages/GalleryManagement/GalleryManagement';
import ExhibitionManagement from './pages/ExhibitionManagement/ExhibitionManagement';
import ArtworkManagement from './pages/ArtworkManagement/ArtworkManagement';
import InterestedUserManagement from './pages/InterestedUserManagement/InterestedUserManagement';

import useDeleteItem from './hooks/useDeleteItem';
import styles from './ConsoleMain.module.css';
import { useAlert } from '../../store/AlertProvider';

export default function ConsoleMain({
  defaultTab = '갤러리관리',
  defaultGallery = '갤러리 전체',
}) {
  const { showAlert } = useAlert();
  const location = useLocation();
  const navigate = useNavigate(); // navigate 훅 사용

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [selectedExhibition, setSelectedExhibition] = useState(null);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === '작품관리') {
      setSelectedExhibition(null);
    } else {
      setSelectedGallery(null);
    }
  };

  const tabList = ['갤러리관리', '전시회관리', '작품관리', '관심유저관리'];

  const {
    galleryList,
    exhibitionList,
    artworkList,
    handleDelete,
    loadGalleries,
    loadExhibitions,
    loadArtworks,
    isLoading,
    isSearching,
    error,
  } = useDeleteItem();

  useEffect(() => {
    if (error) {
      showAlert('로그인이 만료되었습니다. 다시 로그인 해주세요.');
      navigate('/login', { replace: true });
    }
  }, [error, navigate]);

  return (
    <div className={styles.layout}>
      <div className={styles.tabSection}>
        <ActionBar
          tabList={tabList}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      <div className={styles.content}>
        {/* 에러가 없고 데이터가 있을 때만 렌더링되도록 조건부 처리 */}
        {!error && (
          <>
            {activeTab === '갤러리관리' && (
              <GalleryManagement
                galleryList={galleryList}
                onDelete={handleDelete}
                loadGalleries={loadGalleries}
                isLoading={isLoading}
                isSearching={isSearching}
                error={error}
              />
            )}
            {activeTab === '전시회관리' && (
              <ExhibitionManagement
                exhibitionList={exhibitionList}
                selectedGallery={selectedGallery}
                onGalleryChange={setSelectedGallery}
                onDelete={handleDelete}
                loadExhibitions={loadExhibitions}
                isLoading={isLoading}
                error={error}
                galleryList={galleryList}
              />
            )}
            {activeTab === '작품관리' && (
              <ArtworkManagement
                key={activeTab}
                artworkList={artworkList}
                selectedExhibition={selectedExhibition}
                onExhibitionChange={setSelectedExhibition}
                onDelete={handleDelete}
                loadArtworks={loadArtworks}
                loadExhibitions={loadExhibitions}
                isLoading={isLoading}
                error={error}
                galleryList={galleryList}
                exhibitionList={exhibitionList}
              />
            )}
            {activeTab === '관심유저관리' && (
              <InterestedUserManagement
                galleryList={galleryList}
                exhibitionList={exhibitionList}
                artworkList={artworkList}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
