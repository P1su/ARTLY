import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiTrash } from 'react-icons/hi';
import LookUp from '../../components/LookUp/LookUp';
import CountList from '../../components/CountList/CountList';
import RegisterButton from '../../components/RegisterButton/RegisterButton';
import EmptyState from '../../components/EmptyState/EmptyState';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner.jsx';
import useDebounceSearch from '../../hooks/useDebounceSearch';
import styles from './GalleryManagement.module.css';
import Img from '../../../../components/Img/Img.jsx';

export default function GalleryManagement({
  galleryList,
  onDelete,
  loadGalleries,
  isLoading,

  isSearching,
  error,
}) {
  const navigate = useNavigate();

  // 디바운스 검색 hook 사용
  const { searchValue, handleSearchChange } = useDebounceSearch({
    onSearch: loadGalleries,
    onEmptySearch: () => loadGalleries(''),
    minLength: 2,
    delay: 500,
  });

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
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.contentContainer}>
        <div className={styles.errorMessage}>오류가 발생했습니다: {error}</div>
      </div>
    );
  }

  if (filteredGalleryList.length > 0) {
    return (
      <div className={styles.contentContainer}>
        <LookUp
          value={searchValue}
          onChange={handleSearchChange}
          placeholder='갤러리 검색'
          isInput
        />

        <div className={styles.countAndButtonContainer}>
          <CountList count={filteredGalleryList.length} />
          <RegisterButton
            buttonText='+갤러리 등록'
            onButtonClick={() => navigate(`/console/galleries/edit/new`)}
          />
        </div>

        <section className={styles.contentContainer}>
          {filteredGalleryList.map((gallery) => (
            <div
              key={gallery.id}
              className={styles.galleryCard}
              onClick={() => navigate(`/console/galleries/${gallery.id}`)}
            >
              <div className={styles.cardContent}>
                <Img
                  src={gallery.image}
                  alt={gallery.name}
                  className={styles.galleryImage}
                />
                <div className={styles.cardInfo}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.galleryTitle}>{gallery.name}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(gallery.id);
                      }}
                      className={styles.deleteButton}
                    >
                      <HiTrash size={18} />
                    </button>
                  </div>
                  <p className={styles.galleryAddress}>{gallery.address}</p>
                  <p className={styles.galleryClosedDay}>
                    휴관일 | {gallery.closedDay}
                  </p>
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
          value={searchValue}
          onChange={handleSearchChange}
          placeholder='갤러리 검색'
          isInput
        />
      </div>

      <div className={styles.countAndButtonContainer}>
        <CountList count={0} />
        <RegisterButton
          buttonText='+갤러리 등록'
          onButtonClick={() => alert('갤러리 등록')}
        />
      </div>

      <section className={styles.emptyStateContainer}>
        <EmptyState
          message='등록된 갤러리가 없어요.'
          buttonText='+갤러리 등록'
        />
      </section>
    </>
  );
}
