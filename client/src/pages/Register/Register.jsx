import styles from './Register.module.css';
import { instance } from '../../apis/instance.js';
import useInput from '../../hooks/useInput';
import InputText from '../../components/Input/InputText/InputText';
import InputRadio from '../../components/Input/InputRadio/InputRadio';
import InputImage from '../../components/Input/InputImage/InputImage';
import InputContainer from '../../components/Input/InputConatiner/InputContainer';
import BtnPrimary from '../../components/BtnPrimary/BtnPrimary';

export default function Register() {
  const {
    data: formDatas,
    handleChange,
    handleImage,
  } = useInput({
    login_id: '',
    login_pwd: '',
    user_age: '',
    user_email: '',
    user_gender: '',
    user_img: '',
    user_keyword: '',
    user_name: '',
    user_phone: '',
    admin_flag: 0,
    gallery_id: 0,
  });

  const postRegister = async (e) => {
    e.preventDefault();

    try {
      await instance.post('/api/auth/register', formDatas);
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
            placeholder='아이디를 입력해주세요'
            onChange={handleChange}
            value={formDatas.login_id}
          />
        </InputContainer>
        <InputContainer title='비밀번호'>
          <InputText
            name='login_pwd'
            placeholder='비밀번호를 입력해주세요'
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
        <InputContainer title='휴대폰 번호'>
          <InputText
            name='user_phone'
            placeholder='010-XXXX-XXXX'
            onChange={handleChange}
            value={formDatas.user_phone}
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
        <InputContainer title='나이'>
          <InputText
            name='user_age'
            placeholder='나이를 입력해주세요'
            onChange={handleChange}
            value={formDatas.user_age}
          />
        </InputContainer>
        <InputContainer title='성별'>
          <InputRadio
            label='남'
            name='user_gender'
            value='M'
            onChange={handleChange}
          />
          <InputRadio
            label='여'
            name='user_gender'
            value='F'
            onChange={handleChange}
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
        <InputContainer title='프로필'>
          <InputImage
            name='user_img'
            onChange={handleImage}
            file={formDatas.user_img}
          />
        </InputContainer>
        <div className={styles.keywordBox}>
          <label className={styles.keywordLabel}>관심 키워드</label>
          <div className={styles.keywords}>
            {[
              '회화',
              '서양화',
              '유화',
              '수채화',
              '모노톤',
              '단조로움',
              '선',
              '풍경화',
              '모던',
              '디지털',
            ].map((word) => (
              <input
                className={`${styles.keywordBtn} ${formDatas.user_keyword === word ? styles.active : ''}`}
                name='user_keyword'
                key={word}
                type='button'
                onClick={handleChange}
                value={word}
              />
            ))}
          </div>
        </div>
        <BtnPrimary label='회원가입' />
      </form>
    </div>
  );
}
