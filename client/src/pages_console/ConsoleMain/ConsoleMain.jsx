import React, { useEffect, useState } from 'react';
import ActionBar from './components/ActionBar/ActionBar';
import GalleryManagement from './pages/GalleryManagement/GalleryManagement';
import ExhibitionManagement from './pages/ExhibitionManagement/ExhibitionManagement';
import ArtworkManagement from './pages/ArtworkManagement/ArtworkManagement';
import InterestedUserManagement from './pages/InterestedUserManagement/InterestedUserManagement';

import useDeleteItem from './hooks/useDeleteItem';
import styles from './ConsoleMain.module.css';
import { useLocation } from 'react-router-dom';

export default function ConsoleMain({
  defaultTab = '갤러리관리',
  defaultGallery = '갤러리 전체',
}) {
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [selectedGallery, setSelectedGallery] = useState(defaultGallery);
  const [selectedExhibition, setSelectedExhibition] = useState('전시회 전체');

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // 탭에 따라 적절한 초기값 설정
    if (tab === '작품관리') {
      setSelectedExhibition('전시회 전체');
    } else {
      setSelectedGallery('갤러리 전체');
    }
  };

  // 데이터
  const tabList = ['갤러리관리', '전시회관리', '작품관리', '관심유저관리'];

  // 커스텀 훅 사용
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
      </div>
    </div>
  );
}
