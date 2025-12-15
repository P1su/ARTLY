import styles from './EditForm.module.css';
import { useEffect, useRef, useState } from 'react';
import TiptapEditor from '../components/TiptapEditor.jsx';
import Img from '../../../components/Img/Img.jsx';

export default function GalleryEditForm({ data, setData, onFileChange }) {
  const [tagInput, setTagInput] = useState('');
  const [isKoreanComposing, setIsKoreanComposing] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (data.gallery_image && typeof data.gallery_image === 'string') {
      setImagePreviewUrl(data.gallery_image);
    }
  }, [data.gallery_image]);

  useEffect(() => {
    if (typeof data.gallery_sns === 'string') {
      try {
        const parsedSns = JSON.parse(data.gallery_sns);
        setData((prev) => ({ ...prev, gallery_sns: parsedSns }));
      } catch (error) {
        console.error('SNS 데이터 파싱 실패:', error);
        setData((prev) => ({ ...prev, gallery_sns: [] }));
      }
    }
  }, [data.gallery_sns, setData]);

  const handleSnsBlur = (type, currentUrl) => {
    if (!currentUrl) return;

    let formattedUrl = currentUrl.trim();

    if (
      !formattedUrl.startsWith('http://') &&
      !formattedUrl.startsWith('https://')
    ) {
      formattedUrl = `https://${formattedUrl}`;
      updateSnsField(type, formattedUrl);
    }
  };

  const handleComposition = (e) => {
    if (e.type === 'compositionstart') {
      setIsKoreanComposing(true);
    }
    if (e.type === 'compositionend') {
      setIsKoreanComposing(false);
    }
  };

  const handleTagKeyDown = (e) => {
    if (isKoreanComposing) return;

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
      setTagInput('');
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

    const currentClosedDays = data.gallery_closed_day
      ? data.gallery_closed_day.split(',').map((d) => d.trim())
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
      gallery_closed_day: newClosedDays.join(', '),
    }));
  };

  const updateSnsField = (type, newUrl) => {
    setData((prev) => {
      let snsList = Array.isArray(prev.gallery_sns)
        ? [...prev.gallery_sns]
        : [];

      const existingIndex = snsList.findIndex((sns) => sns.type === type);

      if (existingIndex !== -1) {
        snsList[existingIndex].url = newUrl;
      } else {
        snsList.push({ type, url: newUrl });
      }

      return { ...prev, gallery_sns: snsList };
    });
  };

  const handleDescriptionChange = (newDescription) => {
    setData((prev) => ({ ...prev, gallery_description: newDescription }));
  };

  const currentTags = data.gallery_category
    ? data.gallery_category.split(',').map((t) => t.trim())
    : [];

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
          name='gallery_eng_name'
          value={data.gallery_eng_name || ''}
          onChange={handleInputChange}
          placeholder='갤러리 영문명'
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
              <Img
                src={imagePreviewUrl}
                alt='갤러리 대표 이미지'
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
              + 대표 이미지를 업로드 해주세요
            </p>
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
              onCompositionStart={handleComposition}
              onCompositionEnd={handleComposition}
              placeholder='태그 추가'
            />
          </div>
        </div>

        <div className={styles.formGrid}>
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
                    checked={data.gallery_closed_day?.includes(day)}
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
          {[
            { type: 'instagram', placeholder: 'Instagram 주소' },
            { type: 'youtube', placeholder: 'YouTube 주소' },
            { type: 'default', placeholder: '기타 주소' },
          ].map(({ type, placeholder }) => {
            const currentValue = Array.isArray(data.gallery_sns)
              ? data.gallery_sns.find((sns) => sns.type === type)?.url || ''
              : '';

            return (
              <input
                key={type}
                className={styles.input}
                placeholder={placeholder}
                value={currentValue}
                onChange={(e) => updateSnsField(type, e.target.value)}
                onBlur={() => handleSnsBlur(type, currentValue)}
              />
            );
          })}
        </div>
      </div>

      <div className={`${styles.card} ${styles.tiptap}`}>
        <label className={styles.label}>정보</label>

        <TiptapEditor
          content={data.gallery_description || ''}
          onChange={handleDescriptionChange}
        />
      </div>
    </>
  );
}
