import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { userInstance } from '../../../apis/instance.js';

export const useEditData = (type, id, isCreateMode, config) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
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

        if (type === 'exhibitions' && !isCreateMode) {
          initialData._originalArtworks = [...(initialData.artworks || [])];
          initialData._originalArtists = [...(initialData.artists || [])];
        }

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
          } catch (error) {
            console.error('전시회 목록 로딩 실패:', error);
            initialData.exhibitions = [];
          }
        }

        setData(initialData);
      } catch (error) {
        console.error('데이터 초기화 실패:', error);
        alert('데이터를 불러오지 못했습니다.');
        navigate(`/console/${type}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (config) initData();
  }, [type, id, isCreateMode, config, searchParams, navigate]);

  return { data, setData, isLoading };
};
