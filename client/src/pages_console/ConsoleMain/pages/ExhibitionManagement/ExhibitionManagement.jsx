import React, { useEffect, useCallback, useMemo } from 'react';
import { HiTrash } from 'react-icons/hi';
import LookUp from '../../components/LookUp/LookUp';
import CountList from '../../components/CountList/CountList';
import RegisterButton from '../../components/RegisterButton/RegisterButton';
import EmptyState from '../../components/EmptyState/EmptyState';
import styles from './ExhibitionManagement.module.css';

export default function ExhibitionManagement({ 
  exhibitionList, 
  selectedGallery, 
  onGalleryChange, 
  onDelete,
  loadExhibitions,
  isLoading,
  error,
  galleryList
}) {
  const handleDelete = (id) => {
    if (window.confirm('정말로 이 전시회를 삭제하시겠습니까?')) {
      onDelete(id, 'exhibition');
    }
  };

  // 갤러리를 ID로 변환하는 함수
  const getGalleryId = useCallback((galleryName) => {
    if (galleryName === '갤러리 전체') {
      return '갤러리 전체';
    }
    const gallery = galleryList.find(g => g.name === galleryName);
    return gallery ? gallery.id : '갤러리 전체';
  }, [galleryList]);

  // 컴포넌트 마운트 시 및 갤러리 선택 변경 시 API 호출
  useEffect(() => {
    if (galleryList.length > 0 && selectedGallery) {
      const galleryId = getGalleryId(selectedGallery);
      console.log('🎨 ExhibitionManagement - selectedGallery:', selectedGallery, 'galleryId:', galleryId);
      loadExhibitions('', galleryId);
    } else if (galleryList.length > 0) {
      // galleryList는 있지만 selectedGallery가 없거나 비어있을 경우 초기 로드
      loadExhibitions('', '갤러리 전체');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGallery, galleryList]);

  // 선택된 갤러리의 ID 계산
  const selectedGalleryId = useMemo(() => {
    return getGalleryId(selectedGallery);
  }, [selectedGallery, galleryList, getGalleryId]);

  // 서버 필터링이 제대로 작동하지 않는 경우를 대비해 클라이언트 필터링 추가
  const filteredExhibitionList = exhibitionList.filter(exhibition => {
    if (selectedGallery === '갤러리 전체') {
      return true;
    }
    // 갤러리 ID로도 비교 (더 정확함)
    if (exhibition.gallery_id && selectedGalleryId) {
      return String(exhibition.gallery_id) === String(selectedGalleryId);
    }
    return exhibition.gallery_name === selectedGallery;
  });


  // 갤러리 옵션에 "갤러리 전체" 추가
  const galleryOptions = [
    { id: 'all', name: '갤러리 전체', value: '갤러리 전체' },
    ...galleryList.map(gallery => ({
      id: gallery.id,
      name: gallery.name,
      value: gallery.name
    }))
  ];

  if (filteredExhibitionList.length > 0) {
    return (
      <section className={styles.contentContainer}>
        <LookUp 
          value={selectedGallery} 
          onChange={onGalleryChange}
          options={galleryOptions}
        />
        
        <div className={styles.countAndButtonContainer}>
          <CountList count={filteredExhibitionList.length} />
          <RegisterButton 
            buttonText="+전시회 등록"
            onButtonClick={() => alert('전시회 등록')}
          />
        </div>

        <section className={styles.contentContainer}>
          {filteredExhibitionList.map(exhibition => (
            <div key={exhibition.id} className={styles.galleryCard}>
              <div className={styles.cardContent}>
                <img 
                  src={exhibition.image} 
                  alt={exhibition.title}
                  className={styles.galleryImage}
                />
                <div className={styles.cardInfo}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.galleryTitle}>{exhibition.title}</h3>
                    <button 
                      onClick={() => handleDelete(exhibition.id)}
                      className={styles.deleteButton}
                    >
                      <HiTrash size={18} />
                    </button>
                  </div>
                  <p className={styles.galleryAddress}>{exhibition.period}</p>
                  <p className={styles.galleryFloor}>{exhibition.gallery_name}</p>
                </div>
              </div>
            </div>
          ))}
        </section>
      </section>
    );
  }

  return (
    <>
      <div className={styles.searchContainer}>
        <LookUp 
          value={selectedGallery} 
          onChange={onGalleryChange}
          options={galleryOptions}
        />
      </div>
      
      <div className={styles.countAndButtonContainer}>
        <CountList count={0} />
        <RegisterButton 
          buttonText="+전시회 등록"
          onButtonClick={() => alert('전시회 등록')}
        />
      </div>

      <section className={styles.emptyStateContainer}>
        <EmptyState 
          message="등록된 전시회가 없어요."
          buttonText="+전시회 등록"
        />
      </section>
    </>
  );
}
