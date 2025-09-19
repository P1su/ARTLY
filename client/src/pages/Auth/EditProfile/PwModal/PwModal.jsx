import React, { useState } from 'react';
import styles from './PwModal.module.css';
import { FaTimes } from 'react-icons/fa';

const PwModal = ({ isOpen, onClose, userInfo, onUpdateUserInfo }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
          <div className={styles.modalTitle}>프로필 수정</div>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.passwordSection}>
            <h3 className={styles.sectionTitle}>비밀번호 변경</h3>
            <p className={styles.sectionDescription}>
              개인정보보호를 위해 주기적으로 안전한 <br />새 비밀번호로
              변경해주세요.
            </p>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <input
                  type='password'
                  placeholder='현재 비밀번호'
                  className={styles.input}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <input
                  type='password'
                  placeholder='변경할 비밀번호'
                  className={styles.input}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <button className={styles.submitButton} type='submit'>
                변경 완료
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PwModal;
