import styles from './InputRadio.module.css';

export default function InputRadio({ name, value, label, onChange, checked }) {
  return (
    <label className={styles.layout}>
      <input
        className={styles.radioInput}
        type='radio'
        name={name}
        value={value}
        onChange={onChange}
        defaultChecked={checked}
      />
      <span className={styles.radioLabel}>{label}</span>
    </label>
  );
}
