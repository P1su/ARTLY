import { useState, useEffect } from 'react';

const useImage = () => {
  const [image, setImage] = useState('');

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    if (image) {
      URL.revokeObjectURL(image);
    }

    const fileObject = URL.createObjectURL(file);

    setImage(fileObject);
  };

  return { image, handleImage };
};

export default useImage;
