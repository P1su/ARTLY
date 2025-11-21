import styles from './LoginDetail.module.css';
import { useContext } from 'react';
import { UserContext } from '../../../store/UserProvider.jsx';
import { instance } from '../../../apis/instance.js';
import { useNavigate, useLocation } from 'react-router-dom';
import useInput from '../../../hooks/useInput';
import InputText from '../../../components/Input/InputText/InputText';
import SupportSection from './components/SupportSection/SupportSection';
import { requestFCMToken } from '../../../apis/FcmService.js';

export default function LoginDetail() {
  const { data: loginDatas, handleChange } = useInput({
    login_id: '',
    login_pwd: '',
  });
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/'; 

  const { login } = useContext(UserContext);

  const postLogin = async () => {
    try {
      const response = await instance.post('/api/auth/login', loginDatas);

      const userPayload = response.data.data;
      const jwtToken = response.data.jwt;

      login(userPayload, jwtToken);

      if (userPayload && userPayload.id) { 
        await requestFCMToken(userPayload.id);
      } 

      if (from === '/register') {
        navigate('/', { replace: true });
      } 
      else if (from && from !== '/login' && from !== location.pathname) {
        navigate(from, { replace: true });
      }
      else {
        navigate('/', { replace: true });
      }
    } catch (error) {
      if (error.status === 401) {
        alert('아이디 및 비밀번호를 확인해주세요');
      } else {
        alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  };

  return (
    <div className={styles.layout}>
      <h1 className={styles.loginTitle}>로그인</h1>
      <p className={styles.subParagraph}>아뜰리 계정으로 로그인하세요</p>
      <div className={styles.contentContainer}>
        <form className={styles.loginForm} onSubmit={(e) => { e.preventDefault(); postLogin(); }}>
          <InputText
            placeholder='ID (6 ~ 20자 영문, 숫자)'
            name='login_id'
            onChange={handleChange}
            value={loginDatas.login_id}
          />
          <InputText
            placeholder='Password (8 ~ 16자 영문+숫자+특수문자)'
            name='login_pwd'
            onChange={handleChange}
            value={loginDatas.login_pwd}
          />
          <button type="submit" className={styles.submitButton}>회원 로그인</button>
        </form>
        <SupportSection />
      </div>
    </div>
  );
}
