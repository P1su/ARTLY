import styles from './GalleryEditForm.module.css';
import { useState } from 'react';
import TiptapEditor from '../components/TiptapEditor.jsx';

export default function GalleryEditForm({ data, setData }) {
  const [activeTab, setActiveTab] = useState('info');
  const [tagInput, setTagInput] = useState(''); // 태그 입력을 위한 state

  // --- 태그 관련 핸들러 ---
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      const newTag = tagInput.trim();
      const currentTags = data.gallery_category
        ? data.gallery_category.split(',').map((t) => t.trim())
        : [];
      if (!currentTags.includes(newTag)) {
        const updatedTags = [...currentTags, newTag].join(', ');
        setData((prev) => ({ ...prev, gallery_category: updatedTags }));
      }
      setTagInput(''); // 입력 필드 초기화
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const currentTags = data.gallery_category.split(',').map((t) => t.trim());
    const updatedTags = currentTags
      .filter((tag) => tag !== tagToRemove)
      .join(', ');
    setData((prev) => ({ ...prev, gallery_category: updatedTags }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value: day, checked } = e.target;

    // 현재 휴관일 문자열을 배열로 변환합니다. (null이나 undefined일 경우 빈 배열로 시작)
    const currentClosedDays = data.gallery_closed_day
      ? data.gallery_closed_day.split(',').map((d) => d.trim())
      : [];

    let newClosedDays;
    if (checked) {
      // 체크된 경우, 중복되지 않게 요일을 추가합니다.
      newClosedDays = [...new Set([...currentClosedDays, day])];
    } else {
      // 체크 해제된 경우, 해당 요일을 배열에서 제거합니다.
      newClosedDays = currentClosedDays.filter((d) => d !== day);
    }

    // 요일 순서에 맞게 정렬합니다 (선택 사항).
    const daysOrder = ['월', '화', '수', '목', '금', '토', '일'];
    newClosedDays.sort((a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b));

    // 배열을 다시 쉼표로 구분된 문자열로 합쳐 상태를 업데이트합니다.
    setData((prev) => ({
      ...prev,
      gallery_closed_day: newClosedDays.join(','),
    }));
  };

  const handleDescriptionChange = (newDescription) => {
    setData((prev) => ({ ...prev, gallery_description: newDescription }));
  };

  // 시간 데이터 파싱 (예: "10:00:00" -> { hour: "10", minute: "00" })
  const parseTime = (timeStr) => {
    if (!timeStr) return { hour: '00', minute: '00' };
    const [hour, minute] = timeStr.split(':');
    return { hour, minute };
  };

  const currentTags = data.gallery_category
    ? data.gallery_category.split(',').map((t) => t.trim())
    : [];
  const startTime = parseTime(data.gallery_start_time);
  const endTime = parseTime(data.gallery_end_time);
  const daysOfWeek = ['월', '화', '수', '목', '금', '토', '일'];

  return (
    <>
      <div className={styles.card}>
        <input
          className={`${styles.input} ${styles.galleryNameInput}`}
          name='gallery_name'
          value={data.gallery_name || ''}
          onChange={handleInputChange}
          placeholder='갤러리 국문명'
        />
        <input
          className={`${styles.input} ${styles.gallerySubNameInput}`}
          name='gallery_name_en' // 영문 이름 필드명
          value={data.gallery_name_en || ''}
          onChange={handleInputChange}
          placeholder='갤러리 영문명 (선택)'
        />
        <div className={styles.imageUploadBox}>
          {data.gallery_image ? (
            <img
              src={data.gallery_image}
              alt='갤러리 대표 이미지'
              className={styles.previewImage}
            />
          ) : (
            <p>+ 대표 이미지를 업로드 해주세요</p>
          )}
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>태그</label>
          <div className={styles.tagInputContainer}>
            {currentTags.map((tag) => (
              <div key={tag} className={styles.tagItem}>
                {tag}
                <button
                  type='button'
                  className={styles.removeTagBtn}
                  onClick={() => handleRemoveTag(tag)}
                >
                  ×
                </button>
              </div>
            ))}
            <input
              type='text'
              className={styles.tagInputField}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder='태그 추가'
            />
          </div>
        </div>

        <div className={styles.formGrid}>
          {/* --- 관람 시간 입력 UI --- */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>관람시간</label>
            <div className={styles.timeInputContainer}>
              <input
                type='time'
                className={styles.timeInput}
                name='gallery_start_time'
                value={data.gallery_start_time?.slice(0, 5) || ''}
                onChange={handleInputChange}
              />
              <span>~</span>
              <input
                type='time'
                className={styles.timeInput}
                name='gallery_end_time'
                value={data.gallery_end_time?.slice(0, 5) || ''}
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
                    // gallery_closed_day 문자열에 해당 요일이 포함되어 있는지 확인
                    checked={data.gallery_closed_day[0]?.includes(day)}
                    onChange={handleCheckboxChange}
                  />{' '}
                  {day}
                </label>
              ))}
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>전화번호</label>
            <input
              className={styles.input}
              name='gallery_phone'
              value={data.gallery_phone || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>주소</label>
            <input
              className={styles.input}
              name='gallery_address'
              value={data.gallery_address || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>이메일</label>
            <input
              className={styles.input}
              type='email'
              name='gallery_email'
              value={data.gallery_email || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>홈페이지</label>
            <input
              className={styles.input}
              type='url'
              name='gallery_homepage'
              value={data.gallery_homepage || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <div className={`${styles.card} ${styles.snsCard}`}>
        <label className={styles.label}>SNS</label>
        <div className={styles.snsInputGroup}>
          <input
            className={styles.input}
            placeholder='Instagram 주소'
            name='sns_instagram'
            value={data.sns_instagram || ''}
            onChange={handleInputChange}
          />
          <input
            className={styles.input}
            placeholder='Twitter 주소'
            name='sns_twitter'
            value={data.sns_twitter || ''}
            onChange={handleInputChange}
          />
          <input
            className={styles.input}
            placeholder='Facebook 주소'
            name='sns_facebook'
            value={data.sns_facebook || ''}
            onChange={handleInputChange}
          />
          <input
            className={styles.input}
            placeholder='YouTube 주소'
            name='sns_youtube'
            value={data.sns_youtube || ''}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className={styles.tabContainer}>
        <nav className={styles.tabNav}>
          <button
            className={`${styles.tabButton} ${activeTab === 'info' && styles.activeTab}`}
            onClick={() => setActiveTab('info')}
          >
            소개
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'exhibitions' && styles.activeTab}`}
            onClick={() => setActiveTab('exhibitions')}
          >
            전시({data.exhibitions?.length || 0})
          </button>
        </nav>
        <div className={styles.tabContent}>
          {activeTab === 'info' && (
            <TiptapEditor
              content={data.gallery_description || ''}
              onChange={handleDescriptionChange}
            />
          )}
          {activeTab === 'exhibitions' && (
            <div className={styles.emptyContent}>
              전시 목록을 관리하는 UI가 표시됩니다.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
