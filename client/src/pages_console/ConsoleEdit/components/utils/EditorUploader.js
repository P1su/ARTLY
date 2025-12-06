import { userInstance } from '../../../../apis/instance';
import { useAlert } from '../../../../store/AlertProvider';

export async function uploadEditorImage(file) {
  const { showAlert } = useAlert();

  try {
    const formData = new FormData();
    formData.append('image', file);

    const res = await userInstance.post('/api/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return res.data.url;
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    showAlert('이미지 업로드 중 오류가 발생했습니다.');
    return null;
  }
}
