import styles from './Login.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';

export default function Login() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/login-detail');
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginContent}>
        <div className={styles.header}>
          <h1 className={styles.logo}>ARTLY</h1>
          <p className={styles.subtitle}>아뜰리 계정으로 로그인하세요.</p>
        </div>

        {/* <div className={styles.buttonGroup}>
          <button className={`${styles.socialButton} ${styles.kakao}`}>
            <RiKakaoTalkFill size='24' style={{ marginRight: '8px' }} />
            카카오 로그인
          </button>

          <button className={`${styles.socialButton} ${styles.google}`}>
            <FcGoogle size='24' style={{ marginRight: '8px' }} />
            Google 계정으로 로그인
          </button>

          <button className={`${styles.socialButton} ${styles.apple}`}>
            <FaApple size='24' style={{ marginRight: '8px' }} />
            Apple로 로그인
          </button>
        </div> 

        <div className={styles.divider}>
          <span>또는</span>
        </div> */}

        <button className={styles.emailButton} onClick={handleNavigate}>
          보유 계정으로 로그인
        </button>

        <div className={styles.footer}>
          <Link className={styles.registerLink} to='/register'>
            빠른 회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
