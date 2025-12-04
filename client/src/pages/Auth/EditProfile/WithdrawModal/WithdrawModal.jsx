import React, { useState } from 'react';
import styles from './WithdrawModal.module.css';
import { FaTimes } from 'react-icons/fa';
import { userInstance } from '../../../../apis/instance';

const WithdrawModal = ({ isOpen, onClose, userInfo, onWithdrawSuccess }) => {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // 요청 시작 전 에러 초기화

    if (!userInfo) return;
    
    if (!password) {
      setErrorMessage('비밀번호를 입력해주세요.');
      return;
    }

    try {
      await userInstance.delete('/api/auth/withdraw', {
        data: {
          login_id: userInfo.login_id,
          login_pwd: password,
        },
      });
      onWithdrawSuccess(); 
      
      setPassword('');
      setErrorMessage('');
      onClose();

    } catch (error) {
      console.error(error);
      
      if (error.response && error.response.status === 400) {
        setErrorMessage('비밀번호가 일치하지 않습니다.');
      } else {
        setErrorMessage('탈퇴 처리에 실패했습니다. 비밀번호를 다시 입력해주세요.');
      }
    }
  };

  const handleClose = () => {
    setErrorMessage('');
    setPassword('');
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <button className={styles.closeButton} onClick={handleClose}>
            <FaTimes />
          </button>
          <div className={styles.modalTitle}>회원 탈퇴</div>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.withdrawSection}>
            <h3 className={styles.sectionTitle}>정말 탈퇴하시겠습니까?</h3>
            <p className={styles.sectionDescription}>
              안전한 탈퇴를 위해 비밀번호를 입력해주세요.<br />
              탈퇴 하실 경우, 회원님의 모든 정보가 사라집니다.<br />
            </p>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <input
                  type='password'
                  placeholder='비밀번호 입력'
                  className={`${styles.input} ${errorMessage ? styles.inputError : ''}`} 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(''); // 타이핑 시작하면 에러 지움
                  }}
                  autoComplete="off"
                />
              </div>
              
              {errorMessage && (
                <div className={styles.errorMessage}>
                  {errorMessage}
                </div>
              )}
              
              <button className={styles.withdrawButton} type='submit'>
                탈퇴하기
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;