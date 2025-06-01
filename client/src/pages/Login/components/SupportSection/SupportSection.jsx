import styles from './SupportSection.module.css';
import { Link } from 'react-router-dom';

export default function SupportSection() {
  return (
    <section className={styles.layout}>
      <Link className={styles.navigateLink} to='/find'>
        아이디 / 비밀번호 찾기
      </Link>
      <p className={styles.termParagraph}>
        간편 로그인 및 회원가입 시,
        <br />본 서비스의{' '}
        <Link className={styles.termLink}>이용약관 및 개인정보처리방침</Link>에
        <br />
        따라 정보가 관리됩니다.
      </p>
      <Link className={styles.registerButton} to='/register'>
        빠른 회원가입
      </Link>
    </section>
  );
}
