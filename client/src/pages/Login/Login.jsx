import styles from './Login.module.css';
import { instance } from '../../apis/instance.js';
import useInput from '../../hooks/useInput';
import InputContainer from '../../components/Input/InputConatiner/InputContainer';
import InputText from '../../components/Input/InputText/InputText';
import BtnPrimary from '../../components/BtnPrimary/BtnPrimary';
import SocialLoginSection from './components/SocialLoginSection/SocialLoginSection';
import SupportSection from './components/SupportSection/SupportSection';

export default function Login() {
  const { data: loginDatas, handleChange } = useInput({
    login_id: '',
    login_pwd: '',
  });

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
          <InputContainer title='아이디'>
            <InputText
              placeholder='아이디를 입력해주세요'
              name='login_id'
              onChange={handleChange}
              value={loginDatas.login_id}
            />
          </InputContainer>
          <InputContainer title='비밀번호'>
            <InputText
              placeholder='비밀번호'
              name='login_pwd'
              onChange={handleChange}
              value={loginDatas.login_pwd}
            />
          </InputContainer>
          <BtnPrimary label='로그인' />
        </form>
        <SocialLoginSection />
        <SupportSection />
      </div>
    </div>
  );
}
