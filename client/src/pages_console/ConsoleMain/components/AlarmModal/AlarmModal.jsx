import React, { useState } from 'react';
import { HiX } from 'react-icons/hi';
import styles from './AlarmModal.module.css';
import { useAlert } from '../../../../store/AlertProvider';
import { useConfirm } from '../../../../store/ConfirmProvider';

export default function AlarmModal({
  isOpen,
  onClose,
  selectedUsersCount,
  onSendAlarm,
  isSending = false,
}) {
  const { showConfirm } = useConfirm();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { showAlert } = useAlert();

  const handleClose = () => {
    setTitle('');
    setContent('');
    onClose();
  };

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!title.trim()) {
      showAlert('제목을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      showAlert('알림 내용을 입력해주세요.');
      return;
    }

    if (selectedUsersCount === 0) {
      showAlert('선택된 사용자가 없습니다. 사용자를 선택해주세요.');
      return;
    }

    const isConfirmed = await showConfirm(
      '해당 사용자에게 앱 알림 메시지를 보내시겠습니까?\n바로 발송되며, 취소할 수 없습니다.',
    );

    if (!isConfirmed) return;

    await onSendAlarm(title.trim(), content.trim());

    setTitle('');
    setContent('');
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header Section */}
        <header className={styles.header}>
          <h2 className={styles.title}>알림 보내기</h2>
          <button
            onClick={handleClose}
            className={styles.closeButton}
            aria-label='닫기'
          >
            <HiX size={24} />
          </button>
        </header>

        {/* Body Section */}
        <div className={styles.body}>
          <div className={styles.countBadge}>
            발송 대상 : 총 {selectedUsersCount}명
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>제목</label>
            <input
              type='text'
              className={styles.input}
              placeholder='알림 제목을 입력하세요'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              내용 <span>({content.length}/80자)</span>
            </label>
            <textarea
              className={styles.textarea}
              placeholder='전달하실 내용을 입력하세요'
              maxLength={80}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>

        {/* Footer/Button Section */}
        <div className={styles.buttonContainer}>
          <button
            onClick={handleSend}
            className={styles.sendButton}
            disabled={isSending || selectedUsersCount === 0}
          >
            {isSending ? '발송 중...' : '알림 발송하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
