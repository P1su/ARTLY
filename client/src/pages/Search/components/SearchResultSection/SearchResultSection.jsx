import styles from './SearchResultSection.module.css';

export default function SearchResultSection({ category, resultItems }) {
  console.log(category);
  console.log(resultItems);
  return (
    <section className={styles.layout}>
      <span>{category}</span>
      <hr />
    </section>
  );
}
/*
function SearchResultItem({ title, image }) {
  return (
    <div>
      <img src={image} alt={`${title} 대표 이미지`} />
      <span>{title}</span>
    </div>
  );
}
*/
