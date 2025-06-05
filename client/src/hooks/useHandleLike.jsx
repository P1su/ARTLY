import { useState } from 'react';
import { userInstance } from '../apis/instance.js';

const useHandleLike = () => {
  const [isLike, setIsLike] = useState('false');

  const handleLike = () => {
    const postGalleryLike = async () => {
      try {
        await userInstance.post('/api/likes', {
          liked_id: galleryId,
          liked_type: 'gallery',
        });
      } catch (error) {
        console.error(error);
        alert('좋아요 실패');
      }
    };

    const deleteGalleryLike = async () => {
      try {
        await userInstance.delete('/api/likes', {
          liked_id: galleryId,
          liked_type: 'gallery',
        });
      } catch (error) {
        console.error(error);
        alert('좋아요 실패');
      }
    };

    if (isLike) {
      deleteGalleryLike();
      setIsLike(false);
    } else {
      postGalleryLike();
      setIsLike(true);
    }
  };
};
