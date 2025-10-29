import styles from './Register.module.css';
import { instance } from '../../../apis/instance.js';
import { useNavigate, useLocation } from 'react-router-dom';
import useInput from '../../../hooks/useInput';
import InputText from '../../../components/Input/InputText/InputText';
import InputRadio from '../../../components/Input/InputRadio/InputRadio';
import InputContainer from '../../../components/Input/InputConatiner/InputContainer';

export default function Register() {
  const { data: formDatas, handleChange } = useInput({
    login_id: '',
    login_pwd: '',
    user_email: '',
    user_name: '',
    admin_flag: 0,
  });
  const navigate = useNavigate();
  const location = useLocation();

  const isValidPassword = (pwd) => {
    // 영문, 숫자, 특수문자, 8자 이상 검증
    const regex = /^(?=.*[A-Za-z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return regex.test(pwd);
  };

  const isValidId = (id) => {
    const regex = /^[A-Za-z0-9]{6,20}$/;
    return regex.test(id);
  };

  const isValidEmail = (email) => {
    // 공백 없이 시작, 도메인은 영문과 숫자 및 . 허용, 도메인은 2글자 이상
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.]+\.[A-Za-z]{2,}$/;
    return regex.test(email);
  };

  const isFormValid = () => {
    const { login_id, login_pwd, user_email, user_name, admin_flag } =
      formDatas;

    return (
      isValidId(login_id) &&
      isValidPassword(login_pwd) &&
      isValidEmail(user_email) &&
      user_name.trim() !== '' &&
      admin_flag !== ''
    );
  };

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
        <InputContainer
          title='아이디'
          isValid={
            formDatas.login_id === '' ? true : isValidId(formDatas.login_id)
          }
          errorText='아이디는 6~20자의 영문 및 숫자로 이루어져야 합니다'
        >
          <InputText
            name='login_id'
            placeholder='아이디 (6~20자 영문, 숫자)'
            onChange={handleChange}
            value={formDatas.login_id}
          />
        </InputContainer>
        <InputContainer
          title='비밀번호'
          isValid={
            formDatas.login_pwd === ''
              ? true
              : isValidPassword(formDatas.login_pwd)
          }
          errorText='8~20자의 영문, 숫자, 특수문자를 모두 포함한 비밀번호를 입력해주세요'
        >
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
        <InputContainer
          title='이메일'
          isValid={
            formDatas.user_email === ''
              ? true
              : isValidEmail(formDatas.user_email)
          }
          errorText='올바른 이메일 형식을 입력해주세요'
        >
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
        <button className={styles.submitButton} disabled={!isFormValid()}>
          회원가입
        </button>
      </form>
    </div>
  );
}
