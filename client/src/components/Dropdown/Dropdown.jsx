import styles from './Dropdown.module.css';

export default function Dropdown() {
  const tmp = ['최신순', '오래된순', 'Option3', 'Option4'];
  return (
    <div className={styles.layout}>
      <ul className={styles.dropdownList}>
        {tmp.map((item) => (
          <li>{item}</li>
        ))}
      </ul>
    </div>
  );
}
