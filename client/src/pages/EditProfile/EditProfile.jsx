import React, { useEffect, useState } from 'react';
import styles from './EditProfile.module.css';
import { FaCog } from 'react-icons/fa';
import { instance } from '../../apis/instance';
import PwModal from './PwModal/PwModal';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [userInfo, setUserInfo] = useState({
    user_name: '',
    login_id: '',
    user_email: '',
    user_img: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가
  const [editingName, setEditingName] = useState(false); // 닉네임 수정 상태
  const [editingEmail, setEditingEmail] = useState(false); // 이메일 수정 상태
  const [newName, setNewName] = useState(''); // 새로운 닉네임
  const [newEmail, setNewEmail] = useState(''); // 새로운 이메일

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await instance.get('/api/users/me');
        setUserInfo(response.data);
      } catch (error) {
        console.error('사용자 정보를 불러오는 데 실패했습니다.', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditName = () => {
    setEditingName(true);
    setNewName(userInfo.user_name); // 초기값 설정
  };

  const handleEditEmail = () => {
    setEditingEmail(true);
    setNewEmail(userInfo.user_email); // 초기값 설정
  };

  const handleChangeName = (e) => {
    setNewName(e.target.value);
  };

  const handleChangeEmail = (e) => {
    setNewEmail(e.target.value);
  };

  const handleSaveName = async () => {
    try {
      // API 호출 (PUT 또는 PATCH)
      await instance.put('/api/users/me', { user_name: newName });
      // 성공 시 userInfo 업데이트
      setUserInfo({ ...userInfo, user_name: newName });
      // 수정 모드 종료
      setEditingName(false);
    } catch (error) {
      console.error('닉네임 변경에 실패했습니다.', error);
    }
  };

  const handleSaveEmail = async () => {
    try {
      // API 호출 (PUT 또는 PATCH)
      await instance.put('/api/users/me', { user_email: newEmail });
      // 성공 시 userInfo 업데이트
      setUserInfo({ ...userInfo, user_email: newEmail });
      // 수정 모드 종료
      setEditingEmail(false);
    } catch (error) {
      console.error('이메일 변경에 실패했습니다.', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>내정보</h2>

      <div className={styles.profileCard}>
        <div className={styles.profileImageSection}>
          <div className={styles.profileImage}>
            <img src={userInfo.user_img} alt='프로필 이미지' />
            <div className={styles.profileBadge}>
              <FaCog />
            </div>
          </div>
          <h3 className={styles.profileName}>
            {userInfo.user_name || '닉네임'}
          </h3>
        </div>

        <div className={styles.profileInfoDetails}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>아이디</span>
            <span className={styles.infoValue}>
              {userInfo.login_id || '아이디'}
            </span>
            <button
              className={styles.changeButtonSmall}
              onClick={handleOpenModal}
            >
              비밀번호 변경
            </button>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>닉네임</span>
            {editingName ? (
              <>
                <input
                  type='text'
                  className={styles.input}
                  value={newName}
                  onChange={handleChangeName}
                />
                <button
                  className={styles.changeButton}
                  onClick={handleSaveName}
                >
                  저장
                </button>
              </>
            ) : (
              <>
                <span className={styles.infoValue}>
                  {userInfo.user_name || '닉네임'}
                </span>
                <button
                  className={styles.changeButton}
                  onClick={handleEditName}
                >
                  변경
                </button>
              </>
            )}
          </div>

          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>이메일</span>
            {editingEmail ? (
              <>
                <input
                  type='email'
                  className={styles.input}
                  value={newEmail}
                  onChange={handleChangeEmail}
                />
                <button
                  className={styles.changeButton}
                  onClick={handleSaveEmail}
                >
                  저장
                </button>
              </>
            ) : (
              <>
                <span className={styles.infoValue}>
                  {userInfo.user_email || 'email@email.com'}
                </span>
                <button
                  className={styles.changeButton}
                  onClick={handleEditEmail}
                >
                  변경
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={styles.profileStatsCard}>
        <h3 className={styles.sectionTitle}>고객혜택</h3>
        <div className={styles.statsRow}>
          <span className={styles.statsItem}>1:1 문의</span>
        </div>
        <div className={styles.statsRow}>
          <span className={styles.statsItem}>서비스 약관</span>
        </div>
      </div>

      <div className={styles.profileDetailsCard}>
        <h3 className={styles.sectionTitle}>기타</h3>
        <div className={styles.detailsRow}>
          <span className={styles.detailsLabel}>로그아웃</span>
        </div>
        <div className={styles.detailsRow}>
          <span className={styles.detailsLabel}>현재 버전</span>
          <span className={styles.detailsValue}>1.10.24</span>
        </div>
        <div className={styles.detailsRow}>
          <span className={styles.detailsLabel}>회원 탈퇴</span>
        </div>
      </div>

      <PwModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        userInfo={userInfo}
      />
      <button className={styles.backBtn} onClick={() => navigate('/mypage')}>
        마이페이지로 돌아가기
      </button>
    </div>
  );
};

export default EditProfile;
