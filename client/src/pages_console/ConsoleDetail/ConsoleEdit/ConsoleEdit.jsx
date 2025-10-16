import styles from './ConsoleEdit.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { instance } from '../../../apis/instance.js';
import GalleryEditForm from './forms/GalleryEditForm.jsx';

const EDIT_CONFIG = {
  galleries: {
    title: '갤러리 수정',
    fetchUrl: (id) => `/api/galleries/${id}`,
    updateUrl: (id) => `/api/galleries/${id}`,
  },
  // ...
};

const FORM_COMPONENTS = {
  galleries: GalleryEditForm,
  // exhibitions: ExhibitionEditForm, // 추후 분리 후 추가
  // artworks: ArtworkEditForm,
};

export default function ConsoleEdit({ type }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  const config = EDIT_CONFIG[type];
  const FormComponent = FORM_COMPONENTS[type];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get(config.fetchUrl(id));
        setData(response.data);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
        setData({});
      }
    };
    if (config) fetchData();
    console.log('effect 후:', data);
  }, [id, config]);

  const handleCancel = () => {
    if (
      window.confirm('수정을 취소하시겠습니까? 변경사항이 저장되지 않습니다.')
    ) {
      navigate(-1);
    }
  };

  const handleSave = () => {
    console.log('수정된 데이터를 서버에 저장합니다:', data);
    alert('저장되었습니다.');
    navigate(`/console/${type}/${id}`);
  };

  if (!data) return <div>데이터 로딩 중...</div>;

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleCancel}>
          {'<'}
        </button>
        <h1 className={styles.title}>{config.title}</h1>
      </header>

      <main className={styles.formContainer}>
        {FormComponent && <FormComponent data={data} setData={setData} />}
      </main>

      <div className={styles.bottomButtonContainer}>
        <button
          className={`${styles.button} ${styles.saveButton}`}
          onClick={handleSave}
        >
          저장
        </button>
        <button
          className={`${styles.button} ${styles.cancelButton}`}
          onClick={handleCancel}
        >
          취소
        </button>
      </div>
    </div>
  );
}
