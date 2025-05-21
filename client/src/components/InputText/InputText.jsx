import styles from './InputText.module.css';

export default function InputText({
  type = 'text',
  label,
  name,
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className={styles.layout}>
      <label className={styles.inputLabel}>{label}</label>
      <input
        className={styles.input}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
