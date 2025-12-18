import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner() {
  return (
    <div className={styles.wrapper}>
      <span className={styles.spinner} />
    </div>
  );
}
