import React, { useState } from 'react';
import { HiX } from 'react-icons/hi';
import styles from './AlarmModal.module.css';

export default function AlarmModal({ 
  isOpen, 
  onClose, 
  selectedUsersCount, 
  onSendAlarm 
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleClose = () => {
    setTitle('');
    setContent('');
    onClose();
  };

  if (!isOpen) return null;

  const handleSend = () => {
    // 제목 입력 확인
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    // 내용 입력 확인
    if (!content.trim()) {
      alert('알림 내용을 입력해주세요.');
      return;
    }

    // 유저 선택 확인
    if (selectedUsersCount === 0) {
      alert('선택된 사용자가 없습니다. 사용자를 선택해주세요.');
      return;
    }

    // 최종 확인 팝업
    if (window.confirm(`해당 사용자에게 앱 알림 메시지를 보내시겠습니까? 바로 발송되며, 취소할 수 없습니다.`)) {
      onSendAlarm();
      setTitle('');
      setContent('');
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <button onClick={handleClose} className={styles.closeButton}>
            <HiX size={24} />
          </button>
          <h2 className={styles.title}>알림 보내기</h2>
          <div className={styles.headerSpacer} />
        </header>

        <div className={styles.countBadge}>
          <span>발송 예정 : 총 {selectedUsersCount}명</span>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>제목</label>
          <input 
            type="text" 
            className={styles.input}
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>알림내용 (최대 80자)</label>
          <textarea 
            className={styles.textarea}
            placeholder="알림 내용을 입력하세요"
            maxLength={80}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className={styles.buttonContainer}>
          <button 
            onClick={handleSend}
            className={styles.sendButton}
          >
            발송
          </button>
        </div>
      </div>
    </div>
  );
}
