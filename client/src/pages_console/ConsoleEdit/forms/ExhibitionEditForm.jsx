import styles from './EditForm.module.css';
import { useEffect, useRef, useState } from 'react';
import TiptapEditor from '../components/TiptapEditor.jsx';
import ArtistSelectModal from '../components/ArtistSelectModal/ArtistSelectModal.jsx';
import ArtworkSelectModal from '../components/ArtworkSelectModal/ArtworkSelectModal.jsx';
import Img from '../../../components/Img/Img.jsx';
import { useAlert } from '../../../store/AlertProvider.jsx';

const getArtistId = (artist) => artist.id || artist.artist_id;
const getArtistImage = (artist) => artist.artist_image || artist.profile_img;
const getArtistName = (artist) =>
  artist.artist_name ||
  artist.name ||
  artist.artist?.artist_name ||
  '이름 없음';

const getArtImage = (art) => {
  return art.image_url || art.art_image || '/images/no-image.png';
};

const getArtTitle = (art) => {
  return art.title || art.art_title || '제목 없음';
};

const getArtistNameForArt = (art) => {
  return art.artist_name || art.artist?.artist_name || '작가 미상';
};

export default function ExhibitionEditForm({ data, setData, onFileChange }) {
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [showArtistModal, setShowArtistModal] = useState(false);
  const [showArtworkModal, setShowArtworkModal] = useState(false);
  const { showAlert } = useAlert();

  useEffect(() => {
    if (data.exhibition_poster && typeof data.exhibition_poster === 'string') {
      setImagePreviewUrl(data.exhibition_poster);
    }
  }, [data.exhibition_poster]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (html) => {
    setData((prev) => ({ ...prev, exhibition_description: html }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileChange(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
    }
    event.target.value = '';
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImagePreviewUrl(null);
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectArtist = (artist) => {
    const currentArtists = data.artists || [];

    if (currentArtists.some((a) => getArtistId(a) === getArtistId(artist))) {
      showAlert('이미 추가된 작가입니다.');
      return;
    }

    const newArtist = {
      id: getArtistId(artist),
      name: getArtistName(artist),
      artist_image: getArtistImage(artist),
    };

    setData((prev) => ({
      ...prev,
      artists: [...currentArtists, newArtist],
    }));
    setShowArtistModal(false);
  };

  const handleRemoveArtist = (targetId) => {
    const updatedArtists = (data.artists || []).filter(
      (artist) => getArtistId(artist) !== targetId,
    );
    setData((prev) => ({ ...prev, artists: updatedArtists }));
  };

  const handleSelectArtworks = (selectedList) => {
    setData((prev) => ({
      ...prev,
      artworks: selectedList,
    }));
  };

  const handleRemoveArtwork = (targetId) => {
    const updatedArtworks = (data.artworks || []).filter(
      (art) => (art.id || art.art_id) !== targetId,
    );
    setData((prev) => ({ ...prev, artworks: updatedArtworks }));
  };

  const daysOfWeek = [
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
    '일요일',
  ];

  const handleCheckboxChange = (e) => {
    const { value: day, checked } = e.target;

    const currentClosedDays = data.exhibition_closed_day
      ? data.exhibition_closed_day.split(',').map((d) => d.trim())
      : [];

    let newClosedDays;
    if (checked) {
      newClosedDays = [...new Set([...currentClosedDays, day])];
    } else {
      newClosedDays = currentClosedDays.filter((d) => d !== day);
    }

    const daysOrder = daysOfWeek;
    newClosedDays.sort((a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b));

    setData((prev) => ({
      ...prev,
      exhibition_closed_day: newClosedDays.join(', '),
    }));
  };

  return (
    <>
      <div className={styles.card}>
        <input
          className={`${styles.input} ${styles.galleryNameInput}`}
          name='exhibition_title'
          value={data.exhibition_title || ''}
          onChange={handleInputChange}
          placeholder='전시회 제목'
        />

        <input
          type='file'
          ref={fileInputRef}
          onChange={handleImageChange}
          accept='image/*'
          style={{ display: 'none' }}
        />

        <div
          className={styles.imageUploadBox}
          onClick={() => fileInputRef.current.click()}
        >
          {imagePreviewUrl ? (
            <>
              <img
                src={imagePreviewUrl}
                alt='전시 포스터 미리보기'
                className={styles.previewImage}
              />
              <button
                type='button'
                onClick={handleRemoveImage}
                className={styles.imageDelBtn}
                title='이미지 삭제'
              >
                ✕
              </button>
            </>
          ) : (
            <p className={styles.previewImageDesc}>
              + 전시 포스터를 업로드 해주세요
            </p>
          )}
        </div>

        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>전시기간</label>
            <div className={styles.timeInputContainer}>
              <input
                type='date'
                className={styles.timeInput}
                name='exhibition_start_date'
                value={data.exhibition_start_date || ''}
                onChange={handleInputChange}
              />
              <span>~</span>
              <input
                type='date'
                className={styles.timeInput}
                name='exhibition_end_date'
                value={data.exhibition_end_date || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>관람시간</label>
            <div className={styles.timeInputContainer}>
              <input
                type='time'
                className={styles.timeInput}
                name='exhibition_start_time'
                value={data.exhibition_start_time?.slice(0, 5) || ''}
                onChange={handleInputChange}
              />
              <span>~</span>
              <input
                type='time'
                className={styles.timeInput}
                name='exhibition_end_time'
                value={data.exhibition_end_time?.slice(0, 5) || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>휴관일</label>
            <div className={styles.checkboxGroup}>
              {daysOfWeek.map((day) => (
                <label key={day}>
                  <input
                    type='checkbox'
                    name='closedDays'
                    value={day}
                    checked={data.exhibition_closed_day?.includes(day)}
                    onChange={handleCheckboxChange}
                  />{' '}
                  {day}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>전시장소</label>
            <input
              className={styles.input}
              name='exhibition_organization'
              value={data.exhibition_organization || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>주소</label>
            <input
              className={styles.input}
              name='exhibition_location'
              value={data.exhibition_location || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>입장료</label>
            <input
              className={styles.input}
              name='exhibition_price'
              value={data.exhibition_price || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>전화번호</label>
            <input
              className={styles.input}
              name='exhibition_phone'
              value={data.exhibition_phone || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>홈페이지</label>
            <input
              className={styles.input}
              type='url'
              name='exhibition_homepage'
              value={data.exhibition_homepage || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <div className={styles.addHeaderContainer}>
              <label className={styles.label}>참여 작가</label>
              <button
                type='button'
                className={styles.addBtn}
                onClick={() => setShowArtistModal(true)}
              >
                + 작가 검색/추가
              </button>
            </div>
            <div className={styles.artistListContainer}>
              <div className={styles.artistList}>
                {!data.artists || data.artists.length === 0 ? (
                  <p className={styles.emptyText}>등록된 작가 없음</p>
                ) : (
                  data.artists.map((artist, index) => {
                    const id = getArtistId(artist);
                    const name = getArtistName(artist);
                    return (
                      <div key={id || index} className={styles.artworkCard}>
                        <Img
                          src={getArtistImage(artist)}
                          alt='thumb'
                          className={styles.artistThumb}
                        />
                        <span className={styles.artistName}>{name}</span>

                        <button
                          type='button'
                          className={styles.removeBtn}
                          onClick={() => handleRemoveArtist(id)}
                          title='삭제'
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className={`${styles.inputGroup} ${styles.artworkSection}`}>
            <div className={styles.addHeaderContainer}>
              <label className={styles.label}>전시 작품</label>
              <button
                type='button'
                className={styles.addBtn}
                onClick={() => setShowArtworkModal(true)}
              >
                + 작품 불러오기
              </button>
            </div>
            <div className={styles.artistListContainer}>
              <div className={styles.artworkGrid}>
                {!data.artworks || data.artworks.length === 0 ? (
                  <p className={styles.emptyText}>등록된 작품 없음</p>
                ) : (
                  data.artworks.map((art) => (
                    <div key={art.id} className={styles.artworkCard}>
                      <Img
                        src={getArtImage(art)}
                        alt='thumb'
                        className={styles.artworkThumb}
                      />
                      <div className={styles.artworkMeta}>
                        <div className={styles.artworkTitle}>
                          {getArtTitle(art)}
                        </div>
                        <div className={styles.artworkArtist}>
                          {getArtistNameForArt(art) || '작가 미상'}
                        </div>
                      </div>
                      <button
                        type='button'
                        className={styles.removeBtn}
                        onClick={() => handleRemoveArtwork(art.id)}
                        title='삭제'
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.card} ${styles.tiptap}`}>
        <label className={styles.label}>전시 소개</label>
        <TiptapEditor
          content={data.exhibition_description || ''}
          onChange={handleDescriptionChange}
        />
      </div>

      {showArtistModal && (
        <ArtistSelectModal
          onClose={() => setShowArtistModal(false)}
          onSelect={handleSelectArtist}
        />
      )}

      {showArtworkModal && (
        <ArtworkSelectModal
          onClose={() => setShowArtworkModal(false)}
          onSelect={handleSelectArtworks}
          existingArtworks={data.artworks || []}
        />
      )}
    </>
  );
}
