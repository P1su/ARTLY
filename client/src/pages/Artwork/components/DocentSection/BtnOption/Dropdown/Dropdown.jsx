import styles from './Dropdown.module.css';

export default function Dropdown({ options, onChange, selectedId }) {
  return (
    <select
      className={styles.dropdownBox}
      value={selectedId}
      onChange={e => onChange(e.target.value)}
    >
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
