import styles from './DocentScript.module.css';

const DocentScript = ({ script }) => {
  return (
    <div className={styles.script}>
      <p>{script}</p>
    </div>
  );
};

export default DocentScript;
