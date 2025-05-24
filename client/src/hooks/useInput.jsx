import { useState, useEffect } from 'react';

// 이미지 핸들링 로직 분리하기
const useInput = (initialData) => {
  const [data, setData] = useState(initialData);
  const [image, setImage] = useState('');

  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    if (image) {
      URL.revokeObjectURL(image);
    }

    const fileObject = URL.createObjectURL(file);

    setData((prev) => ({
      ...prev,
      [e.target.name]: fileObject,
    }));

    setImage(fileObject);
  };

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  return {
    data,
    handleChange,
    handleImage,
  };
};

export default useInput;
