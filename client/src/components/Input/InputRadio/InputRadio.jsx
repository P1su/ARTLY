import styles from './InputRadio.module.css';

export default function InputRadio({ name, value, label, onChange }) {
  return (
    <div className={styles.layout}>
      <label className={styles.radioLabel}>{label}</label>
      <input
        className={styles.radioInput}
        type='radio'
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
