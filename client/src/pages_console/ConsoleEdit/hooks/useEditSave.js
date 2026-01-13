import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { userInstance } from '../../../apis/instance.js';
import { useAlert } from '../../../store/AlertProvider.jsx';
import { useUser } from '../../../store/UserProvider.jsx';

const getId = (item) => item.id || item.artist_id;

export const useEditSave = (type, id, isCreateMode, config, data, navigate) => {
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const { showAlert } = useAlert();
  const { user } = useUser();
  const [searchParams] = useSearchParams();

  const validate = () => {
    if (type === 'artworks') {
      if (!data.art_title) return '작품명을 입력해주세요.';
      if (!data.artist_id) return '작가를 선택해주세요.';
      if (isCreateMode && !selectedImageFile) {
        return '작품 이미지를 업로드해주세요.';
      }
    }
    if (type === 'galleries' && !data.gallery_name)
      return '갤러리명을 입력해주세요.';
    if (type === 'exhibitions') {
      if (isCreateMode && !data.gallery_id) return '갤러리 정보가 없습니다.';
      if (!data.exhibition_title) return '전시회명을 입력해주세요.';
    }
    if (type === 'artists' && !data.artist_name) return '작가명을 입력해주세요.';
    if (type === 'announcements') {
      if (!data.announcement_title) return '공고 제목을 입력해주세요.';
      if (!data.announcement_category) return '카테고리를 선택해주세요.';
      if (!data.announcement_start_datetime) return '시작일을 입력해주세요.';
      if (!data.announcement_end_datetime) return '종료일을 입력해주세요.';
    }
    return null;
  };

  const createFormData = () => {
    const formData = new FormData();
    if (!isCreateMode) formData.append('_method', 'PATCH');

    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (
        [
          'artists',
          'artworks',
          '_originalArtworks',
          '_originalArtists',
        ].includes(key)
      )
        return;

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

    return formData;
  };

  const createAnnouncementFormData = () => {
    const formData = new FormData();

    if (!isCreateMode) {
      formData.append('_method', 'PUT');
    }
    
    formData.append('announcement_title', data.announcement_title || '');
    formData.append('user_id', user?.id || '');
    formData.append('announcement_start_datetime', data.announcement_start_datetime || '');
    formData.append('announcement_end_datetime', data.announcement_end_datetime || '');
    formData.append('announcement_organizer', data.announcement_organizer || '');
    formData.append('announcement_contact', data.announcement_contact || '');
    formData.append('announcement_support_detail', data.announcement_support_detail || '');
    formData.append('announcement_site_url', data.announcement_site_url || '');
    formData.append('announcement_attachment_url', data.announcement_attachment_url || '');
    formData.append('announcement_content', data.announcement_content || '');
    formData.append('announcement_category', data.announcement_category || '');
    
    if (selectedImageFile) {
      formData.append('announcement_poster_file', selectedImageFile);
    }
    
    return formData;
  };
  
  const handleExhibitionConnections = async (savedId) => {
    const currentArtworks = data.artworks || [];
    const originalArtworks = data._originalArtworks || [];

    const artsToAdd = currentArtworks.filter(
      (c) => !originalArtworks.some((o) => getId(o) === getId(c)),
    );
    const artsToDelete = originalArtworks.filter(
      (o) => !currentArtworks.some((c) => getId(c) === getId(o)),
    );

    const artPromises = [
      ...artsToAdd.map((art) =>
        userInstance.post(`/api/exhibitions/${savedId}/arts`, {
          art_id: getId(art),
          display_order: 0,
        }),
      ),
      ...artsToDelete.map((art) =>
        userInstance.delete(`/api/exhibitions/${savedId}/arts/${getId(art)}`),
      ),
    ];

    const currentArtists = data.artists || [];
    const originalArtists = data._originalArtists || [];

    const artistsToAdd = currentArtists.filter(
      (c) => !originalArtists.some((o) => getId(o) === getId(c)),
    );
    const artistsToDelete = originalArtists.filter(
      (o) => !currentArtists.some((c) => getId(c) === getId(o)),
    );

    const newArtistIds = artistsToAdd.map((a) => getId(a)).filter(Boolean);

    const artistAddPromise =
      newArtistIds.length > 0
        ? userInstance.post(`/api/exhibitions/${savedId}/artists`, {
            artist_ids: newArtistIds,
          })
        : Promise.resolve();

    const artistDeletePromises = artistsToDelete.map((a) =>
      userInstance.delete(`/api/exhibitions/${savedId}/artists/${getId(a)}`),
    );

    try {
      await Promise.all([
        ...artPromises,
        artistAddPromise,
        ...artistDeletePromises,
      ]);
      console.log(
        `업데이트 완료: 작품(추가${artsToAdd.length}/삭제${artsToDelete.length}), 작가(추가${artistsToAdd.length}/삭제${artistsToDelete.length})`,
      );
    } catch (err) {
      console.error('연결 데이터 업데이트 실패:', err);
      showAlert('연결 데이터 저장 중 일부 오류가 발생했습니다.');
    }
  };

  const handleArtworkConnections = async (savedArtId) => {
    const urlExhibitionId =
      searchParams.get('exhibition_id') || data.exhibition_id;

    const selectedList = data.selected_exhibition_ids || [];

    const targets = new Set([...selectedList]);

    if (urlExhibitionId) {
      targets.add(Number(urlExhibitionId));
    }

    console.log('최종 연결할 전시회 IDs:', Array.from(targets));

    if (targets.size > 0 && savedArtId) {
      const promises = Array.from(targets).map((exId) =>
        userInstance.post(`/api/exhibitions/${exId}/arts`, {
          art_id: savedArtId,
          display_order: 0,
        }),
      );
      await Promise.all(promises);
    }
  };

  const handleSave = async () => {
    if (isSaving || !data) return;

    const errorMsg = validate();
    if (errorMsg) return showAlert(errorMsg);

    setIsSaving(true);

    try {
      // ✅ 디버깅 로그
      console.log('📤 보내는 data:', data);

      let response;

      if (type === 'announcements') {
        const announcementData = createAnnouncementFormData();
        
        if (isCreateMode) {
          response = await userInstance.post('/api/announcements', announcementData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } else {
          response = await userInstance.post(`/api/announcements/${id}`, announcementData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
      } else if (isCreateMode) {
        const formData = createFormData();
        
        // ✅ FormData 내용 확인
        for (let [key, value] of formData.entries()) {
          console.log(`📦 FormData: ${key} =`, value);
        }
        
        response = await userInstance.post(config.apiUrl(id), formData);
      } else if (type === 'artists') {
        const formData = new FormData();

        formData.append('_method', 'PUT');

        if (data.artist_name) formData.append('artist_name', data.artist_name);
        if (data.artist_category) formData.append('artist_category', data.artist_category);
        if (data.artist_nation) formData.append('artist_nation', data.artist_nation);
        if (data.artist_description) formData.append('artist_description', data.artist_description);
        if (data.artist_homepage) formData.append('artist_homepage', data.artist_homepage);
        if (selectedImageFile) formData.append('artist_image', selectedImageFile);
      
        response = await userInstance.post(config.apiUrl(id), formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        const formData = createFormData();

        console.log('📦 수정 FormData:');
        for (let [key, value] of formData.entries()) {
          console.log(`  ${key} =`, value);
        }

        response = await userInstance.post(config.apiUrl(id), formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      console.log('📦 서버 응답:', response.data);
      const savedId = isCreateMode
        ? response.data.data?.id || response.data.id
        : id;

      if (type === 'exhibitions' && savedId) {
        await handleExhibitionConnections(savedId);
      } else if (type === 'artworks') {
        await handleArtworkConnections(savedId);
      }

      showAlert(
        isCreateMode
          ? `${type === 'galleries' ? '갤러리가' : type === 'exhibitions' ? '전시회가' : type === 'artists' ? '작가가' : type === 'announcements'
          ? '공고가' : '작품이'} 등록되었습니다.`
          : '수정되었습니다.',
      );

      const tabName =
        type === 'galleries'
          ? '갤러리관리'
          : type === 'exhibitions'
            ? '전시회관리'
            : type === 'artists'
              ? '작가관리'
              : type === 'announcements'
                ? '공고관리'  
                : '작품관리';
      if (isCreateMode) {
        navigate('/console/main', { state: { activeTab: tabName } });
      } else {
        navigate(`/console/${type}/${id}`);
      }
    } catch (error) {
      console.error('저장 오류:', error);
      showAlert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return { handleSave, isSaving, setSelectedImageFile };
};