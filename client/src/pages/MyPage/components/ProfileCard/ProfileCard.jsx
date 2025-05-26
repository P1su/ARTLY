import React, { useEffect, useState } from 'react';
import styles from './ProfileCard.module.css';
import { Link } from 'react-router-dom';
import { instance } from '../../../../apis/instance';
import useInput from '../../../../hooks/useInput';
import profileImg from '../../mock/userProfile.png';

export default function ProfileCard() {
  const {
    data: formDatas,
    setData: setFormDatas,
    handleChange,
  } = useInput({
    login_id: '',
    user_name: '',
    user_gender: '',
    user_age: '',
    user_email: '',
    user_phone: '',
    user_img: '',
    user_keyword: '',
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await instance.get('api/users/me');
        setFormDatas({
          login_id: res.data.login_id,
          user_name: res.data.user_name,
          user_gender: res.data.user_gender,
          user_age: res.data.user_age,
          user_email: res.data.user_email,
          user_phone: res.data.user_phone,
          user_img: res.data.user_img,
          user_keyword: res.data.user_keyword,
        });
      } catch (err) {
        console.log('fetch err : ', err);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className={styles.layout}>
      <div className={styles.imgBox}>
        <img
          src={formDatas.user_img || profileImg}
          alt='유저 기본 프로필 이미지'
        />
      </div>
      <div className={styles.infoContainer}>
        <h3>{formDatas.user_name} 님</h3>
        <br />
        <p>{formDatas.user_age}</p>
        <p>{formDatas.user_email}</p>
        <p>{formDatas.user_phone}</p>
      </div>
      <Link to='/mypage/edit' className={styles.btnBox}>
        프로필 수정
      </Link>
    </div>
  );
}
