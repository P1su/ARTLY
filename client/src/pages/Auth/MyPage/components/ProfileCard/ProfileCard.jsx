import React, { useEffect, useState } from 'react';
import styles from './ProfileCard.module.css';
import { Link } from 'react-router-dom';

import { instance } from '../../../../../apis/instance';

export default function ProfileCard() {
  const [userData, setUserData] = useState({
    user_img: '',
    user_name: '',
    user_age: '',
    user_email: '',
    user_phone: '',
  });

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

  return (
    <div className={styles.layout}>
      <h1 className={styles.pageTitle}>마이페이지</h1>
      <Link className={styles.editLink} to='/mypage/edit'>
        {userData.user_name} 님, 안녕하세요
      </Link>
    </div>
  );
}
