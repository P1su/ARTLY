import styles from './InputContainer.module.css';

export default function InputContainer({
  children,
  title,
  isValid,
  errorText,
}) {
  return (
    <div className={styles.layout}>
      <h3 className={styles.inputTitle}>{title}</h3>
      <div className={styles.inputContainer}>{children}</div>
      {!isValid && <div className={styles.errorParagraph}>{errorText}</div>}
    </div>
  );
}
