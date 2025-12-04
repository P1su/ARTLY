import React, { useState, useEffect } from 'react';
import styles from './PwModal.module.css';
import { FaTimes } from 'react-icons/fa';
import { userInstance } from '../../../../apis/instance';
import AlertModal from '../../../../components/AlertModal/AlertModal'; 

const PwModal = ({ isOpen, onClose, userInfo, onUpdateUserInfo }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentPassword('');
      setNewPassword('');
      setErrorMessage('');
      setIsAlertOpen(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!userInfo) return;
    
    if (!currentPassword || !newPassword) {
      setErrorMessage('모든 항목을 입력해주세요.');
      return;
    }
    
    if (currentPassword === newPassword) {
      setErrorMessage('현재 비밀번호와 다른 새로운 비밀번호를 입력해주세요.');
      return;
    }

    const updatePayload = {
      ...userInfo, 
      login_pwd: newPassword,
    };

    try {
      const res = await userInstance.put('/api/users/me', updatePayload);

      onUpdateUserInfo(res.data); 
      setIsAlertOpen(true);

    } catch (error) {
      console.error(error);
      setErrorMessage('비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.');
    }
  };

  const handleAlertClose = () => {
    setIsAlertOpen(false);
    onClose(); 
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
                  className={`${styles.input} ${errorMessage ? styles.inputError : ''}`}
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <input
                  type='password'
                  placeholder='새 비밀번호'
                  className={`${styles.input} ${errorMessage ? styles.inputError : ''}`}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  required
                />
              </div>

              {errorMessage && (
                <div className={styles.errorMessage}>
                  {errorMessage}
                </div>
              )}

              <button className={styles.submitButton} type='submit'>
                변경 완료
              </button>
            </form>
          </div>
        </div>
      </div>
      <AlertModal 
        isOpen={isAlertOpen} 
        message="비밀번호가 성공적으로 변경되었습니다." 
        onClose={handleAlertClose} 
      />
    </div>
  );
};

export default PwModal;