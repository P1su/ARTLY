import React, { useEffect, useState } from 'react';
import styles from './ProfileCard.module.css';
import { Link } from 'react-router-dom';
import { instance } from '../../../../apis/instance';
import profileImg from '../../mock/userProfile.png';

export default function ProfileCard() {
  const [imgSrc, setImgSrc] = useState(profileImg);

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
        if (res.data.user_img) {
          setImgSrc(res.data.user_img);
        } else {
          setImgSrc(profileImg);
        }
      } catch (err) {
        console.log('profile fetch err : ', err);
        setImgSrc(profileImg);
      }
    };

    fetchUserInfo();
  }, []);

  const handleImgError = () => {
    setImgSrc(profileImg);
  };

  return (
    <div className={styles.layout}>
      <div className={styles.imgBox}>
        <img
          src={imgSrc}
          alt='유저 기본 프로필 이미지'
          onError={handleImgError}
        />
      </div>
      <div className={styles.infoContainer}>
        <h3>{userData.user_name} 님</h3>
        <br />
        <p>{userData.user_age} 세</p>
        <p>{userData.user_email}</p>
        <p>{userData.user_phone}</p>
      </div>
      <Link to='/mypage/edit' className={styles.btnBox}>
        프로필 수정
      </Link>
    </div>
  );
}
