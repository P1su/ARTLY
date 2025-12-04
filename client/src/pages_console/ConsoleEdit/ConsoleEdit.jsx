import styles from './ConsoleEdit.module.css';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
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

  // 변경 사항 비교(Diff)를 위한 원본 데이터 저장소
  const originalArtworksRef = useRef([]);
  const originalArtistsRef = useRef([]);

  const isCreateMode = id === 'new';
  const config = EDIT_CONFIG[type];
  const FormComponent = FORM_COMPONENTS[type];

  // 헬퍼: 작가 ID 추출 (서버: id / 모달: artist_id)
  const getId = (item) => item.id || item.artist_id;

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

        // [전시회] 작가 및 작품 원본 데이터 보존
        if (type === 'exhibitions' && !isCreateMode) {
          // 작품
          const loadedArtworks = initialData.artworks || [];
          originalArtworksRef.current = loadedArtworks;

          // 작가 (필드명 artists 사용)
          const loadedArtists = initialData.artists || [];
          originalArtistsRef.current = loadedArtists;

          console.log(
            `초기 로딩: 작품 ${loadedArtworks.length}개, 작가 ${loadedArtists.length}명`,
          );
        }

        // [작품] 전시회 목록 로딩
        if (type === 'artworks' && targetGalleryId) {
          try {
            const exhResponse = await userInstance.get(
              `/api/exhibitions?gallery_id=${targetGalleryId}`,
            );
            initialData.exhibitions = Array.isArray(exhResponse.data)
              ? exhResponse.data
              : [];

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

    // 간단 유효성 검사
    if (type === 'artworks' && !data.art_title)
      return alert('작품명을 입력해주세요.');
    if (type === 'galleries' && !data.gallery_name)
      return alert('갤러리명을 입력해주세요.');
    if (type === 'exhibitions') {
      if (isCreateMode && !data.gallery_id)
        return alert('갤러리 정보가 없습니다.');
      if (!data.exhibition_title) return alert('전시회명을 입력해주세요.');
    }

    setIsSaving(true);

    try {
      const formData = new FormData();
      if (!isCreateMode) formData.append('_method', 'PATCH');

      // 데이터 순회하며 FormData 구성
      Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        // artists, artworks는 별도 API로 처리하므로 FormData에서 제외 (백엔드가 무시하면 보내도 무관)
        if (key === 'artists' || key === 'artworks') return;

        if (key === 'gallery_sns' && Array.isArray(value)) {
          const validSns = value.filter((sns) => sns.type !== 'twitter');
          formData.append(key, JSON.stringify(validSns));
          return;
        }

        if (typeof value === 'object' && !(value instanceof File)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      if (!formData.has('gallery_id')) {
        const galleryId = data.gallery_id || data.gallery?.id;
        if (galleryId) formData.append('gallery_id', galleryId);
      }

      if (selectedImageFile) {
        formData.append(config.formImageField, selectedImageFile);
      }

      // 1. 메인 저장 API 호출
      const url = config.apiUrl(id);
      const response = await userInstance.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const savedId = isCreateMode
        ? response.data.data?.id || response.data.id
        : id;

      // 2. [전시회] 작품 및 작가 연결 업데이트 (Diff 방식)
      if (type === 'exhibitions' && savedId) {
        // --- A. 작품 (Artworks) ---
        const currentArtworks = data.artworks || [];
        const originalArtworks = originalArtworksRef.current || [];

        const artsToAdd = currentArtworks.filter(
          (c) => !originalArtworks.some((o) => getId(o) === getId(c)),
        );
        const artsToDelete = originalArtworks.filter(
          (o) => !currentArtworks.some((c) => getId(c) === getId(o)),
        );

        try {
          const addPromises = artsToAdd.map((art) =>
            userInstance.post(`/api/exhibitions/${savedId}/arts`, {
              art_id: getId(art),
              display_order: 0,
            }),
          );
          const deletePromises = artsToDelete.map((art) =>
            userInstance.delete(
              `/api/exhibitions/${savedId}/arts/${getId(art)}`,
            ),
          );

          await Promise.all([...addPromises, ...deletePromises]);
          console.log(
            `작품 업데이트: 추가 ${artsToAdd.length}, 삭제 ${artsToDelete.length}`,
          );
        } catch (err) {
          console.error('작품 업데이트 중 오류:', err);
        }

        // --- B. 작가 (Artists) ---
        const currentArtists = data.artists || [];
        const originalArtists = originalArtistsRef.current || [];

        const artistsToAdd = currentArtists.filter(
          (c) => !originalArtists.some((o) => getId(o) === getId(c)),
        );
        const artistsToDelete = originalArtists.filter(
          (o) => !currentArtists.some((c) => getId(c) === getId(o)),
        );

        try {
          // 추가 (ID 목록 추출 후 전송)
          const newArtistIds = artistsToAdd
            .map((a) => getId(a))
            .filter(Boolean);
          if (newArtistIds.length > 0) {
            await userInstance.post(`/api/exhibitions/${savedId}/artists`, {
              artist_ids: newArtistIds,
            });
          }

          // 삭제 (개별 DELETE 요청)
          const deleteArtistPromises = artistsToDelete.map((artist) => {
            return userInstance.delete(
              `/api/exhibitions/${savedId}/artists/${getId(artist)}`,
            );
          });

          await Promise.all(deleteArtistPromises);
          console.log(
            `작가 업데이트: 추가 ${artistsToAdd.length}, 삭제 ${artistsToDelete.length}`,
          );
        } catch (err) {
          console.error('작가 업데이트 중 오류:', err);
          alert('작가 목록 업데이트 중 일부 오류가 발생했습니다.');
        }
      }

      // 3. [작품] 전시회 연결 (기존 로직)
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
        }
      }

      alert(isCreateMode ? '등록되었습니다.' : '수정되었습니다.');
      handleAfterAction();
    } catch (error) {
      console.error('저장 오류:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (file) => setSelectedImageFile(file);

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
