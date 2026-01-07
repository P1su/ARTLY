import styles from './EditForm.module.css';
import { useEffect, useRef, useState } from 'react';
import TiptapEditor from '../components/TiptapEditor.jsx';
import Img from '../../../components/Img/Img.jsx';

// API 스펙에 맞는 카테고리
const CATEGORY_OPTIONS = [
  '공모',
  '프로그램',
  '채용',
];

export default function AnnouncementEditForm({ data, setData, onFileChange }) {
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (data.announcement_poster && typeof data.announcement_poster === 'string') {
      setImagePreviewUrl(data.announcement_poster);
    }
  }, [data.announcement_poster]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (newContent) => {
    setData((prev) => ({ ...prev, announcement_content: newContent }));
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

  const handleUrlBlur = (fieldName, currentUrl) => {
    if (!currentUrl) return;
    let formattedUrl = currentUrl.trim();
    if (
      !formattedUrl.startsWith('http://') &&
      !formattedUrl.startsWith('https://')
    ) {
      formattedUrl = `https://${formattedUrl}`;
      setData((prev) => ({ ...prev, [fieldName]: formattedUrl }));
    }
  };

  return (
    <>
      <div className={styles.card}>
        <input
          className={`${styles.input} ${styles.galleryNameInput}`}
          name='announcement_title'
          value={data.announcement_title || ''}
          onChange={handleInputChange}
          placeholder='공고 제목'
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
                alt='공고 포스터 이미지'
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
              + 포스터 이미지를 업로드 해주세요
            </p>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>카테고리</label>
          <select
            className={styles.input}
            name='announcement_category'
            value={data.announcement_category || ''}
            onChange={handleInputChange}
          >
            <option value=''>카테고리 선택</option>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>공고 기간</label>
          <div className={styles.timeInputContainer}>
            <input
              type='date'
              className={styles.timeInput}
              name='announcement_start_datetime'
              value={data.announcement_start_datetime?.split(' ')[0]?.split('T')[0] || ''}
              onChange={handleInputChange}
            />
            <span>~</span>
            <input
              type='date'
              className={styles.timeInput}
              name='announcement_end_datetime'
              value={data.announcement_end_datetime?.split(' ')[0]?.split('T')[0] || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>주최 기관</label>
          <input
            className={styles.input}
            name='announcement_organizer'
            value={data.announcement_organizer || ''}
            onChange={handleInputChange}
            placeholder='주최 기관명'
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>문의처</label>
          <input
            className={styles.input}
            name='announcement_contact'
            value={data.announcement_contact || ''}
            onChange={handleInputChange}
            placeholder='연락처 또는 이메일'
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>관련 사이트</label>
          <input
            className={styles.input}
            type='url'
            name='announcement_site_url'
            value={data.announcement_site_url || ''}
            onChange={handleInputChange}
            onBlur={() => handleUrlBlur('announcement_site_url', data.announcement_site_url)}
            placeholder='https://example.com'
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>첨부파일 URL</label>
          <input
            className={styles.input}
            type='url'
            name='announcement_attachment_url'
            value={data.announcement_attachment_url || ''}
            onChange={handleInputChange}
            onBlur={() => handleUrlBlur('announcement_attachment_url', data.announcement_attachment_url)}
            placeholder='첨부파일 다운로드 링크'
          />
        </div>
      </div>

      <div className={`${styles.card} ${styles.tiptap}`}>
        <label className={styles.label}>상세 내용</label>
        <TiptapEditor
          content={data.announcement_content || ''}
          onChange={handleContentChange}
        />
      </div>
    </>
  );
}