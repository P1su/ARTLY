import styles from './InputImage.module.css';

export default function InputImage({ name, onChange, file }) {
  return (
    <>
      <label className={styles.imageLabel} htmlFor='profile'>
        {file ? (
          <img
            className={styles.previewImage}
            src={file}
            alt='프로필 미리보기'
          />
        ) : (
          <div>프로필을 선택해주세요</div>
        )}
      </label>

      <input
        className={styles.fileInput}
        type='file'
        id='profile'
        name={name}
        onChange={onChange}
      />
    </>
  );
}
