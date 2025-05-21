import styles from './BtnOption.module.css';
import Dropdown from './Dropdown/Dropdown';

export default function BtnOption({ label, options }) {
  return (
    <div className={styles.optionContainer}>
      <p className={styles.optionButton}>{label}</p>
      <Dropdown options={options} />
    </div>
  );
}
