import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiTrash } from 'react-icons/hi';
import LookUp from '../../components/LookUp/LookUp';
import CountList from '../../components/CountList/CountList';
import RegisterButton from '../../components/RegisterButton/RegisterButton';
import EmptyState from '../../components/EmptyState/EmptyState';
import Spinner from '../../components/Spinner/Spinner';
import useDebounceSearch from '../../hooks/useDebounceSearch';
import styles from './GalleryManagement.module.css';

export default function GalleryManagement({
  galleryList,
  onDelete,
  loadGalleries,
  isLoading, // 초기 로딩 or 페이지 전환 로딩
  isSearching, // 검색어 입력 중 로딩 (백그라운드)
  error,
}) {
  const navigate = useNavigate();

  // 디바운스 검색 hook 사용
  const { searchValue, handleSearchChange } = useDebounceSearch({
    onSearch: loadGalleries,
    onEmptySearch: () => loadGalleries(''),
    minLength: 1, // 1글자라도 검색되게 변경 (UX상 자연스러움)
    delay: 500,
  });

  const filteredGalleryList = Array.isArray(galleryList) ? galleryList : [];

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm('정말로 이 갤러리를 삭제하시겠습니까?')) {
      onDelete(id, 'gallery');
    }
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className={styles.errorMessage}>오류가 발생했습니다: {error}</div>
      );
    }

    if (isLoading && filteredGalleryList.length === 0) {
      return <Spinner />;
    }

    if (filteredGalleryList.length > 0) {
      return (
        <section className={styles.contentContainer}>
          <div
            style={{
              opacity: isSearching ? 0.5 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {filteredGalleryList.map((gallery) => (
              <div
                key={gallery.id}
                className={styles.galleryCard}
                onClick={() => navigate(`/console/galleries/${gallery.id}`)}
              >
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
                        onClick={(e) => handleDelete(e, gallery.id)}
                        className={styles.deleteButton}
                      >
                        <HiTrash size={18} />
                      </button>
                    </div>
                    <p className={styles.galleryAddress}>
                      주소 | {gallery.address}
                    </p>
                    <p className={styles.galleryClosedDay}>
                      휴관일 | {gallery.closedDay}
                    </p>
                    <p className={styles.galleryTime}>
                      운영 시간 | {gallery.time}
                    </p>
                  </div>
                </div>
                <div className={styles.cardFooter}>
                  <span>등록된 전시회 {gallery.registered}건</span>
                  <span className={styles.separator}>|</span>
                  <span>좋아요 {gallery.liked}명</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    return (
      <section className={styles.emptyStateContainer}>
        <EmptyState
          message={
            searchValue ? '검색 결과가 없어요.' : '등록된 갤러리가 없어요.'
          }
          buttonText='+갤러리 등록'
        />
      </section>
    );
  };

  return (
    <div className={styles.contentContainer}>
      <div className={styles.searchContainer}>
        <LookUp
          value={searchValue}
          onChange={(val) => handleSearchChange(val)}
          placeholder='갤러리 검색'
          isInput
        />
      </div>

      <div className={styles.countAndButtonContainer}>
        <CountList count={filteredGalleryList.length} />
        <RegisterButton
          buttonText='+갤러리 등록'
          onButtonClick={() => navigate(`/console/galleries/edit/new`)}
        />
      </div>

      {renderContent()}
    </div>
  );
}
