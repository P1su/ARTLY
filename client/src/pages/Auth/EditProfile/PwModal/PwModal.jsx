import React, { useState } from 'react';
import styles from './PwModal.module.css';
import { FaTimes } from 'react-icons/fa';
import { userInstance } from '../../../../apis/instance';

const PwModal = ({ isOpen, onClose, userInfo, onUpdateUserInfo }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInfo) {
      return;
    }

    const updatePayload = {
      ...userInfo,
      login_pwd: newPassword,
    };

    try {
      const res = await userInstance.put('/api/users/me', updatePayload);

      alert('비밀번호가 성공적으로 변경되었습니다.');

      onUpdateUserInfo(res.data);
      setCurrentPassword(''); // 입력 필드 빈칸 만들기
      setNewPassword('');
      onClose();
    } catch (error) {
      console.error(error);
      alert('비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.');

      setCurrentPassword('');
      setNewPassword('');
      return;
    }
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
