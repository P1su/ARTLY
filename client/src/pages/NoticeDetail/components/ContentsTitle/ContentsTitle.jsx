import styles from './ContentsTitle.module.css';

export default function ContentsTitle({ title }) {
  return <h1 className={styles.title}>{title}</h1>;
}
