import ExhibitionItem from './ExhibitionItem/ExhibitionItem';
import styles from './ExhibitionList.module.css';

export default function ExhibitionList({ exhibitionData, likedExhibitions, toggleLike }) {
  return (
    <section>
      {exhibitionData.map((exhibition) => (
        <ExhibitionItem
          key={exhibition.id}
          data={exhibition}
          isLiked={likedExhibitions.includes(exhibition.id)}
          toggleLike={toggleLike}
        />
      ))}
    </section>
  );
}
