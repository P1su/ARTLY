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
    alert('구현 예정입니다.');
    // const formData = new FormData();
    // formData.append('artist_name', newArtistName);
    // // 필요한 경우 카테고리 등 추가 (API 명세에 따라 수정)
    // // formData.append('artist_category', 'Painting');

    // if (newArtistImage) {
    //   formData.append('artist_image_file', newArtistImage);
    // }

    // try {
    //   // [수정] 등록도 마찬가지로 /api/artist (단수형)
    //   const res = await userInstance.post('/api/artists', formData, {
    //     headers: { 'Content-Type': 'multipart/form-data' },
    //   });

    //   alert('작가가 등록되었습니다.');

    //   // 등록 성공 후, 응답 데이터 구조 확인하여 선택 처리
    //   // 보통 res.data에 등록된 작가 객체가 옴
    //   const newArtist = res.data;

    //   // 안전장치: 만약 res.data가 아니라면 목록을 다시 불러와서 이름으로 찾기
    //   if (!newArtist || !newArtist.id) {
    //     fetchArtists(newArtistName);
    //     setIsAddingNew(false);
    //     return;
    //   }

    //   onSelect(newArtist);
    // } catch (error) {
    //   console.error('작가 등록 실패:', error);
    //   alert('작가 등록에 실패했습니다.');
    // }
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
