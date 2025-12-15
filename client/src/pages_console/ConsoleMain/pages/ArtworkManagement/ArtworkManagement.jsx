import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiTrash } from 'react-icons/hi';
import LookUp from '../../components/LookUp/LookUp';
import CountList from '../../components/CountList/CountList';
import RegisterButton from '../../components/RegisterButton/RegisterButton';
import EmptyState from '../../components/EmptyState/EmptyState';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner.jsx';
import styles from './ArtworkManagement.module.css';
import Img from '../../../../components/Img/Img.jsx';
import { useAlert } from '../../../../store/AlertProvider.jsx';
import { useConfirm } from '../../../../store/ConfirmProvider.jsx';

export default function ArtworkManagement({
  artworkList,
  selectedExhibition,
  onExhibitionChange,
  onDelete,
  loadArtworks, // 이 함수가 인자로 '전시회 제목'을 받을 수 있어야 함
  loadExhibitions,
  isLoading,
  error,
  galleryList,
  exhibitionList,
}) {
  const navigate = useNavigate();
  const { showConfirm } = useConfirm();
  const { showAlert } = useAlert();

  const handleDelete = async (id) => {
    const isConfirmed = await showConfirm(
      '정말로 이 작품을 삭제하시겠습니까?',
      true,
    );

    if (isConfirmed) {
      await onDelete(id, 'artwork');

      navigate('/console/main', {
        state: { activeTab: '작품관리' },
        replace: true,
      });
    }
  };

  // 1. 처음 마운트 시 전시회 목록 로드
  useEffect(() => {
    if (loadExhibitions) {
      loadExhibitions('갤러리 전체');
    }
  }, []);

  // 2. ★ 핵심 수정: 전시회 선택이 바뀔 때마다, 해당 전시회의 '제목'을 찾아 API 재요청
  useEffect(() => {
    // Case A: 특정 전시회가 선택되었을 때
    if (selectedExhibition) {
      // 전시회 목록이 아직 로드 안 됐으면, 찾을 수 없으니 기다림
      if (!exhibitionList || exhibitionList.length === 0) return;

      // ID 타입(숫자 vs 문자) 안전하게 비교
      const targetExhibition = exhibitionList.find(
        (ex) => String(ex.id) === String(selectedExhibition),
      );

      if (targetExhibition) {
        loadArtworks(targetExhibition.title);
      }
    }
    // Case B: 선택된 전시회가 없을 때 (기본값)
    else {
      // ★ 전시회 목록이 있든 없든 상관없이 전체 작품 로드 실행
      loadArtworks('');
    }
  }, [selectedExhibition, exhibitionList, loadArtworks]);
  const handleRegister = () => {
    if (!selectedExhibition) {
      showAlert('작품을 등록할 전시회를 상단 필터에서 먼저 선택해주세요.');
      return;
    }
    navigate(`/console/artworks/edit/new?exhibition_id=${selectedExhibition}`);
  };

  // 3. 필터링 로직 제거 (서버에서 이미 필터링된 데이터를 줌)
  // 프론트에서 또 거르면 안 됨 (데이터에 exhibition info가 없으므로)
  const filteredArtworkList = useMemo(() => {
    return artworkList || [];
  }, [artworkList]);

  // 전시회 옵션 생성
  const exhibitionOptions = useMemo(() => {
    const options = [];
    if (exhibitionList) {
      exhibitionList.forEach((exhibition) => {
        options.push({
          id: exhibition.id,
          name: exhibition.title,
          value: exhibition.id,
        });
      });
    }
    return options;
  }, [exhibitionList]);

  if (isLoading) {
    return (
      <div className={styles.contentContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <section className={styles.contentContainer}>
      {/* 전시회 필터 드롭다운 */}
      <div className={styles.searchContainer}>
        <LookUp
          value={selectedExhibition}
          onChange={onExhibitionChange}
          options={exhibitionOptions}
          placeholder='전시회를 선택하세요'
        />
      </div>

      <div className={styles.countAndButtonContainer}>
        <CountList count={filteredArtworkList.length} />
        <RegisterButton
          buttonText='+작품 등록'
          onButtonClick={handleRegister}
        />
      </div>

      {filteredArtworkList.length > 0 ? (
        <section className={styles.cardContainer}>
          {filteredArtworkList.map((artwork) => (
            <div
              key={artwork.id}
              className={styles.artworkCard}
              onClick={() => navigate(`/console/artworks/${artwork.id}`)}
            >
              <div className={styles.cardContent}>
                <Img
                  src={artwork.image}
                  alt={artwork.title}
                  className={styles.artworkImage}
                />
                <div className={styles.cardInfo}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.artworkTitle}>{artwork.title}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(artwork.id);
                      }}
                      className={styles.deleteButton}
                    >
                      <HiTrash size={18} />
                    </button>
                  </div>
                  <p className={styles.artworkArtist}>
                    {artwork.artist || '작가 미상'}
                  </p>
                  {/* 데이터에 전시회 이름이 없으므로, 현재 선택된 전시회 이름을 보여주거나 비워야 함 */}
                  <p className={styles.artworkExhibition}>
                    {/* 현재 선택된 전시회 제목 표시 */}
                    {selectedExhibition
                      ? exhibitionList.find(
                          (ex) => ex.id === selectedExhibition,
                        )?.title
                      : artwork.exhibition_title ||
                        artwork.exhibition_name ||
                        '-'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <section className={styles.emptyStateContainer}>
          <EmptyState
            message='등록된 작품이 없어요.'
            buttonText='+작품 등록'
            onButtonClick={handleRegister}
          />
        </section>
      )}
    </section>
  );
}
