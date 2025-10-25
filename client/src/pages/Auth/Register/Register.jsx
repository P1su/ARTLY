import styles from './Register.module.css';
import { instance } from '../../../apis/instance.js';
import { useNavigate, useLocation } from 'react-router-dom';
import useInput from '../../../hooks/useInput';
import InputText from '../../../components/Input/InputText/InputText';
import InputRadio from '../../../components/Input/InputRadio/InputRadio';
import InputImage from '../../../components/Input/InputImage/InputImage';
import InputContainer from '../../../components/Input/InputConatiner/InputContainer';
import BtnPrimary from '../../../components/BtnPrimary/BtnPrimary';

export default function Register() {
  const { data: formDatas, handleChange } = useInput({
    login_id: '',
    login_pwd: '',
    user_email: '',
    user_name: '',
    admin_flag: 0,
    gallery_id: 0,
  });
  const navigate = useNavigate();
  const location = useLocation();

  const postRegister = async (e) => {
    e.preventDefault();

    try {
      await instance.post('/api/auth/register', formDatas);
      alert('회원가입에 성공하였습니다');
      navigate('/login', { state: { from: location.pathname } });
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <div className={styles.layout}>
      <h1 className={styles.registerTitle}>회원가입</h1>
      <p className={styles.subParagraph}>아뜰리의 회원이 되어보세요</p>
      <form className={styles.form} onSubmit={postRegister}>
        <InputContainer title='아이디'>
          <InputText
            name='login_id'
            placeholder='아이디 (6~20자 영문, 숫자)'
            onChange={handleChange}
            value={formDatas.login_id}
          />
        </InputContainer>
        <InputContainer title='비밀번호'>
          <InputText
            name='login_pwd'
            placeholder='비밀번호 (8~16자 영문+숫자+특수문자)'
            type='password'
            onChange={handleChange}
            value={formDatas.login_pwd}
          />
        </InputContainer>
        <InputContainer title='성명'>
          <InputText
            name='user_name'
            placeholder='이름을 입력해주세요'
            onChange={handleChange}
            value={formDatas.user_name}
          />
        </InputContainer>
        <InputContainer title='이메일'>
          <InputText
            name='user_email'
            placeholder='이메일을 입력해주세요'
            onChange={handleChange}
            value={formDatas.user_email}
          />
        </InputContainer>
        <InputContainer title='갤러리 관리자인가요?'>
          <InputRadio
            label='관리자'
            name='admin_flag'
            value={1}
            onChange={handleChange}
          />
          <InputRadio
            label='유저'
            name='admin_flag'
            value={0}
            onChange={handleChange}
          />
        </InputContainer>
        <button className={styles.submitButton}>회원가입</button>
      </form>
    </div>
  );
}
