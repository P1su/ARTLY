import styles from './InputText.module.css';

export default function InputText({
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
}) {
  return (
    <input
      className={styles.input}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}
