import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

export default function useImageUpload() {
  const [imageList, setImageList] = useState([]);
  const [coverImage, setCoverImage] = useState(null);

  // 이미지 파일 선택 (내지용 - 여러 개)
  const handleImageChange = (e) => {
    const fileList = Array.from(e.target.files);
    const imagePromiseList = fileList.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            file,
            url: e.target.result,
            name: file.name
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromiseList).then(newImageList => {
      setImageList(prev => [...prev, ...newImageList]);
      // 파일 입력 필드 초기화
      e.target.value = '';
    });
  };

  // 이미지 제거 (내지용)
  const handleRemoveImage = (index) => {
    setImageList(prev => prev.filter((_, i) => i !== index));
  };

  // 표지 이미지 설정
  const setCoverImageFromFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setCoverImage({
        file,
        url: e.target.result,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  // 파일 선택 다이얼로그 열기 (표지용)
  const openFileDialogForCover = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setCoverImageFromFile(file);
      }
    };
    input.click();
  };

  // 파일 선택 다이얼로그 열기 (내지용)
  const openFileDialogForInner = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = handleImageChange;
    input.click();
  };

  // 드래그 앤 드롭으로 이미지 처리
  const handleDrop = (acceptedFileList, type = 'inner') => {
    const imagePromiseList = acceptedFileList.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            file,
            url: e.target.result,
            name: file.name
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromiseList).then(newImageList => {
      if (type === 'cover') {
        // 첫 번째 이미지만 표지로 설정
        if (newImageList.length > 0) {
          setCoverImage(newImageList[0]);
        }
      } else {
        // 내지에 추가
        setImageList(prev => [...prev, ...newImageList]);
      }
    });
  };

  // 표지용 드래그 앤 드롭 설정
  const coverDropzone = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false,
    onDrop: (acceptedFileList) => handleDrop(acceptedFileList, 'cover'),
    onDropRejected: (rejectedFileList) => {
      console.log('표지 이미지 업로드 실패:', rejectedFileList);
    }
  });

  // 내지용 드래그 앤 드롭 설정
  const innerDropzone = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true,
    onDrop: (acceptedFileList) => handleDrop(acceptedFileList, 'inner'),
    onDropRejected: (rejectedFileList) => {
      console.log('내지 이미지 업로드 실패:', rejectedFileList);
    }
  });

  return {
    imageList,
    setImageList,
    coverImage,
    setCoverImage,
    handleImageChange,
    handleRemoveImage,
    openFileDialogForCover,
    openFileDialogForInner,
    // 드래그 앤 드롭 관련
    coverDropzone,
    innerDropzone,
    handleDrop
  };
}

