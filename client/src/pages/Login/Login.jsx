import styles from './Login.module.css';
import { instance } from '../../apis/instance.js';
import { useState } from 'react';
import InputText from '../../components/Input/InputText/InputText';
import BtnPrimary from '../../components/BtnPrimary/BtnPrimary';

export default function Login() {
  const [loginDatas, setLoginDatas] = useState({
    login_id: '',
    login_pwd: '',
  });

  const handleChange = (e) => {
    setLoginDatas((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const postLogin = async () => {
    try {
      await instance.post('/api/auth/login', loginDatas);
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <div className={styles.layout}>
      <h1 className={styles.loginTitle}>로그인</h1>
      <p className={styles.subParagraph}>아뜰리 계정으로 로그인하세요</p>
      <div className={styles.contentContainer}>
        <form className={styles.form} action={postLogin}>
          <InputText
            placeholder='아이디'
            name='login_id'
            onChange={handleChange}
            value={loginDatas.login_id}
          />
          <InputText
            placeholder='비밀번호'
            name='login_pwd'
            onChange={handleChange}
            value={loginDatas.login_pwd}
          />
          <BtnPrimary label='Login' />
        </form>
      </div>
    </div>
  );
}
