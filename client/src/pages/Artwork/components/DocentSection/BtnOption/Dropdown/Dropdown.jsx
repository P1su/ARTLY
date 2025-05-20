import styles from './Dropdown.module.css';

export default function Dropdown({ options }) {
  return (
    <select className={styles.dropdownBox}>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
