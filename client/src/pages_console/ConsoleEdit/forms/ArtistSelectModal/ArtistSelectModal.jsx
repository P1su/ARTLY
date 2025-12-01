import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaPlus, FaUser } from 'react-icons/fa';
import { userInstance } from '../../../../apis/instance.js'; // 경로 확인
import styles from './ArtistSelectModal.module.css';

export default function ArtistSelectModal({ onClose, onSelect }) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [artistList, setArtistList] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [newArtistName, setNewArtistName] = useState('');
  const [newArtistImage, setNewArtistImage] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const fetchArtists = async (keyword = '') => {
    try {
      const res = await userInstance.get('/api/artist', {
        params: { search: keyword },
      });
      setArtistList(res.data || []);
    } catch (error) {
      console.error('작가 검색 실패:', error);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      fetchArtists(searchKeyword);
    }
  };

  const handleNewImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewArtistImage(file);
      setNewImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddNewArtist = async () => {
    if (!newArtistName.trim()) {
      alert('작가 이름을 입력해주세요.');
      return;
    }

    try {
      const formData = new FormData();

      // 1. 필수/입력 데이터 추가
      formData.append('artist_name', newArtistName);

      // 2. 이미지가 있다면 추가
      if (newArtistImage) {
        formData.append('artist_image', newArtistImage);
      }

      // 3. 기타 필드 (API 명세에는 있지만 UI에 입력창이 없는 경우)
      // 필요하다면 빈 문자열이나 기본값을 보냅니다.
      formData.append('artist_category', '기타'); // 기본값 예시
      formData.append('artist_nation', '');
      formData.append('artist_description', '');

      // 4. API 호출 (명세서에 따라 /api/artists)
      const response = await userInstance.post('/api/artists', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('작가가 성공적으로 등록되었습니다.');

      // 5. 등록 후 처리: 방금 등록한 작가를 바로 선택 처리
      // 백엔드 응답 구조에 따라 response.data 혹은 response.data.data 사용
      const createdArtist = response.data.data || response.data;

      if (createdArtist && createdArtist.id) {
        onSelect(createdArtist); // 바로 선택하고 모달 닫기
      } else {
        // 만약 응답에 작가 정보가 없다면 목록을 새로고침하고 입력창 닫기
        setIsAddingNew(false);
        setNewArtistName('');
        setNewArtistImage(null);
        setNewImagePreview(null);
        fetchArtists();
      }
    } catch (error) {
      console.error('작가 등록 실패:', error);
      // 에러 메시지 추출 시도
      const errorMsg =
        error.response?.data?.message || '작가 등록 중 오류가 발생했습니다.';
      alert(errorMsg);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>작가 선택</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.searchBar}>
            <input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={handleSearch}
              placeholder='작가 이름 검색'
            />
            <button onClick={() => fetchArtists(searchKeyword)}>
              <FaSearch />
            </button>
          </div>

          {!isAddingNew ? (
            <div className={styles.listContainer}>
              {artistList.length > 0 ? (
                artistList.map((artist) => (
                  <div key={artist.id} className={styles.artistRow}>
                    <img
                      src={artist.artist_image || '/images/default_profile.png'}
                      alt={artist.artist_name}
                      className={styles.artistImg}
                      onError={(e) =>
                        (e.target.src = 'https://via.placeholder.com/50')
                      }
                    />
                    <div className={styles.artistInfo}>
                      <span className={styles.name}>{artist.artist_name}</span>
                      <span className={styles.category}>
                        {artist.artist_category || 'Category'}
                      </span>
                    </div>
                    <button
                      className={styles.selectBtn}
                      onClick={() => onSelect(artist)}
                    >
                      선택
                    </button>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <p>검색 결과가 없습니다.</p>
                  <button
                    className={styles.addNewBtn}
                    onClick={() => setIsAddingNew(true)}
                  >
                    <FaPlus /> 새 작가 등록하기
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.addFormContainer}>
              <p className={styles.addTitle}>새로운 작가 등록</p>

              <div
                className={styles.imageUploadCircle}
                onClick={() => fileInputRef.current.click()}
              >
                {newImagePreview ? (
                  <img src={newImagePreview} alt='Preview' />
                ) : (
                  <div className={styles.placeholder}>
                    <FaUser />
                    <span>사진 등록</span>
                  </div>
                )}
                <input
                  type='file'
                  ref={fileInputRef}
                  onChange={handleNewImageChange}
                  hidden
                />
              </div>

              <input
                className={styles.addInput}
                placeholder='작가 이름 입력'
                value={newArtistName}
                onChange={(e) => setNewArtistName(e.target.value)}
              />

              <div className={styles.formActions}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setIsAddingNew(false)}
                >
                  취소
                </button>
                <button
                  className={styles.confirmBtn}
                  onClick={handleAddNewArtist}
                >
                  작가 추가
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
