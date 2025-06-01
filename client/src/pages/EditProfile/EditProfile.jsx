import React, { useEffect, useState } from 'react';
import styles from './EditProfile.module.css';
import defaultProfile from '../MyPage/mock/userProfile.png';
import SectionTitle from '../MyPage/components/SectionTitle/SectionTitle';
import { useNavigate } from 'react-router-dom';
import { instance } from '../../apis/instance';

export default function EditProfile() {
  const [userInfo, setUserInfo] = useState(null);
  const [selectedKeyword, setSelectedKeyword] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await instance.get('/api/users/me');
        setUserInfo(res.data);
        setSelectedKeyword(res.data.user_keyword?.split(',') || []);
      } catch (error) {
        console.error('유저 정보 불러오기 실패:', error);
        alert('로그인이 필요합니다.');
        navigate('/login');
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const toggleKeyword = (word) => {
    setSelectedKeyword((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word],
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await instance.put('/api/users/me', {
        ...userInfo,
        user_keyword: selectedKeyword.join(','),
      });
      alert('프로필이 수정되었습니다.');
      navigate('/mypage');
    } catch (error) {
      console.error('수정 실패:', error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  if (!userInfo) return <div>로딩 중...</div>;

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
            <input
              type='text'
              name='user_name'
              value={userInfo.user_name}
              onChange={handleInputChange}
              className={styles.input}
            />
            님
          </div>

          <div className={styles.inputRow}>
            <label>나이</label>
            <input
              type='number'
              name='user_age'
              value={userInfo.user_age}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>

          <div className={styles.inputRow}>
            <label>이메일</label>
            <input
              type='email'
              name='user_email'
              value={userInfo.user_email}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>

          <div className={styles.inputRow}>
            <label>전화번호</label>
            <input
              type='tel'
              name='user_phone'
              value={userInfo.user_phone}
              onChange={handleInputChange}
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
                className={`${styles.keywordBtn} ${
                  selectedKeyword.includes(word) ? styles.active : ''
                }`}
                onClick={() => toggleKeyword(word)}
              >
                {word}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleSubmit} className={styles.submitBtn}>
          수정하기
        </button>
      </div>
    </div>
  );
}
