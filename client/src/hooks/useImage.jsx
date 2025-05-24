import { useState } from 'react';

const useImage = () => {
  const [image, setImage] = useState('');

  const handleImage = (e) => {
    if (image) {
      URL.revokeObjectURL(image);
    }

    const file = e.target.files[0];
    const fileObject = URL.createObjectURL(file);

    setImage(fileObject);
  };

  const revokeImage = () => {
    if (image) {
      URL.revokeObjectURL(image);
    }
  };
};

export default useImage;
