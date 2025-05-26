import styles from './SupportSection.module.css';
import { Link } from 'react-router-dom';

export default function SupportSection() {
  return (
    <section className={styles.layout}>
      <Link className={styles.navigateLink} to='/register'>
        회원가입
      </Link>
      <span className={styles.divideSpan}>|</span>
      <Link className={styles.navigateLink}>아이디 찾기</Link>
      <span className={styles.divideSpan}>|</span>
      <Link className={styles.navigateLink}>비밀번호 찾기</Link>
    </section>
  );
}
