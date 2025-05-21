import styles from './Register.module.css';
import { useState } from 'react';
import { instance } from '../../apis/instance.js';
import InputText from '../../components/InputText/InputText';
import BtnPrimary from '../../components/BtnPrimary/BtnPrimary';

export default function Register() {
  const [selectedKeyword, setSelectedKeyword] = useState('');

  const postRegister = async (body) => {
    try {
      await instance.post('/api/auth/register', body);
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleRegister = (formData) => {
    formData.set('user_age', Number(formData.get('user_age')));
    const bodyData = Object.fromEntries(formData.entries());
    console.log(bodyData);

    postRegister(bodyData);
  };

  return (
    <div className={styles.layout}>
      <h1 className={styles.registerTitle}>회원가입</h1>
      <p className={styles.subParagraph}>아뜰리의 회원이 되어보세요</p>
      <form className={styles.form} action={handleRegister}>
        <InputText
          label='아이디'
          name='login_id'
          placeholder='아이디를 입력해주세요'
        />
        <InputText
          label='비밀번호'
          name='login_pwd'
          placeholder='비밀번호'
          type='password'
        />
        <InputText label='성명' name='user_name' placeholder='이름' />
        <InputText
          label='휴대폰 번호'
          name='user_phone'
          placeholder='휴대폰 번호'
        />
        <InputText label='이메일' name='user_email' placeholder='이메일' />
        <InputText label='나이' name='user_age' placeholder='몇살?' />
        <label>성별</label>
        <span>남자</span>
        <input name='user_gender' type='radio' value='M' />
        <span>여자</span>
        <input name='user_gender' type='radio' value='F' />
        <label>관리자 여부</label>
        <span>관리자</span>
        <input name='admin_flag' type='radio' value={1} />
        <span>유저</span>
        <input name='admin_flag' type='radio' value={0} />
        <label>사진</label>
        <input name='user_img' type='file' />
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
                className={`${styles.keywordBtn} ${selectedKeyword === word ? styles.active : ''}`}
                name='user_keyword'
                key={word}
                type='button'
                onClick={() => {
                  setSelectedKeyword(word);
                }}
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
