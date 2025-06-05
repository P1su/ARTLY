import styles from './Footer.module.css';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className={styles.footerLayout}>
      <div className={styles.linkContainer}>
        <Link to="/announcement" className={styles.link}>공지사항&FAQ</Link>
        <span className={styles.divideSpan}>|</span>
        <Link to="/termspolicy" className={styles.link}>약관 및 정책</Link>
      </div>
      <div className={styles.infoContainer}>
        <p>Copyright © 2024 Artly Corp. All Rights Reserved.</p>
        <p>상호명 : Artly | 사업자등록번호 : 000-00-00000</p>
        <p>
          대외총괄/제안 : info@artly.co.kr | 전시지원/관리 : contact@artly.co.kr
        </p>
        <p>홍보/기획 : biz@artly.co.kr</p>
      </div>
    </footer>
  );
}
