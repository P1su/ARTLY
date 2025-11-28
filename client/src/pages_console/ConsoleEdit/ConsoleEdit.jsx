import styles from './ConsoleEdit.module.css';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { userInstance } from '../../apis/instance.js';

import GalleryEditForm from './forms/GalleryEditForm.jsx';
import ExhibitionEditForm from './forms/ExhibitionEditForm.jsx';
import ArtworkEditForm from './forms/ArtworkEditForm.jsx';

const EDIT_CONFIG = {
  galleries: {
    title: '갤러리 수정',
    apiUrl: (id) => (id === 'new' ? '/api/galleries' : `/api/galleries/${id}`),
    formImageField: 'gallery_image_file',
  },
  exhibitions: {
    title: '전시회 수정',
    apiUrl: (id) =>
      id === 'new' ? '/api/exhibitions' : `/api/exhibitions/${id}`,
    formImageField: 'exhibition_poster_file',
  },
  artworks: {
    title: '작품 수정',
    apiUrl: (id) => (id === 'new' ? '/api/arts' : `/api/arts/${id}`),
    formImageField: 'image',
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
  const [searchParams] = useSearchParams();

  const [data, setData] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const isCreateMode = id === 'new';
  const config = EDIT_CONFIG[type];
  const FormComponent = FORM_COMPONENTS[type];

  const getTabNameByType = (type) => {
    switch (type) {
      case 'galleries':
        return '갤러리관리';
      case 'exhibitions':
        return '전시회관리';
      case 'artworks':
        return '작품관리';
      default:
        return '갤러리관리';
    }
  };

  const handleAfterAction = () => {
    if (isCreateMode) {
      navigate('/console/main', {
        state: { activeTab: getTabNameByType(type) },
      });
    } else {
      navigate(`/console/${type}/${id}`);
    }
  };

  useEffect(() => {
    const initData = async () => {
      try {
        let initialData = {};
        let targetGalleryId = null;

        if (isCreateMode) {
          const exhibitionId = searchParams.get('exhibition_id');
          const galleryId = searchParams.get('gallery_id');

          if (exhibitionId) initialData.exhibition_id = exhibitionId;
          if (galleryId) initialData.gallery_id = galleryId;

          targetGalleryId = galleryId;
        } else {
          const response = await userInstance.get(config.apiUrl(id));
          initialData =
            typeof response.data === 'string'
              ? JSON.parse(response.data)
              : response.data;

          targetGalleryId = initialData.gallery_id;
        }
        if (type === 'artworks' && targetGalleryId) {
          try {
            console.log(
              `전시회 목록 로딩 시작 (Gallery ID: ${targetGalleryId})`,
            );

            const exhResponse = await userInstance.get(
              `/api/exhibitions?gallery_id=${targetGalleryId}`,
            );

            initialData.exhibitions = Array.isArray(exhResponse.data)
              ? exhResponse.data
              : [];

            console.log('불러온 전시회 개수:', initialData.exhibitions.length);

            if (!isCreateMode && initialData.exhibitions_connected) {
              initialData.selected_exhibition_ids =
                initialData.exhibitions_connected.map((ex) => ex.id);
            }
          } catch (exhError) {
            console.error('전시회 목록 로딩 실패:', exhError);
            initialData.exhibitions = [];
          }
        }

        setData(initialData);
      } catch (error) {
        console.error('데이터 초기화 실패:', error);
        alert('데이터를 불러오지 못했습니다.');
        navigate(`/console/${type}`);
      }
    };

    if (config) initData();
  }, [id, config, isCreateMode, searchParams, navigate, type]);

  const handleCancel = () => {
    if (window.confirm('수정을 취소하시겠습니까?')) {
      handleAfterAction();
    }
  };

  const handleSave = async () => {
    if (isSaving || !data) return;

    if (type === 'artworks') {
      if (!data.art_title) {
        alert('작품명을 입력해주세요.');
        return;
      }
    } else if (type === 'galleries') {
      if (!data.gallery_name) {
        alert('갤러리명을 입력해주세요.');
        return;
      }
    } /*if (type === 'exhibitions')*/ else {
      if (isCreateMode && !data.gallery_id) {
        alert('잘못된 접근입니다. 갤러리 정보가 없습니다.');
        return;
      }
      if (!data.exhibition_title) {
        alert('전시회명을 입력해주세요.');
        return;
      }
    }

    setIsSaving(true);

    try {
      const formData = new FormData();

      if (!isCreateMode) {
        formData.append('_method', 'PATCH');
      }

      const ignoredKeys = [
        'id',
        'created_at',
        'updated_at',
        'user_id',
        'artworks',
        'exhibitions',
        'reviews',
        'is_liked',
        'gallery',
        'artist_users',
        'artist',
        'selected_exhibition_ids',
      ];

      // 데이터 순회하며 FormData 구성
      Object.entries(data).forEach(([key, value]) => {
        if (ignoredKeys.includes(key)) return;
        if (value === undefined || value === null) return;

        // SNS 배열 처리
        if (key === 'gallery_sns' && Array.isArray(value)) {
          const validSns = value.filter((sns) => sns.type !== 'twitter');
          formData.append(key, JSON.stringify(validSns));
          return;
        }

        // 객체나 배열은 문자열로 변환, 파일이 아닌 경우만
        if (typeof value === 'object' && !(value instanceof File)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      // 이미지 파일이 선택되었다면 추가
      if (selectedImageFile) {
        formData.append(config.formImageField, selectedImageFile);
      }

      // 1. 메인 저장 API 호출 (작품/전시회/갤러리 생성 또는 수정)
      const url = config.apiUrl(id);
      const response = await userInstance.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('1단계 저장 성공:', response.data);

      // 2. [작품 관리일 경우] 선택된 전시회들에 연결하기 (2단계)
      if (type === 'artworks') {
        const savedArtId = isCreateMode
          ? response.data.data?.id || response.data.id
          : id;
        const selectedExhibitions = data.selected_exhibition_ids || [];

        if (selectedExhibitions.length > 0 && savedArtId) {
          const connectPromises = selectedExhibitions.map((exhibitionId) => {
            return userInstance.post(`/api/exhibitions/${exhibitionId}/arts`, {
              art_id: savedArtId,
              display_order: 0,
            });
          });

          await Promise.all(connectPromises);
          console.log(`2단계 전시회 ${selectedExhibitions.length}곳 연결 완료`);
        }
      }

      alert(isCreateMode ? '등록되었습니다.' : '수정되었습니다.');
      handleAfterAction();
    } catch (error) {
      console.error('저장 오류:', error);
      if (error.response) {
        console.log('서버 응답 메시지:', error.response.data);
        const msg =
          typeof error.response.data === 'object'
            ? error.response.data.message || JSON.stringify(error.response.data)
            : '서버 오류가 발생했습니다.';
        alert(`저장 실패: ${msg}`);
      } else {
        alert('저장 중 네트워크 오류가 발생했습니다.');
      }
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
