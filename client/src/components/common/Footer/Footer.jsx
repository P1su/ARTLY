import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footerLayout}>
      <div className={styles.footerContentBox}>
        <h2>ARTLY</h2>
        <p>㈜오드레몬오리진 | 사업자 번호: 12345678</p>
        <p>대표: 홍길동 | 기술책임자: 홍길동</p>
        <p>경기도 고양시 덕양구 한국항공대학교</p>
        <p>문의: email@email.com</p>
      </div>
      <div className={styles.footerLinksContainer}>
        <div className={styles.footerLinksBox}>
          <a href="#">서비스 이용 약관</a>
          <a href="#">개인정보처리방침</a>
          <a href="#">취소 및 환불 약관</a>
          <a href="#">전자금융거래 이용약관</a>
        </div>
        {/* 추후 이미지로 변경 */}
        <div className={styles.footerAppsBox}>
          <a href="#">Google Play에서 다운로드</a>
          <a href="#">App Store에서 다운로드</a>
          <a href="#">Instagram</a>
        </div>
      </div>
    </footer>
  );
}
