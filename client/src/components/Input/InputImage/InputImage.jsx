import styles from './InputImage.module.css';
import useImage from '../../../hooks/useImage';

export default function InputImage({ name, onChange, file }) {
  const { image: imageUrl, handleImage } = useImage();

  return (
    <>
      <label className={styles.imageLabel} htmlFor='profile'>
        {file ? (
          <img
            className={styles.previewImage}
            src={imageUrl}
            alt='프로필 미리보기'
          />
        ) : (
          <>
            <span className={styles.addIconSpan}>+</span>
            <span>프로필을 선택해주세요</span>
          </>
        )}
      </label>

      <input
        className={styles.fileInput}
        type='file'
        id='profile'
        name={name}
        onChange={(e) => {
          handleImage(e);
          onChange(e);
        }}
        value={file}
      />
    </>
  );
}
