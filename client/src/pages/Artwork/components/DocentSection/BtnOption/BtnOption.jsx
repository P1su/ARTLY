import styles from './BtnOption.module.css';
import Dropdown from './Dropdown/Dropdown';

const BtnOption = ({ label, options }) => {
  return (
    <div className={styles.optionContainer}>
      <div className={styles.labelButton}>{label}</div>
      <Dropdown options={options} />
    </div>
  );
};

export default BtnOption;
