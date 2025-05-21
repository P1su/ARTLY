import styles from './Register.module.css';
import { useState } from 'react';
import { instance } from '../../apis/instance.js';
import InputText from '../../components/InputText/InputText';
import InputRadio from '../../components/Input/InputRadio/InputRadio';
import InputImage from '../../components/Input/InputImage/InputImage';
import InputContainer from '../../components/Input/InputConatiner/InputContainer';
import BtnPrimary from '../../components/BtnPrimary/BtnPrimary';

export default function Register() {
  const [formDatas, setFormDatas] = useState({
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
  const [file, setFile] = useState();

  const handleImage = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64 = reader.result;
      setFile(base64);
      setFormDatas((prev) => ({
        ...prev,
        user_img: base64,
      }));
    };
  };

  const postRegister = async (body) => {
    try {
      await instance.post('/api/auth/register', body);
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleRegister = (formData) => {
    /*
    const bodyData = Object.fromEntries(formData.entries());
    bodyData.admin_flag = Boolean(formData.get('admin_flag'));
    bodyData.user_age = Number(formData.get('user_age'));
    bodyData.user_img = file;
    bodyData.gallery_id = 0;
    bodyData.user_keyword = selectedKeyword;*/
    postRegister(formDatas);
  };

  const handleChange = (e) => {
    console.log(e.target.value);
    setFormDatas((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <div className={styles.layout}>
      <h1 className={styles.registerTitle}>회원가입</h1>
      <p className={styles.subParagraph}>아뜰리의 회원이 되어보세요</p>
      <form className={styles.form} action={handleRegister}>
        <InputText
          title='아이디'
          name='login_id'
          placeholder='아이디를 입력해주세요'
          onChange={handleChange}
          value={formDatas.login_id}
        />
        <InputText
          title='비밀번호'
          name='login_pwd'
          placeholder='비밀번호'
          type='password'
          onChange={handleChange}
          value={formDatas.login_pwd}
        />
        <InputText
          title='성명'
          name='user_name'
          placeholder='이름'
          onChange={handleChange}
          value={formDatas.user_name}
        />
        <InputText
          title='휴대폰 번호'
          name='user_phone'
          placeholder='휴대폰 번호'
          onChange={handleChange}
          value={formDatas.user_phone}
        />
        <InputText
          title='이메일'
          name='user_email'
          placeholder='이메일'
          onChange={handleChange}
          value={formDatas.user_email}
        />
        <InputText
          title='나이'
          name='user_age'
          placeholder='몇살?'
          onChange={handleChange}
          value={formDatas.user_age}
        />
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
        <InputContainer title='유형'>
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
          <InputImage name='user_img' onChange={handleImage} file={file} />
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
