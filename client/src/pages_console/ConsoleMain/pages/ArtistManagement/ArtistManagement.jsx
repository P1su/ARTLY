import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiTrash } from 'react-icons/hi';

import LookUp from '../../components/LookUp/LookUp';
import CountList from '../../components/CountList/CountList';
import RegisterButton from '../../components/RegisterButton/RegisterButton';
import EmptyState from '../../components/EmptyState/EmptyState';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner.jsx';
import Img from '../../../../components/Img/Img.jsx';

import styles from './ArtistManagement.module.css';
import { useAlert } from '../../../../store/AlertProvider.jsx';
import { useConfirm } from '../../../../store/ConfirmProvider.jsx';
import { userInstance } from '../../../../apis/instance.js';

export default function ArtistManagement({ galleryList }) {
  const navigate = useNavigate();
  const { showConfirm } = useConfirm();
  const { showAlert } = useAlert();

  const [artistList, setArtistList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const isInitialMount = useRef(true);

  // 내 갤러리/전시회/작품에 연결된 작가만 조회
  const loadMyArtists = useCallback(async (search = '') => {
    try {
      setIsLoading(true);
  
      const myGalleryIds = galleryList?.map((g) => g.id) || [];
      if (myGalleryIds.length === 0) {
        setArtistList([]);
        return;
      }
  
      // 1. 내 전시회 조회
      const exhibitionRes = await userInstance.get('/api/exhibitions');
      const myExhibitions = (exhibitionRes.data || []).filter((ex) =>
        myGalleryIds.includes(ex.gallery_id)
      );
  
      // 2. 전시회 상세 병렬 호출 (순차 → 병렬)
      const detailPromises = myExhibitions.map((ex) =>
        userInstance.get(`/api/exhibitions/${ex.id}`).catch(() => null)
      );
      const detailResults = await Promise.all(detailPromises);
  
      // 3. 작가 수집
      const artistMap = new Map();
      
      detailResults.forEach((res, index) => {
        if (!res) return;
        const exhibition = myExhibitions[index];
        const artists = res.data?.artists || [];
  
        artists.forEach((artist) => {
          if (!artistMap.has(artist.id)) {
            artistMap.set(artist.id, {
              ...artist,
              exhibitions: [],
              gallery_name: exhibition.exhibition_organization?.name || '',
            });
          }
          artistMap.get(artist.id).exhibitions.push({
            id: exhibition.id,
            title: exhibition.exhibition_title,
          });
        });
      });
  
      let artists = Array.from(artistMap.values());
  
      // 4. 검색 필터링
      if (search.trim()) {
        const keyword = search.toLowerCase();
        artists = artists.filter((artist) => {
          const nameMatch = artist.artist_name?.toLowerCase().includes(keyword);
          const galleryMatch = artist.gallery_name?.toLowerCase().includes(keyword);
          const exhibitionMatch = artist.exhibitions?.some((ex) =>
            ex.title?.toLowerCase().includes(keyword)
          );
          return nameMatch || galleryMatch || exhibitionMatch;
        });
      }
  
      setArtistList(artists);
    } catch (err) {
      console.error('작가 목록 로드 실패:', err);
      setArtistList([]);
    } finally {
      setIsLoading(false);
    }
  }, [galleryList]);

  // 초기 로드 (galleryList 변경 시)
  useEffect(() => {
    if (galleryList?.length > 0) {
      loadMyArtists();
    }
  }, [galleryList, loadMyArtists]);

  // 검색 (디바운스)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      loadMyArtists(searchValue);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  // 삭제
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    const isConfirmed = await showConfirm(
      '정말로 이 작가를 삭제하시겠습니까?',
      true,
    );

    if (isConfirmed) {
      try {
        await userInstance.delete(`/api/artists/${id}`);
        showAlert('작가가 삭제되었습니다.');
        loadMyArtists(searchValue);
      } catch (err) {
        console.error('삭제 실패:', err);
        if (err.response?.data?.includes?.('Integrity constraint')) {
          showAlert('작가를 삭제할 수 없습니다.\n해당 작가가 등록된 전시회나 작품을 먼저 삭제해주세요.', 'error');
        } else {
          showAlert('삭제 중 오류가 발생했습니다.', 'error');
        }
      }
    }
  };

  // 등록
  const handleRegister = () => {
    navigate('/console/artists/edit/new');
  };

  // 카드 클릭 → 상세/수정 페이지
  const handleCardClick = (artistId) => {
    navigate(`/console/artists/${artistId}`);
  };

  if (isLoading) {
    return (
      <div className={styles.contentContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={styles.contentContainer}>
      <div className={styles.searchContainer}>
        <LookUp
          value={searchValue}
          onChange={handleSearchChange}
          placeholder='작가명, 갤러리명, 전시회명 검색'
          isInput
        />
      </div>

      <div className={styles.countAndButtonContainer}>
        <CountList count={artistList.length} />
        <RegisterButton
          buttonText='+작가 등록'
          onButtonClick={handleRegister}
        />
      </div>

      {artistList.length > 0 ? (
        <section className={styles.cardList}>
          {artistList.map((artist) => (
            <div
              key={artist.id}
              className={styles.artistCard}
              onClick={() => handleCardClick(artist.id)}
            >
              <div className={styles.cardContent}>
                <Img
                  src={artist.artist_image}
                  alt={artist.artist_name}
                  className={styles.artistImage}
                />
                <div className={styles.cardInfo}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.artistName}>{artist.artist_name}</h3>
                    <button
                      onClick={(e) => handleDelete(e, artist.id)}
                      className={styles.deleteButton}
                    >
                      <HiTrash size={18} />
                    </button>
                  </div>
                  <p className={styles.artistCategory}>
                    {artist.artist_category || '분야 미지정'}
                  </p>
                  <p className={styles.artistNation}>
                    {artist.artist_nation || '국적 미지정'}
                  </p>
                  {artist.exhibitions?.length > 0 && (
                    <p className={styles.exhibitionInfo}>
                      전시 {artist.exhibitions.length}건 참여
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <section className={styles.emptyStateContainer}>
          <EmptyState
            message='등록된 작가가 없어요.'
            buttonText='+작가 등록'
            onButtonClick={handleRegister}
          />
        </section>
      )}
    </div>
  );
}