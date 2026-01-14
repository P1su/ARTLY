import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { FaSearch, FaPlus, FaImage, FaChevronLeft } from 'react-icons/fa';
import styles from './ArtworkSelectModal.module.css';
import { userInstance } from '../../../../apis/instance';
import Img from '../../../../components/Img/Img';
import { useAlert } from '../../../../store/AlertProvider';
import ArtistSelectModal from '../ArtistSelectModal/ArtistSelectModal';

export default function ArtworkSelectModal({
  onClose,
  onSelect,
  exhibitionId,
  galleryId,
  galleryList = [],
  mode = 'local',
  multiSelect = false,
  existingArtworks = [],
  selectedArtists = [],  // 전시회에서 선택된 작가 목록
}) {
  const stableArtists = useMemo(
    () => selectedArtists,
    [JSON.stringify(selectedArtists)]
  );

  const { showAlert } = useAlert();
  const fileInputRef = useRef(null);

  // State
  const [step, setStep] = useState('search');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [artList, setArtList] = useState([]);
  const [filteredArtList, setFilteredArtList] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 작가 필터
  const [artistFilter, setArtistFilter] = useState('all');
  const [galleryArtistIds, setGalleryArtistIds] = useState([]);

  // 다중 선택용
  const [selectedArts, setSelectedArts] = useState(existingArtworks);

  // 신규 등록 폼
  const [newArtwork, setNewArtwork] = useState({
    art_title: '',
    artist_id: '',
    artist_name: '',
    art_material: '',
    art_size: '',
    art_year: '',
    art_description: '',
  });
  const [newArtworkImage, setNewArtworkImage] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);

  // 작가 선택 모달
  const [showArtistModal, setShowArtistModal] = useState(false);

  // 초기 로드
  useEffect(() => {
    if (mode === 'local' && galleryId) {
      loadMyArtworks();
    }
  }, [mode, galleryId]);

  // 작가 필터 적용
  useEffect(() => {
    if (mode === 'global') return;
    // 선택된 작가가 없으면 작품 표시 안 함
    if (stableArtists.length === 0) {
      setFilteredArtList([]);
      return;
    }

    // 선택된 작가들의 ID 목록
    const selectedArtistIds = stableArtists.map(a => String(a.id));

    if (artistFilter === 'all') {
      // "전체" = 선택된 작가들의 모든 작품
      const filtered = artList.filter(art => {
        const artArtistId = String(art.artist_id || art.artist?.id);
        return selectedArtistIds.includes(artArtistId);
      });
      setFilteredArtList(filtered);
    } else {
      // 특정 작가 선택
      const filtered = artList.filter(art => {
        const artArtistId = art.artist_id || art.artist?.id;
        return String(artArtistId) === String(artistFilter);
      });
      setFilteredArtList(filtered);
    }
  }, [mode, artistFilter, artList, stableArtists]);

  // global 모드: 갤러리 작가 목록 조회
  useEffect(() => {
    if (mode === 'global' && galleryId) {
      loadGalleryArtists();
    }
  }, [mode, galleryId]);

  const loadMyArtworks = async () => {
    console.log('loadMyArtworks 호출, galleryId:', galleryId);
    if (!galleryId) {
      console.error('galleryId가 없습니다');
      setArtList([]);
      setFilteredArtList([]);
      return;
    }
    
    try {
      setIsLoading(true);
      // 내 갤러리의 작품만 조회
      const res = await userInstance.get(`/api/arts/by-gallery/${galleryId}`);
      let list = Array.isArray(res.data) ? res.data : res.data.data || [];
      
      console.log('API 응답 작품 수:', list.length);  // 추가
      console.log('stableArtists:', stableArtists);   // 추가
      
      setArtList(list);
      
      // 선택된 작가가 없으면 빈 배열
      if (stableArtists.length === 0) {
        setFilteredArtList([]);
      } else {
        const selectedArtistIds = stableArtists.map(a => String(a.id));
        setFilteredArtList(list.filter(art => {
          const artArtistId = String(art.artist_id || art.artist?.id);
          return selectedArtistIds.includes(artArtistId);
        }));
      }
    } catch (error) {
      console.error('내 작품 로드 실패:', error);
      setArtList([]);
      setFilteredArtList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadGalleryArtists = async () => {
    try {
      const res = await userInstance.get(`/api/artists/by-gallery/${galleryId}`);
      const ids = (res.data || []).map((a) => a.id);
      setGalleryArtistIds(ids);
    } catch (error) {
      console.error('갤러리 작가 로드 실패:', error);
      setGalleryArtistIds([]);
    }
  };

  // 검색
  const fetchArts = async (keyword) => {
    if (mode === 'global' && !keyword?.trim()) {
      showAlert('검색어를 입력해주세요.');
      return;
    }
  
    try {
      setIsLoading(true);
      
      if (mode === 'local') {
        if (!galleryId) {
          setArtList([]);
          setFilteredArtList([]);
          return;
        }
        const res = await userInstance.get(`/api/arts/by-gallery/${galleryId}`);
        let list = Array.isArray(res.data) ? res.data : res.data.data || [];
        
        // 작품명 + 작가명 검색
        if (keyword?.trim()) {
          const lowerKeyword = keyword.toLowerCase();
          list = list.filter(art => {
            const title = (art.art_title || '').toLowerCase();
            const artistName = (art.artist?.artist_name || art.artist_name || '').toLowerCase();
            return title.includes(lowerKeyword) || artistName.includes(lowerKeyword);
          });
        }
        setArtList(list);
        
      } else {
        if (galleryArtistIds.length === 0) {
          showAlert('갤러리에 등록된 작가가 없습니다.\n먼저 작가를 등록해주세요.');
          setIsLoading(false);
          return;
        }

        // 글로벌 모드: 백엔드에서 이미 작품명+작가명 검색 지원
        const res = await userInstance.get('/api/arts', { 
          params: { 
            search: keyword,
            artist_ids: galleryArtistIds.join(',')
          } 
        });
        let list = Array.isArray(res.data) ? res.data : res.data.data || [];
        setArtList(list);
        setFilteredArtList(list);
      }
      
      setHasSearched(true);
    } catch (error) {
      console.error('작품 검색 실패:', error);
      showAlert('검색 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') fetchArts(searchKeyword);
  };

  // 단일 선택
  const handleSelectSingle = async (art) => {
    if (mode === 'global' && exhibitionId) {
      try {
        setIsLoading(true);
        await userInstance.post(`/api/exhibitions/${exhibitionId}/arts`, {
          art_ids: [art.id],
        });
        showAlert('작품이 전시회에 연결되었습니다.');
      } catch (error) {
        if (error.response?.status !== 409) {
          console.error('연결 실패:', error);
          showAlert('연결 중 오류가 발생했습니다.');
          return;
        }
      } finally {
        setIsLoading(false);
      }
    }
    // 갤러리 연결 추가
  if (mode === 'global' && galleryId && !exhibitionId) {
    try {
      setIsLoading(true);
      await userInstance.post('/api/arts/link-gallery', {
        art_id: art.id,
        gallery_id: galleryId,
      });
      showAlert('작품이 갤러리에 연결되었습니다.');
    } catch (error) {
      if (error.response?.status !== 409) {
        showAlert('연결 중 오류가 발생했습니다.');
        return;
      }
    } finally {
      setIsLoading(false);
    }
  }
    onSelect(art);
    onClose();
  };

  // 다중 선택 토글
  const toggleSelect = (art) => {
    setSelectedArts((prev) => {
      const isSelected = prev.some((item) => item.id === art.id);
      if (isSelected) {
        return prev.filter((item) => item.id !== art.id);
      } else {
        return [...prev, art];
      }
    });
  };

  const handleConfirmMulti = () => {
    onSelect(selectedArts);
    onClose();
  };

  // 신규 등록
  const goToCreate = () => {
    setNewArtwork((prev) => ({ ...prev, art_title: searchKeyword }));
    setStep('create');
  };

  const goBackToSearch = () => {
    setStep('search');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewArtwork((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewArtworkImage(file);
      setNewImagePreview(URL.createObjectURL(file));
    }
  };

  // 작가 선택 완료
  const handleArtistSelect = (artist) => {
    setNewArtwork((prev) => ({
      ...prev,
      artist_id: artist.id,
      artist_name: artist.artist_name,
    }));
    setShowArtistModal(false);
  };

  const handleCreateArtwork = async () => {
    console.log('handleCreateArtwork 실행됨'); //콘솔
    console.log('galleryId:', galleryId);
    if (!newArtwork.art_title.trim()) {
      showAlert('작품명을 입력해주세요.');
      return;
    }
    if (!newArtwork.artist_id) {
      showAlert('작가를 선택해주세요.');
      return;
    }
    if (!newArtworkImage) {
      showAlert('작품 이미지를 등록해주세요.');
      return;
    }
  
    try {
      setIsLoading(true);
  
      const formData = new FormData();
      formData.append('art_title', newArtwork.art_title);
      formData.append('artist_id', newArtwork.artist_id);
      formData.append('art_material', newArtwork.art_material);
      formData.append('art_size', newArtwork.art_size);
      formData.append('art_year', newArtwork.art_year);
      formData.append('art_description', newArtwork.art_description);
      if (galleryId) {
        formData.append('gallery_id', galleryId);  // 갤러리 ID 추가
      }
      if (newArtworkImage) {
        formData.append('image', newArtworkImage);
      }
  
      const res = await userInstance.post('/api/arts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      const createdArtwork = res.data?.data || res.data;
  
      // 전시회에 연결 (전시회 등록에서 사용 시)
      if (exhibitionId && createdArtwork?.id) {
        try {
          await userInstance.post(`/api/exhibitions/${exhibitionId}/arts`, {
            art_ids: [createdArtwork.id],
          });
        } catch (linkError) {
          if (linkError.response?.status !== 409) {
            console.error('전시회 연결 실패:', linkError);
          }
        }
      }
  
      showAlert('작품이 등록되었습니다.');
      onSelect(createdArtwork);
      onClose();
    } catch (error) {
      console.error('작품 등록 실패:', error);
      showAlert('작품 등록 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          {step !== 'search' && (
            <button className={styles.backBtn} onClick={goBackToSearch}>
              <FaChevronLeft />
            </button>
          )}
          <h3>
            {step === 'search' && (mode === 'global' ? '작품 검색' : '작품 선택')}
            {step === 'create' && '새 작품 등록'}
          </h3>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.body}>
          {/* 검색 화면 */}
          {step === 'search' && (
            <>
              <div className={styles.searchBar}>
                <input
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={handleSearch}
                  placeholder="작품 또는 작가 검색"
                  autoFocus
                />
                <button onClick={() => fetchArts(searchKeyword)} disabled={isLoading}>
                  <FaSearch />
                </button>
              </div>

              {/* 작가 필터 (local 모드 + 선택된 작가가 있을 때만) */}
              {mode === 'local' && stableArtists.length > 0 && (
                <div className={styles.artistFilter}>
                  <label>작가 필터:</label>
                  <select
                    value={artistFilter}
                    onChange={(e) => setArtistFilter(e.target.value)}
                  >
                    <option value="all">선택된 작가 전체</option>
                    {stableArtists.map((artist) => (
                      <option key={artist.id} value={artist.id}>
                        {artist.artist_name || artist.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className={styles.listContainer}>
                {isLoading ? (
                  <div className={styles.emptyState}>검색 중...</div>
                ) : filteredArtList.length > 0 ? (
                  filteredArtList.map((art) => {
                    const isSelected = selectedArts.some((a) => a.id === art.id);
                    return (
                      <div
                        key={art.id}
                        className={`${styles.artistRow} ${isSelected ? styles.selected : ''}`}
                        onClick={() => multiSelect ? toggleSelect(art) : handleSelectSingle(art)}
                      >
                        {multiSelect && (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className={styles.checkbox}
                          />
                        )}
                        <Img
                          src={art.art_image || art.image}
                          alt={art.art_title}
                          className={styles.artistImg}
                          wrapperProps={{}}
                        />
                        <div className={styles.artistInfo}>
                          <span className={styles.name}>{art.art_title}</span>
                          <span className={styles.category}>
                            {art.artist?.artist_name || art.artist_name || '작가미상'}
                          </span>
                        </div>
                        {!multiSelect && (
                          <button className={styles.selectBtn} disabled={isLoading}>
                            선택
                          </button>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className={styles.emptyState}>
                    {mode === 'local' && stableArtists.length === 0 ? (
                      <p>먼저 참여 작가를 추가해주세요.</p>
                    ) : !hasSearched && mode === 'local' ? (
                      <p>선택된 작가의 작품이 없습니다.<br/>작품 관리에서 먼저 작품을 등록해주세요.</p>
                    ): !hasSearched ? (
                      <>
                        <p>작품명을 검색하거나 새로 등록하세요.</p>
                        <button className={styles.addNewBtn} onClick={goToCreate}>
                          <FaPlus /> 새 작품 등록
                        </button>
                      </>
                    ) : (
                      <>
                        <p>"{searchKeyword}" 검색 결과가 없습니다.</p>
                        {mode === 'global' && (
                          <button className={styles.addNewBtn} onClick={goToCreate}>
                            <FaPlus /> 새 작품 등록
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {multiSelect && (
                <div className={styles.footer}>
                  <button className={styles.confirmBtn} onClick={handleConfirmMulti}>
                    선택 완료 ({selectedArts.length}개)
                  </button>
                </div>
              )}
            </>
          )}

          {/* 신규 등록 */}
          {step === 'create' && mode === 'global' && (
            <div className={styles.addFormContainer}>
              <div
                className={styles.imageUploadBox}
                onClick={() => fileInputRef.current.click()}
              >
                {newImagePreview ? (
                  <Img src={newImagePreview} alt="Preview" />
                ) : (
                  <div className={styles.placeholder}>
                    <FaImage />
                    <span>이미지</span>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleNewImageChange}
                  accept="image/*"
                  hidden
                />
              </div>

              <input
                className={styles.addInput}
                name="art_title"
                placeholder="작품명 *"
                value={newArtwork.art_title}
                onChange={handleInputChange}
              />

              {/* 작가 선택 - 모달 방식 */}
              <div className={styles.artistSelectRow}>
                <div
                  className={styles.artistSelectBox}
                  onClick={() => setShowArtistModal(true)}
                >
                  {newArtwork.artist_name ? (
                    <span className={styles.selectedArtist}>{newArtwork.artist_name}</span>
                  ) : (
                    <span className={styles.artistPlaceholder}>작가를 선택해주세요</span>
                  )}
                </div>
                <button
                  type="button"
                  className={styles.artistSelectBtn}
                  onClick={() => setShowArtistModal(true)}
                >
                  작가 선택
                </button>
              </div>

              <input
                className={styles.addInput}
                name="art_material"
                placeholder="재료 (예: Oil on canvas)"
                value={newArtwork.art_material}
                onChange={handleInputChange}
              />

              <input
                className={styles.addInput}
                name="art_size"
                placeholder="크기 (예: 100x150cm)"
                value={newArtwork.art_size}
                onChange={handleInputChange}
              />

              <input
                className={styles.addInput}
                name="art_year"
                placeholder="제작연도"
                value={newArtwork.art_year}
                onChange={handleInputChange}
              />

              <div className={styles.formActions}>
                <button className={styles.cancelBtn} onClick={goBackToSearch}>
                  취소
                </button>
                <button
                  className={styles.confirmBtn}
                  onClick={handleCreateArtwork}
                  disabled={isLoading}
                >
                  {isLoading ? '등록 중...' : '작품 등록'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 작가 선택 모달 */}
      {showArtistModal && (
        <ArtistSelectModal
          onClose={() => setShowArtistModal(false)}
          onSelect={handleArtistSelect}
          galleryList={galleryList}
          selectedGalleryId={galleryId}
          mode="local"
          multiSelect={false}
        />
      )}
    </div>
  );
}