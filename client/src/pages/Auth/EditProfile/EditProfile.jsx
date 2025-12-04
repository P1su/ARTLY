import React, { useContext, useState } from 'react';
import styles from './EditProfile.module.css';
import { FaCog } from 'react-icons/fa';
import { userInstance } from '../../../apis/instance';
import PwModal from './PwModal/PwModal';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './../../../store/UserProvider';
import LogoutModal from './../../../components/Menu/LogoutModal/LogoutModal';
import WithdrawModal from './WithdrawModal/WithdrawModal';
import Cookies from 'js-cookie';

const EditProfile = () => {
  const { user, setUser } = useContext(UserContext);

  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가
  const [editingName, setEditingName] = useState(false); // 닉네임 수정 상태
  const [editingEmail, setEditingEmail] = useState(false); // 이메일 수정 상태
  const [newName, setNewName] = useState(''); // 새로운 닉네임
  const [newEmail, setNewEmail] = useState(''); // 새로운 이메일

  const navigate = useNavigate();

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  if (!user) {
    return <div>데이터 불러오는 중</div>;
  }

  const handleUpdateUserInfo = (updatedData) => setUser({ ...user, ...updatedData });
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleEditName = () => { setEditingName(true); setNewName(user.user_name); };
  const handleEditEmail = () => { setEditingEmail(true); setNewEmail(user.user_email); };
  const handleChangeName = (e) => setNewName(e.target.value);
  const handleChangeEmail = (e) => setNewEmail(e.target.value);

  const handleSaveName = async () => {
    try {
      await userInstance.put('/api/users/me', { user_name: newName });
      setUser({ ...user, user_name: newName });
      setEditingName(false);
    } catch (error) { console.error('닉네임 변경 실패', error); }
  };

  const handleSaveEmail = async () => {
    try {
      await userInstance.put('/api/users/me', { user_email: newEmail });
      setUser({ ...user, user_email: newEmail });
      setEditingEmail(false);
    } catch (error) { console.error('이메일 변경 실패', error); }
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    Cookies.remove('ACCESS_TOKEN'); 
    setIsLogoutModalOpen(false);    
    setUser(null);                  
    navigate('/');                  
  };

  const handleWithdrawSuccess = () => {
    Cookies.remove('ACCESS_TOKEN'); 
    setUser(null);
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>내정보</h2>

      <div className={styles.profileCard}>
        <div className={styles.profileInfoDetails}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>성명</span>

            <span className={styles.infoValue}>
              {user.user_name || '닉네임'}
            </span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>아이디</span>
            <span className={styles.infoValue}>
              {user.login_id || '아이디'}
            </span>
            <button
              className={styles.changeButtonSmall}
              onClick={handleOpenModal}
            >
              비밀번호 변경
            </button>
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
                  {user.user_email || 'email@email.com'}
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
        <h3 className={styles.sectionTitle}>고객센터</h3>
        <div className={styles.statsRow}>
          <span className={styles.statsItem}>1:1 문의</span>
        </div>
        <div className={styles.statsRow}>
          <span className={styles.statsItem}>서비스 약관</span>
        </div>
      </div>

      <div className={styles.profileDetailsCard}>
        <h3 className={styles.sectionTitle}>기타</h3>
        <div 
            className={styles.detailsRow} 
            onClick={handleLogoutClick} 
            style={{ cursor: 'pointer' }}
        >
          <span className={styles.detailsLabel}>로그아웃</span>
        </div>
        <div className={styles.detailsRow}>
          <span className={styles.detailsLabel}>현재 버전</span>
          <span className={styles.detailsValue}>1.10.24</span>
        </div>

        <div className={styles.detailsRow} onClick={() => setIsWithdrawModalOpen(true)} style={{cursor: 'pointer'}}>
          <span className={styles.detailsLabel}>회원 탈퇴</span>
        </div>
      </div>
      <div className={styles.buttonField}>
        <button className={styles.backBtn} onClick={() => navigate('/mypage')}>
          마이페이지로 돌아가기
        </button>
      </div>
      <PwModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        userInfo={user}
        onUpdateUserInfo={handleUpdateUserInfo}
      />
      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={handleLogoutConfirm} 
      />
      <WithdrawModal 
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        userInfo={user} 
        onWithdrawSuccess={handleWithdrawSuccess}
      />
    </div>
  );
};

export default EditProfile;
