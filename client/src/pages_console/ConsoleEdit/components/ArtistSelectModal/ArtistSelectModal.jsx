import { useState, useRef, useEffect } from 'react';
import { FaSearch, FaPlus, FaUser, FaChevronLeft } from 'react-icons/fa';
import styles from './ArtistSelectModal.module.css';
import { userInstance } from '../../../../apis/instance';
import Img from '../../../../components/Img/Img';
import { useAlert } from '../../../../store/AlertProvider';
import { artistFilter } from '../../../../utils/filters/artisFilter.js';

const NATION_OPTIONS = artistFilter.find((f) => f.key === 'nation')?.options || [];

// ID 정규화 헬퍼
const getArtistId = (artist) => artist.id || artist.artist_id;

export default function ArtistSelectModal({ 
  onClose, 
  onSelect, 
  galleryList,
  mode = 'global',
  multiSelect = false,
  existingArtists = [],
  selectedGalleryId: propGalleryId,
}) {
  const { showAlert } = useAlert();
  const fileInputRef = useRef(null);

  // State
  const [step, setStep] = useState('search');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [artistList, setArtistList] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 갤러리 선택
  const [selectedGalleryId, setSelectedGalleryId] = useState(
    propGalleryId || galleryList?.[0]?.id || null
  );

  // 다중 선택용 - existingArtists ID 정규화
  const [selectedArtists, setSelectedArtists] = useState(() => 
    existingArtists.map(artist => ({
      ...artist,
      id: getArtistId(artist)
    }))
  );

  // 신규 등록 폼
  const [newArtist, setNewArtist] = useState({
    artist_name: '',
    artist_category: '',
    artist_nation: '',
    artist_homepage: '',
    artist_description: '',
  });
  const [newArtistImage, setNewArtistImage] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [duplicateList, setDuplicateList] = useState([]);

  // 초기 로드 (local 모드)
  useEffect(() => {
    if (mode === 'local' && selectedGalleryId) {
      loadMyArtists();
    }
  }, [mode, selectedGalleryId]);

  useEffect(() => {
    if (propGalleryId) {
      setSelectedGalleryId(propGalleryId);
    }
  }, [propGalleryId]);
  
  const loadMyArtists = async () => {
    try {
      setIsLoading(true);
      const res = await userInstance.get(`/api/artists/by-gallery/${selectedGalleryId}`);
      setArtistList(res.data || []);
      setHasSearched(true);
    } catch (error) {
      console.error('내 작가 로드 실패:', error);
      setArtistList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 검색
  const fetchArtists = async (keyword) => {
    if (mode === 'global' && !keyword?.trim()) {
      showAlert('검색어를 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      
      if (mode === 'local') {
        const res = await userInstance.get(`/api/artists/by-gallery/${selectedGalleryId}`);
        let list = res.data || [];
        if (keyword?.trim()) {
          list = list.filter(artist => 
            artist.artist_name?.toLowerCase().includes(keyword.toLowerCase())
          );
        }
        setArtistList(list);
      } else {
        const res = await userInstance.get('/api/artist', {
          params: { search: keyword },
        });
        setArtistList(res.data || []);
      }
      
      setHasSearched(true);
    } catch (error) {
      console.error('작가 검색 실패:', error);
      showAlert('검색 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') fetchArtists(searchKeyword);
  };

  // 단일 선택 (global 모드)
  const handleSelectSingle = async (artist) => {
    if (mode === 'global' && selectedGalleryId) {
      try {
        setIsLoading(true);
        await userInstance.post('/api/artists/link-gallery', {
          artist_id: artist.id,
          gallery_id: selectedGalleryId,
        });
        showAlert('작가가 갤러리에 연결되었습니다.');
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
    onSelect(artist);
    onClose();
  };

  // 다중 선택 토글
  const toggleSelect = (artist) => {
    const artistId = getArtistId(artist);
    setSelectedArtists((prev) => {
      const isSelected = prev.some((item) => getArtistId(item) === artistId);
      if (isSelected) {
        return prev.filter((item) => getArtistId(item) !== artistId);
      } else {
        return [...prev, artist];
      }
    });
  };

  const handleConfirmMulti = () => {
    onSelect(selectedArtists);
    onClose();
  };

  // 신규 등록 (global 모드만)
  const goToCreate = () => {
    setNewArtist((prev) => ({ ...prev, artist_name: searchKeyword }));
    setStep('create');
  };

  const goBackToSearch = () => {
    setStep('search');
    setDuplicateList([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewArtist((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewArtistImage(file);
      setNewImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreateArtist = async () => {
    if (!newArtist.artist_name.trim()) {
      showAlert('작가 이름을 입력해주세요.');
      return;
    }
    if (!selectedGalleryId) {
      showAlert('갤러리를 선택해주세요.');
      return;
    }

    try {
      setIsLoading(true);

      const checkRes = await userInstance.get('/api/artists/check-duplicate', {
        params: { name: newArtist.artist_name },
      });

      if (checkRes.data?.has_duplicate) {
        setDuplicateList(checkRes.data.duplicates);
        setStep('duplicate');
        return;
      }

      await doCreateArtist();
    } catch (error) {
      console.error('중복 체크 실패:', error);
      showAlert('중복 체크 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const doCreateArtist = async () => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append('artist_name', newArtist.artist_name);
      formData.append('artist_category', newArtist.artist_category);
      formData.append('artist_nation', newArtist.artist_nation);
      formData.append('artist_homepage', newArtist.artist_homepage);
      formData.append('artist_description', newArtist.artist_description);
      formData.append('gallery_id', selectedGalleryId);
      if (newArtistImage) {
        formData.append('artist_image', newArtistImage);
      }

      const res = await userInstance.post('/api/artists', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      showAlert('작가가 등록되었습니다.');
      const createdArtist = res.data?.data || res.data;
      onSelect(createdArtist);
      onClose();
    } catch (error) {
      console.error('작가 등록 실패:', error);
      showAlert('작가 등록 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDuplicate = (artist) => {
    handleSelectSingle(artist);
  };

  const handleConfirmNewArtist = () => {
    doCreateArtist();
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
            {step === 'search' && (mode === 'global' ? '작가 검색' : '작가 선택')}
            {step === 'create' && '새 작가 등록'}
            {step === 'duplicate' && '동명이인 확인'}
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
                  placeholder="작가 이름 검색"
                  autoFocus
                />
                <button onClick={() => fetchArtists(searchKeyword)} disabled={isLoading}>
                  <FaSearch />
                </button>
              </div>

              <div className={styles.listContainer}>
                {isLoading ? (
                  <div className={styles.emptyState}>검색 중...</div>
                ) : artistList.length > 0 ? (
                  artistList.map((artist) => {
                    const artistId = getArtistId(artist);
                    const isSelected = selectedArtists.some((a) => getArtistId(a) === artistId);
                    return (
                      <div
                        key={artistId}
                        className={`${styles.artistRow} ${isSelected ? styles.selected : ''}`}
                        onClick={() => multiSelect ? toggleSelect(artist) : handleSelectSingle(artist)}
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
                          src={artist.artist_image}
                          alt={artist.artist_name}
                          className={styles.artistImg}
                          wrapperProps={{}}
                        />
                        <div className={styles.artistInfo}>
                          <span className={styles.name}>{artist.artist_name}</span>
                          <span className={styles.category}>
                            {artist.artist_nation || ''} · {artist.artist_category || ''}
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
                    {mode === 'local' ? (
                      <p>등록된 작가가 없습니다.<br/>작가 관리에서 먼저 작가를 등록해주세요.</p>
                    ) : !hasSearched ? (
                      <>
                        <p>작가명을 검색하거나 새로 등록하세요.</p>
                        <button className={styles.addNewBtn} onClick={goToCreate}>
                          <FaPlus /> 새 작가 등록
                        </button>
                      </>
                    ) : (
                      <>
                        <p>"{searchKeyword}" 검색 결과가 없습니다.</p>
                        <button className={styles.addNewBtn} onClick={goToCreate}>
                          <FaPlus /> 새 작가 등록
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* 다중 선택 확인 버튼 */}
              {multiSelect && (
                <div className={styles.footer}>
                  <button className={styles.confirmBtn} onClick={handleConfirmMulti}>
                    선택 완료 ({selectedArtists.length}명)
                  </button>
                </div>
              )}
            </>
          )}

          {/* 신규 등록 (global 모드만) */}
          {step === 'create' && mode === 'global' && (
            <div className={styles.addFormContainer}>
              <div
                className={styles.imageUploadCircle}
                onClick={() => fileInputRef.current.click()}
              >
                {newImagePreview ? (
                  <Img src={newImagePreview} alt="Preview" />
                ) : (
                  <div className={styles.placeholder}>
                    <FaUser />
                    <span>사진</span>
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
                name="artist_name"
                placeholder="작가 이름"
                value={newArtist.artist_name}
                onChange={handleInputChange}
              />

              <input
                className={styles.addInput}
                name="artist_category"
                placeholder="분야 (예: 회화, 조각)"
                value={newArtist.artist_category}
                onChange={handleInputChange}
              />

              <select
                className={styles.addInput}
                name="artist_nation"
                value={newArtist.artist_nation}
                onChange={handleInputChange}
              >
                <option value="">국적 선택</option>
                {NATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <input
                className={styles.addInput}
                name="artist_homepage"
                placeholder="홈페이지 URL"
                value={newArtist.artist_homepage}
                onChange={handleInputChange}
              />

              <div className={styles.formActions}>
                <button className={styles.cancelBtn} onClick={goBackToSearch}>
                  취소
                </button>
                <button
                  className={styles.confirmBtn}
                  onClick={handleCreateArtist}
                  disabled={isLoading}
                >
                  {isLoading ? '등록 중...' : '작가 등록'}
                </button>
              </div>
            </div>
          )}

          {/* 동명이인 확인 (global 모드만) */}
          {step === 'duplicate' && mode === 'global' && (
            <div className={styles.duplicateContainer}>
              <p className={styles.duplicateNotice}>
                "{newArtist.artist_name}" 이름의 작가가 이미 존재합니다.<br />
                아래에서 선택하거나, 동명이인으로 새로 등록하세요.
              </p>

              <div className={styles.listContainer}>
                {duplicateList.map((artist) => (
                  <div key={artist.id} className={styles.artistRow}>
                    <Img
                      src={artist.artist_image}
                      alt={artist.artist_name}
                      className={styles.artistImg}
                      wrapperProps={{}}
                    />
                    <div className={styles.artistInfo}>
                      <span className={styles.name}>{artist.artist_name}</span>
                      <span className={styles.category}>
                        {artist.artist_nation || ''} · {artist.artist_category || ''}
                      </span>
                    </div>
                    <button
                      className={styles.selectBtn}
                      onClick={() => handleSelectDuplicate(artist)}
                      disabled={isLoading}
                    >
                      이 작가 선택
                    </button>
                  </div>
                ))}
              </div>

              <button
                className={styles.createAnywayBtn}
                onClick={handleConfirmNewArtist}
                disabled={isLoading}
              >
                {isLoading ? '등록 중...' : '동명이인입니다 - 새로 등록'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}