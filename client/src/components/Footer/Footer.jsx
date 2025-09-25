import styles from './Footer.module.css';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className={styles.footerLayout}>
      <div className={styles.linkContainer}>
        <Link to='/announcement' className={styles.link}>
          공지사항&FAQ
        </Link>
        <span className={styles.divideSpan}>|</span>
        <Link to='/termspolicy' className={styles.link}>
          약관 및 정책
        </Link>
      </div>
      <div className={styles.infoContainer}>
        <span>(주)오드레몬오리진</span>
        <span>사업자등록번호 : 477-88-01191</span>
        <span>contact us : oddlemon@oddlemon.co.kr</span>
      </div>
      <p>
        © All rights reserved by{' '}
        <a href='https://oddlemon.co.kr/' target='_blank' rel='noreferrer'>
          ODDLEMON Origin Inc.
        </a>
      </p>
    </footer>
  );
}
