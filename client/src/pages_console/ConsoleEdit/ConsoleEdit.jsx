import styles from './ConsoleEdit.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { userInstance } from '../../apis/instance.js';

import GalleryEditForm from './forms/GalleryEditForm.jsx';
import ExhibitionEditForm from './forms/ExhibitionEditForm.jsx';
import ArtworkEditForm from './forms/ArtworkEditForm.jsx';

const EDIT_CONFIG = {
  galleries: {
    title: '갤러리 수정',
    apiUrl: (id) => `/api/galleries/${id}`,
    formImageField: 'gallery_image_file',
  },
  exhibitions: {
    title: '전시회 수정',
    apiUrl: (id) => `/api/exhibitions/${id}`,
    formImageField: 'exhibition_poster_file',
  },
  artworks: {
    title: '작품 수정',
    apiUrl: (id) => `/api/arts/${id}`,
    formImageField: 'art_image_file',
  },
};

const FORM_COMPONENTS = {
  galleries: GalleryEditForm,
  exhibitions: ExhibitionEditForm,
  artworks: ArtworkEditForm,
};

export default function ConsoleEdit({ type }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const config = EDIT_CONFIG[type];
  const FormComponent = FORM_COMPONENTS[type];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await userInstance.get(config.apiUrl(id));
        const resData =
          typeof response.data === 'string'
            ? JSON.parse(response.data)
            : response.data;

        setData(resData);
        console.log('저장 응답:', response.data);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
        setData({});
      }
    };

    if (config) fetchData();
  }, [id, config]);

  const handleCancel = () => {
    if (window.confirm('수정을 취소하시겠습니까?')) {
      navigate(`/console/${type}/${id}`);
    }
  };

  const handleSave = async () => {
    if (isSaving || !data) return;
    setIsSaving(true);

    const formData = new FormData();

    formData.append('_method', 'PATCH');

    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (typeof value === 'object' && !(value instanceof File)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    const imageField = config.formImageField;

    if (selectedImageFile) {
      formData.append(imageField, selectedImageFile);
    }

    try {
      const response = await userInstance.post(config.apiUrl(id), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('저장 성공:', response.data);
      alert('저장되었습니다.');
      navigate(`/console/${type}/${id}`);
    } catch (error) {
      console.error('❌ 저장 오류:', error);
      alert('저장 실패. 다시 시도하세요.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (file) => {
    setSelectedImageFile(file);
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
        {FormComponent && (
          <FormComponent
            data={data}
            setData={setData}
            onFileChange={handleFileChange}
          />
        )}
      </main>

      <div className={styles.bottomButtonContainer}>
        <button
          className={`${styles.button} ${styles.saveButton}`}
          onClick={handleSave}
        >
          {isSaving ? '저장 중...' : '저장'}
        </button>
        <button
          className={`${styles.button} ${styles.cancelButton}`}
          onClick={handleCancel}
          disabled={isSaving}
        >
          취소
        </button>
      </div>
    </div>
  );
}
