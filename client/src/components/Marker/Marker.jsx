import styles from './Marker.module.css';
import IcGallery from '../../assets/svg/IcGallery.svg';
import IcFavGallery from '../../assets/svg/IcFavGallery.svg';

export default function Marker({ title, isLike = false }) {
  return (
    <div className={styles.container}>
      <img src={isLike ? IcFavGallery : IcGallery} />
      <div className={styles.infoBox}>{title}</div>
    </div>
  );
}
