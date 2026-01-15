import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Verify.module.css';
import { userInstance } from '../../apis/instance';
import { useUser } from '../../store/UserProvider';
import Img from '../../components/Img/Img';

export default function Verify() {
  const { exhibitionId } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: userLoading } = useUser();
  const [status, setStatus] = useState('loading');
  const [exhibition, setExhibition] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [verifiedAt, setVerifiedAt] = useState(null);

  useEffect(() => {
    if (userLoading) return;
    
    if (!user) {
      setStatus('login');
    } else {
      setStatus('confirm');
    }
  }, [user, userLoading]);

  const handleVerify = async () => {
    try {
      setStatus('loading');

      const response = await userInstance.post(
        `/api/users/console/exhibitions/${exhibitionId}/verify`,
        { user_id: user.id }
      );

      if (response.data.success) {
        setExhibition({
          id: response.data.exhibitionId,
          name: response.data.exhibitionName,
          poster: response.data.exhibitionPoster
        });
        setVerifiedAt(response.data.verifiedAt);
        
        if (response.data.message?.includes('이미')) {
          setStatus('already');
        } else {
          setStatus('success');
        }
      }
    } catch (err) {
      console.error('인증 실패:', err);
      const msg = err?.response?.data?.message || '인증에 실패했습니다.';
      setErrorMessage(msg);
      setStatus('error');
    }
  };

  const handleLogin = () => {
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
    window.location.href = '/login';
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleGoToExhibition = () => {
    navigate(`/exhibitions/${exhibitionId}`);
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className={styles.statusContainer}>
            <div className={styles.spinner} />
            <p className={styles.statusText}>처리 중...</p>
          </div>
        );

      case 'login':
        return (
          <div className={styles.statusContainer}>
            <div className={styles.iconCircle}>
              <span className={styles.icon}>🔐</span>
            </div>
            <h2 className={styles.statusTitle}>로그인이 필요합니다</h2>
            <p className={styles.statusText}>
              관람 인증을 위해 로그인해주세요
            </p>
            <button className={styles.primaryButton} onClick={handleLogin}>
              로그인하기
            </button>
          </div>
        );

      case 'confirm':
        return (
          <div className={styles.statusContainer}>
            <h2 className={styles.statusTitle}>관람 인증</h2>
            <p className={styles.statusText}>
              전시회 관람을 인증하시겠습니까?
            </p>
            <button className={styles.primaryButton} onClick={handleVerify}>
              인증하기
            </button>
          </div>
        );

      case 'success':
      case 'already':
        return (
          <div className={styles.statusContainer}>
            {exhibition?.poster && (
              <div className={styles.posterWrapper}>
                <Img 
                  src={exhibition.poster} 
                  alt={exhibition.name} 
                  className={styles.poster}
                />
              </div>
            )}
            
            <div className={`${styles.iconCircle} ${styles.success}`}>
              <span className={styles.icon}>✓</span>
            </div>
            
            <h2 className={styles.statusTitle}>
              {status === 'already' ? '이미 인증됨' : '관람 확인 완료'}
            </h2>
            
            {verifiedAt && (
              <p className={styles.verifiedTime}>
                방문일시 : {new Date(verifiedAt).toLocaleString('ko-KR')}
              </p>
            )}
            
            <button className={styles.secondaryButton} onClick={handleGoToExhibition}>
              전시 정보 보기
            </button>
          </div>
        );

      case 'error':
        return (
          <div className={styles.statusContainer}>
            <div className={`${styles.iconCircle} ${styles.error}`}>
              <span className={styles.icon}>!</span>
            </div>
            <h2 className={styles.statusTitle}>인증 실패</h2>
            <p className={styles.statusText}>{errorMessage}</p>
            <button
              className={styles.secondaryButton}
              onClick={() => setStatus('confirm')}
            >
              다시 시도
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <button className={styles.closeButton} onClick={handleClose}>
            ✕
          </button>
          {exhibition?.name && (
            <h1 className={styles.exhibitionTitle}>{exhibition.name}</h1>
          )}
          {!exhibition?.name && (
            <h1 className={styles.title}>Artly</h1>
          )}
        </div>
        {renderContent()}
      </div>
    </div>
  );
}