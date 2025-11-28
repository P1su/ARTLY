import styles from './EditForm.module.css';
import { useEffect, useRef, useState } from 'react';
import TiptapEditor from '../components/TiptapEditor.jsx';

export default function ExhibitionEditForm({ data, setData, onFileChange }) {
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [artistInput, setArtistInput] = useState('');

  useEffect(() => {
    if (Array.isArray(data.artists)) {
      setArtistInput(data.artists.join(', '));
    } else if (typeof data.artists === 'string') {
      setArtistInput(data.artists);
    }
  }, [data.artists]);

  useEffect(() => {
    if (data.exhibition_poster && typeof data.exhibition_poster === 'string') {
      setImagePreviewUrl(data.exhibition_poster);
    }
  }, [data.exhibition_poster]);

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImagePreviewUrl(null);
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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

  const handleArtistChange = (e) => {
    setArtistInput(e.target.value);
  };

  const handleArtistBlur = () => {
    const artistArray = artistInput
      .split(',')
      .map((name) => name.trim())
      .filter((name) => name !== '');

    setData((prev) => ({ ...prev, artists: artistArray }));
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
            <label className={styles.label}>참여 작가 (쉼표로 구분)</label>
            <input
              className={styles.input}
              name='artists'
              value={artistInput} // data.artists 대신 artistInput 사용
              onChange={handleArtistChange} // 입력 핸들러 교체
              onBlur={handleArtistBlur} // 저장 핸들러 추가
              placeholder='예: 홍길동, 김철수, 이영희'
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
        </div>
      </div>

      <div className={`${styles.card} ${styles.tiptap}`}>
        <label className={styles.label}>전시 소개</label>
        <TiptapEditor
          content={data.exhibition_description || ''}
          onChange={handleDescriptionChange}
        />
      </div>
    </>
  );
}
