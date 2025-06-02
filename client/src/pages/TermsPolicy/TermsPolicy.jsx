import { termsPolicies } from './data/termsData';
import styles from './TermsPolicy.module.css';

export default function TermsPolicy() {
  return (
    <section className={styles.container}>
      <h1 className={styles.mainTitle}>이용약관</h1>

      {termsPolicies.map(({ id, title, content }) => (
        <section key={id} className={styles.section}>
          <h2 className={styles.sectionTitle}>{title}</h2>

          <div className={styles.card}>
            <pre className={styles.content}>{content}</pre>
          </div>
        </section>
      ))}
    </section>
  );
}
