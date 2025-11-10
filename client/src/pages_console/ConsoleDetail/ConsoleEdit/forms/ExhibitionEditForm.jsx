import styles from './EditForm.module.css';
import { useEffect, useRef, useState } from 'react';
import TiptapEditor from '../components/TiptapEditor.jsx';
import GalleryArtworks from '../../components/GalleryArtworks/GalleryArtworks.jsx';

export default function ExhibitionEditForm({ data, setData, onFileChange }) {
  const [activeTab, setActiveTab] = useState('info');
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  console.log(data);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (newDescription) => {
    setData((prev) => ({ ...prev, exhibition_description: newDescription }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileChange(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
    }
    e.target.value = '';
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

  useEffect(() => {
    if (data.exhibition_poster && typeof data.exhibition_poster === 'string') {
      setImagePreviewUrl(data.exhibition_poster);
    }
  }, [data.exhibition_poster]);

  return (
    <>
      <div className={styles.card}>
        {/* 전시명 */}
        <input
          className={`${styles.input} ${styles.galleryNameInput}`}
          name='exhibition_title'
          value={data.exhibition_title || ''}
          onChange={handleInputChange}
          placeholder='전시회 제목'
        />

        {/* 대표 포스터 이미지 */}
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
            <img
              src={imagePreviewUrl}
              alt='전시 포스터'
              className={styles.previewImage}
            />
          ) : (
            <p className={styles.previewImageDesc}>
              + 전시 포스터 이미지를 업로드 해주세요
            </p>
          )}
        </div>

        {/* 전시 필드 영역 */}
        <div className={styles.formGrid}>
          {/* 전시 기간 */}
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

          {/* 전시장소 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>전시장소</label>
            <input
              className={styles.input}
              name='exhibition_location'
              value={data.exhibition_location || ''}
              onChange={handleInputChange}
            />
          </div>

          {/* 관람시간 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>관람시간</label>
            <div className={styles.timeInputContainer}>
              <input
                type='time'
                className={styles.timeInput}
                name='exhibition_start_time'
                value={
                  data.exhibition_start_time
                    ? data.exhibition_start_time.slice(11, 16)
                    : ''
                }
                onChange={handleInputChange}
              />
              <span>~</span>
              <input
                type='time'
                className={styles.timeInput}
                name='exhibition_end_time'
                value={
                  data.exhibition_end_time
                    ? data.exhibition_end_time.slice(11, 16)
                    : ''
                }
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* 휴관일 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>휴관일</label>
            <div className={styles.checkboxGroup}>
              {daysOfWeek.map((day) => (
                <label key={day}>
                  <input
                    type='checkbox'
                    value={day}
                    checked={data.exhibition_closed_day?.includes(day)}
                    onChange={handleCheckboxChange}
                  />{' '}
                  {day}
                </label>
              ))}
            </div>
          </div>

          {/* 입장료 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>입장료</label>
            <div className={styles.priceInputContainer}>
              <input
                type='number'
                className={styles.input}
                name='exhibition_price'
                value={data.exhibition_price || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* 전화번호 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>전화번호</label>
            <input
              className={styles.input}
              name='exhibition_phone'
              value={data.exhibition_phone || ''}
              onChange={handleInputChange}
            />
          </div>

          {/* 주소 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>주소</label>
            <input
              className={styles.input}
              name='exhibition_address'
              value={data.exhibition_address || ''}
              onChange={handleInputChange}
            />
          </div>

          {/* 작가 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>작가</label>
            <input
              className={styles.input}
              name='exhibition_artist'
              value={data.exhibition_artist || ''}
              onChange={handleInputChange}
            />
          </div>

          {/* 홈페이지 */}
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

      {/* 탭 (소개) */}
      <div className={styles.tabContainer}>
        <nav className={styles.tabNav}>
          <button
            className={`${styles.tabButton} ${
              activeTab === 'info' && styles.activeTab
            }`}
            onClick={() => setActiveTab('info')}
          >
            소개
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'artworks' && styles.activeTab}`}
            onClick={() => setActiveTab('artworks')}
          >
            작품({data.artworks?.length || 0})
          </button>
        </nav>

        <div className={styles.tabContent}>
          {activeTab === 'info' && (
            <TiptapEditor
              content={data.exhibition_description || ''}
              onChange={handleDescriptionChange}
            />
          )}
          {activeTab === 'artworks' &&
            (data.exhibitions?.length > 0 ? (
              <GalleryArtworks artworks={data.artworks} />
            ) : (
              <p className={styles.emptyContent}>
                현재 전시된 작품이 없습니다.
              </p>
            ))}
        </div>
      </div>
    </>
  );
}
