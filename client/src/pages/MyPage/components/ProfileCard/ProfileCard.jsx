import React, { useEffect, useState } from 'react';
import styles from './ProfileCard.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaCog, FaHeart, FaChevronDown } from 'react-icons/fa';

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

  const handleSettingClick = () => {
    navigate('/mypage/edit');
  };

  return (
    <div className={styles.layout}>
      <div className={styles.info}>
        <div className={styles.imgBox}>
          <img src={imgSrc} alt='사 진' onError={handleImgError} />
        </div>
        <h3 className={styles.name}>{userData.user_name} 님</h3>
      </div>
      <button className={styles.btn} onClick={handleSettingClick}>
        <FaCog />
      </button>
    </div>
  );
}
