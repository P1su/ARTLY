import styles from './DocentScript.module.css';

export default function DocentScript({ script }) {
  return (
    <section className={styles.scriptBox}>
      <p>{script}</p>
    </section>
  );
}
