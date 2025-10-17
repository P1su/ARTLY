import styles from './GalleryArtworks.module.css'; // 부모의 CSS를 공유

export default function GalleryArtworks({ artworks }) {
  if (!artworks || artworks.length === 0) {
    return (
      <p className={styles.emptyContent}>현재 진행중인 작품이 없습니다.</p>
    );
  }
  // 작품 목록 UI는 추후 구현
  return <div>작품 목록이 여기에 표시됩니다.</div>;
}
