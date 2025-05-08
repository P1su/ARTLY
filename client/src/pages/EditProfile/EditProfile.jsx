import React, { useState } from 'react';
import styles from './EditProfile.module.css';
import defaultProfile from '../../assets/images/userProfile.png';
import SectionTitle from '../MyPage/components/SectionTitle/SectionTitle';
import { Link } from 'react-router-dom';

export default function EditProfile() {
  const [selectedKeyword, setSelectedKeyword] = useState([]);

  const toggleKeyword = (word) => {
    setSelectedKeyword((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word],
    );
  };

  return (
    <div className={styles.layout}>
      <SectionTitle title='프로필' />

      <div className={styles.profileContainer}>
        <div className={styles.imageBox}>
          <img
            src={defaultProfile}
            alt='기본 프로필'
            className={styles.profileImage}
          />
        </div>

        <div className={styles.inputContainer}>
          <div className={styles.inputRow}>
            <label>닉네임</label>
            <input type='text' defaultValue='아뜰리' className={styles.input} />
            님
          </div>

          <div className={styles.inputRow}>
            <label>생년월일</label>
            <input
              type='date'
              defaultValue='2000-10-10'
              className={styles.input}
            />
          </div>

          <div className={styles.inputRow}>
            <label>이메일</label>
            <input
              type='email'
              defaultValue='123456@gmail.com'
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputRow}>
            <label>전화번호</label>
            <input
              type='tel'
              defaultValue='010-0000-0000'
              className={styles.input}
            />
          </div>
        </div>
      </div>

      <div className={styles.bottomSection}>
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
              <button
                key={word}
                className={`${styles.keywordBtn} ${selectedKeyword.includes(word) ? styles.active : ''}`}
                onClick={() => toggleKeyword(word)}
              >
                {word}
              </button>
            ))}
          </div>
        </div>

        <Link to='/mypage' className={styles.submitBtn}>
          수정하기
        </Link>
      </div>
    </div>
  );
}
