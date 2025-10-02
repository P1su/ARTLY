import styles from './Login.module.css';
import kakaoButton from '../../../assets/svg/kakaobutton.svg';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate('/login-detail');
  };

  return (
    <div className={styles.layout}>
      <h1 className={styles.logo}>ARTLY</h1>
      <p className={styles.loginParagraph}>아뜰리 계정으로 로그인하세요</p>
      <button>
        <img src={kakaoButton} />
      </button>
      <button className={styles.loginButton} onClick={handleNavigate}>
        보유 계정으로 로그인
      </button>
      <Link className={styles.registerLink} to='/register'>
        빠른 회원가입
      </Link>
    </div>
  );
}
