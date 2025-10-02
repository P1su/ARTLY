import styles from './ConsoleEdit.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const EDIT_CONFIG = {
  galleries: {
    fetchUrl: (id) => `/api/galleries/${id}`,
    updateUrl: (id) => `/api/galleries/${id}`,
  },
  exhibitions: {
    fetchUrl: (id) => `/api/exhibitions/${id}`,
    updateUrl: (id) => `/api/exhibitions/${id}`,
  },
  artworks: {
    fetchUrl: (id) => `/api/artworks/${id}`,
    updateUrl: (id) => `/api/artworks/${id}`,
  },
};

const GalleryEditForm = ({ data, setData }) => <div>갤러리 수정 폼</div>;
const ExhibitionEditForm = ({ data, setData }) => <div>전시회 수정 폼</div>;
const ArtworkEditForm = ({ data, setData }) => <div>작품 수정 폼</div>;

const FORM_COMPONENTS = {
  galleries: GalleryEditForm,
  exhibitions: ExhibitionEditForm,
  artworks: ArtworkEditForm,
};

export default function ConsoleEdit({ type }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  const config = EDIT_CONFIG[type];
  const FormComponent = FORM_COMPONENTS[type];

  useEffect(() => {
    const fetchData = async () => {
      // const response = await instance.get(config.fetchUrl(id));
      // setData(response.data);
      console.log(`${config} (ID: ${id})의 기존 데이터를 불러옵니다.`);
      setData({}); // 임시 데이터 설정
    };
    fetchData();
  }, [id, type, config]);

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
    navigate(`/console/${type}s/${id}`);
  };

  if (!data) {
    return <div>데이터 로딩 중...</div>;
  }

  return (
    <div className={styles.layout}>
      <main className={styles.formContainer}>
        <FormComponent data={data} setData={setData} />
      </main>

      <div className={styles.bottomButtonContainer}>
        <button
          className={`${styles.button} ${styles.cancelButton}`}
          onClick={handleCancel}
        >
          취소
        </button>
        <button
          className={`${styles.button} ${styles.saveButton}`}
          onClick={handleSave}
        >
          저장
        </button>
      </div>
    </div>
  );
}
