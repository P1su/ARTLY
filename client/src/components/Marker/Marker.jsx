import styles from './Marker.module.css';
import IcGallery from '../../assets/svg/IcGallery.svg';
import IcFavGallery from '../../assets/svg/IcFavGallery.svg';
// Img 컴포넌트 대신 직접 img 태그를 쓰거나, Img에 className을 넘겨주세요.
// 여기서는 확실한 스타일 적용을 위해 img 태그 사용 예시를 듭니다.

export default function Marker({ title, isLike = false }) {
  return (
    <div className={styles.container}>
      <img
        src={isLike ? IcFavGallery : IcGallery}
        alt='marker'
        className={styles.markerImage}
      />
      <div className={styles.infoBox}>{title}</div>
    </div>
  );
}
