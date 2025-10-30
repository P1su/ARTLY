import React, { useState, useEffect, useRef } from 'react';
import { HiTrash } from 'react-icons/hi';
import LookUp from '../../components/LookUp/LookUp';
import CountList from '../../components/CountList/CountList';
import RegisterButton from '../../components/RegisterButton/RegisterButton';
import EmptyState from '../../components/EmptyState/EmptyState';
import styles from './GalleryManagement.module.css';

export default function GalleryManagement({ 
  galleryList, 
  onDelete,
  loadGalleries,
  isLoading,
  error
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const searchTimeoutRef = useRef(null);
  
  // 검색어 변경 시 API 호출 (디바운스 적용)
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    
    // 이전 타이머 취소
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // 500ms 후에 API 호출 (디바운스)
    searchTimeoutRef.current = setTimeout(() => {
      loadGalleries(query);
    }, 500);
  };
  
  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // 검색 필터링된 갤러리 목록 (서버에서 필터링됨)
  const filteredGalleryList = Array.isArray(galleryList) ? galleryList : [];

  const handleDelete = (id) => {
    if (window.confirm('정말로 이 갤러리를 삭제하시겠습니까?')) {
      onDelete(id, 'gallery');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.contentContainer}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          갤러리 목록을 불러오는 중...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.contentContainer}>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
          오류가 발생했습니다: {error}
        </div>
      </div>
    );
  }

  if (filteredGalleryList.length > 0) {
    return (
      <div className={styles.contentContainer}>
        <LookUp 
          value={searchQuery} 
          onChange={handleSearchChange}
          placeholder="갤러리 검색"
          isInput={true}
        />
        
        <div className={styles.countAndButtonContainer}>
          <CountList count={filteredGalleryList.length} />
          <RegisterButton 
            buttonText="+갤러리 등록"
            onButtonClick={() => alert('갤러리 등록')}
          />
        </div>

        <section className={styles.contentContainer}>
          {filteredGalleryList.map(gallery => (
            <div key={gallery.id} className={styles.galleryCard}>
              <div className={styles.cardContent}>
                <img 
                  src={gallery.image} 
                  alt={gallery.name}
                  className={styles.galleryImage}
                />
                <div className={styles.cardInfo}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.galleryTitle}>{gallery.name}</h3>
                    <button 
                      onClick={() => handleDelete(gallery.id)}
                      className={styles.deleteButton}
                    >
                      <HiTrash size={18} />
                    </button>
                  </div>
                  <p className={styles.galleryAddress}>{gallery.address}</p>
                  <p className={styles.galleryClosedDay}>휴관일 | {gallery.closedDay}</p>
                  <p className={styles.galleryTime}>{gallery.time}</p>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <span>등록된 전시회 {gallery.registered}건</span>
                <span className={styles.separator}>|</span>
                <span>좋아요 {gallery.liked}명</span>
              </div>
            </div>
          ))}
        </section>
      </div>
    );
  }

  return (
    <>
      <div className={styles.searchContainer}>
        <LookUp 
          value={searchQuery} 
          onChange={handleSearchChange}
          placeholder="갤러리 검색"
          isInput={true}
        />
      </div>
      
      <div className={styles.countAndButtonContainer}>
        <CountList count={0} />
        <RegisterButton 
          buttonText="+갤러리 등록"
          onButtonClick={() => alert('갤러리 등록')}
        />
      </div>

      <section className={styles.emptyStateContainer}>
        <EmptyState 
          message="등록된 갤러리가 없어요."
          buttonText="+갤러리 등록"
        />
      </section>
    </>
  );
}
