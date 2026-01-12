import { useMemo, useState } from 'react';
import { userInstance } from '../../apis/instance';
import styles from './AnnouncementModal.module.css';
import { BsPin, BsPinFill } from 'react-icons/bs';

function formatDateTimeForApi(date) {
  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mi = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

export default function AnnouncementModal({ item, onClose, onSuccess }) {
  const isEdit = !!item;

  const [category, setCategory] = useState(item?.announcement_category || '공지사항');
  const [title, setTitle] = useState(item?.announcement_title || '');
  const [content, setContent] = useState(item?.announcement_content || '');
  const [pinned, setPinned] = useState(Number(item?.announcement_pinned) === 1);

  const startDt = useMemo(() => formatDateTimeForApi(new Date()), []);
  const endDt = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return formatDateTimeForApi(d);
  }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      return alert('제목과 내용을 입력해주세요.');
    }

    try {
      if (isEdit) {
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('announcement_title', title.trim());
        formData.append('announcement_content', content.trim());
        formData.append('announcement_category', category);
        formData.append('announcement_pinned', pinned ? '1' : '0');
        formData.append('announcement_start_datetime', startDt);
        formData.append('announcement_end_datetime', endDt);

        await userInstance.post(`/api/announcements/${item.id}`, formData);
      } else {
        await userInstance.post('/api/announcements', {
          announcement_title: title.trim(),
          announcement_content: content.trim(),
          announcement_category: category,
          announcement_pinned: pinned ? 1 : 0,
          announcement_start_datetime: startDt,
          announcement_end_datetime: endDt,
        });
      }

      onSuccess?.();
    } catch (e) {
      console.error('❌ 에러:', e.response?.data || e);
      alert('저장 실패');
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{isEdit ? '공지 수정' : '새 공지 작성'}</h2>
          <button
            type="button"
            className={`${styles.pinBtn} ${pinned ? styles.pinActive : ''}`}
            onClick={() => setPinned(!pinned)}
            title={pinned ? '고정 해제' : '상단 고정'}
          >
            {pinned ? <BsPinFill size={20} /> : <BsPin size={20} />}
          </button>
        </div>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="공지사항">공지사항</option>
          <option value="FAQ">FAQ</option>
        </select>

        <input
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className={styles.buttons}>
          <button onClick={handleSubmit}>{isEdit ? '수정' : '등록'}</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}