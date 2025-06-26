import React, { useEffect, useState } from 'react';
import styles from './ProfileCard.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaCog, FaHeart, FaChevronDown } from 'react-icons/fa';

import { instance } from '../../../../../apis/instance';
import defaultProfileImg from '../../mock/userProfile.png';

export default function ProfileCard() {
  const [userData, setUserData] = useState({
    user_img: '',
    user_name: '',
    user_age: '',
    user_email: '',
    user_phone: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await instance.get('api/users/me');
        setUserData({
          user_img: res.data.user_img,
          user_name: res.data.user_name,
          user_age: res.data.user_age,
          user_email: res.data.user_email,
          user_phone: res.data.user_phone,
        });
        console.log(res.data);
      } catch (err) {
        console.log('profile fetch err : ', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSettingClick = () => {
    navigate('/mypage/edit');
  };

  return (
    <div className={styles.layout}>
      <div className={styles.info}>
        {isLoading ? (
          <div className={styles.imgBox}>
            <img src={defaultProfileImg} alt='로딩 중...' />
          </div>
        ) : (
          <div className={styles.imgBox}>
            <img
              src={userData.user_img || defaultProfileImg}
              alt='프로필 사진'
            />
          </div>
        )}
        <h3 className={styles.name}>{userData.user_name} 님</h3>
      </div>
      <button className={styles.btn} onClick={handleSettingClick}>
        <FaCog />
      </button>
    </div>
  );
}
