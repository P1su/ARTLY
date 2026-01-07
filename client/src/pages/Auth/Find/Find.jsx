import styles from './Find.module.css';
import InputText from '../../../components/Input/InputText/InputText';
import useInput from '../../../hooks/useInput';
import { useAlert } from '../../../store/AlertProvider';
import { instance } from '../../../apis/instance.js';
import { useState } from 'react';

export default function Find() {
  const { data: idDatas, handleChange: handleLoginChange } = useInput({
    user_name: '',
    user_email: '',
  });
  const { data: passwordDatas, handleChange: handlePasswordChange } = useInput({
    login_id: '',
    user_email: '',
    new_password: '',
  });

  const [foundId, setFoundId] = useState(null);
  const [isVerified, setIsVerified] = useState(false);  // 사용자 확인 여부

  const { showAlert } = useAlert();

  // 아이디 찾기
  const handleFindId = async (e) => {
    e.preventDefault();

    try {
      const response = await instance.post('/api/auth/find-id', {
        user_name: idDatas.user_name,
        user_email: idDatas.user_email,
      });

      setFoundId(response.data.login_id);
      showAlert(`아이디: ${response.data.login_id}`);
    } catch (error) {
      if (error.response?.status === 404) {
        showAlert('일치하는 사용자를 찾을 수 없습니다.');
      } else {
        showAlert('오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  // 비밀번호 찾기 1단계: 사용자 확인
  const handleVerifyUser = async (e) => {
    e.preventDefault();

    try {
      const response = await instance.post('/api/auth/verify-user', {
        login_id: passwordDatas.login_id,  // 임시로 아이디를 이름처럼 사용
        user_email: passwordDatas.user_email,
      });

      // 사용자 확인 성공 → 새 비밀번호 입력 UI 표시
      setIsVerified(true);
      showAlert('사용자 확인 완료. 새 비밀번호를 입력해주세요.');
    } catch (error) {
      if (error.response?.status === 404) {
        showAlert('아이디와 이메일이 일치하는 사용자를 찾을 수 없습니다.');
      } else {
        showAlert('오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  // 비밀번호 찾기 2단계: 비밀번호 변경
  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await instance.post('/api/auth/reset-password', {
        login_id: passwordDatas.login_id,
        user_email: passwordDatas.user_email,
        new_password: passwordDatas.new_password,
      });

      showAlert('비밀번호가 성공적으로 변경되었습니다.');
      setIsVerified(false);
    } catch (error) {
      showAlert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className={styles.layout}>
      {/* 아이디 찾기 */}
      <form className={styles.findForm} onSubmit={handleFindId}>
        <h2 className={styles.formTitle}>아이디 찾기</h2>
        <InputText
          name='user_name'
          placeholder='이름'
          onChange={handleLoginChange}
          value={idDatas.user_name}
        />
        <InputText
          name='user_email'
          placeholder='@를 포함한 전체 이메일 주소를 입력해주세요'
          onChange={handleLoginChange}
          value={idDatas.user_email}
        />
        <button type='submit' className={styles.submitButton}>아이디 찾기</button>
        
        {foundId && (
          <p className={styles.resultText}>찾은 아이디: {foundId}</p>
        )}
      </form>

      {/* 비밀번호 재설정 */}
      <form className={styles.findForm} onSubmit={isVerified ? handleResetPassword : handleVerifyUser}>
        <h2 className={styles.formTitle}>비밀번호 재설정</h2>
        <InputText
          name='login_id'
          placeholder='아이디'
          onChange={handlePasswordChange}
          value={passwordDatas.login_id}
          disabled={isVerified}
        />
        <InputText
          name='user_email'
          placeholder='@를 포함한 전체 이메일 주소를 입력해주세요'
          onChange={handlePasswordChange}
          value={passwordDatas.user_email}
          disabled={isVerified}
        />
        
        {/* 사용자 확인 후에만 새 비밀번호 입력창 표시 */}
        {isVerified && (
          <InputText
            name='new_password'
            type='password'
            placeholder='새 비밀번호 (8 ~ 16자 영문+숫자+특수문자)'
            onChange={handlePasswordChange}
            value={passwordDatas.new_password}
          />
        )}
        
        <button type='submit' className={styles.submitButton}>
          {isVerified ? '비밀번호 변경' : '사용자 확인'}
        </button>
        
        {/* 다시 입력하기 버튼 */}
        {isVerified && (
          <button 
            type='button' 
            className={styles.resetButton}
            onClick={() => setIsVerified(false)}
          >
            다시 입력하기
          </button>
        )}
      </form>
    </div>
  );
}