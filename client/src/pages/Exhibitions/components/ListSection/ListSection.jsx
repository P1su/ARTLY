import FilterTab from './FilterTab/FilterTab';
import ExhibitionList from './ExhibitionList/ExhibitionList';
import styles from './ListSection.module.css';

export default function ListSection({ exhibitionData, likedExhibitions, toggleLike }) {
  return (
    <div className={styles.listSectionWrapper}>
      <ExhibitionList
        exhibitionData={exhibitionData}
        likedExhibitions={likedExhibitions}
        toggleLike={toggleLike}
      />
    </div>
  );
}
