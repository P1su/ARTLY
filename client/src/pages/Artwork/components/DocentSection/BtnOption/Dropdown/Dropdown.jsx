import styles from './Dropdown.module.css';

const Dropdown = ({ options }) => {
  return (
    <select className={styles.dropdown}>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
