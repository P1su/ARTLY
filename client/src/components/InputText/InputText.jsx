import styles from './InputText.module.css';

export default function InputText({
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  title,
}) {
  return (
    <div className={styles.layout}>
      <label className={styles.inputLabel}>{title}</label>
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
