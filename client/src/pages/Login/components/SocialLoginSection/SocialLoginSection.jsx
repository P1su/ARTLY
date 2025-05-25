import styles from './SocialLoginSection.module.css';

export default function SocialLoginSection() {
  return (
    <section className={styles.layout}>
      <div className={styles.subtitleContainer}>
        <div className={styles.divider} />
        <span className={styles.subtitleSpan}>간편 로그인</span>
        <div className={styles.divider} />
      </div>
      <button className={styles.button}>카카오 로그인</button>
      <button className={styles.button}>네이버 로그인</button>
    </section>
  );
}
