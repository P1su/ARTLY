import { userInstance } from '../../../../apis/instance';

// 이미지 압축 함수
async function compressImage(file, maxWidth = 1200, quality = 0.8) {
  return new Promise((resolve) => {
    // 이미 작은 파일이면 그대로 반환
    if (file.size < 500 * 1024) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          },
          'image/jpeg',
          quality
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export async function uploadEditorImage(file, showAlert) {
  try {
    const compressedFile = await compressImage(file);
    
    const formData = new FormData();
    formData.append('image', compressedFile);

    const res = await userInstance.post('/api/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return res.data.url;
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    if (showAlert) showAlert('이미지 업로드 중 오류가 발생했습니다.');
    return null;
  }
}