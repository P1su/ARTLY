import { useState } from 'react';

const useInput = (initialData) => {
  const [data, setData] = useState(initialData);

  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64 = reader.result;

      setData((prev) => ({
        ...prev,
        [e.target.name]: base64,
      }));
    };
  };

  return {
    data,
    handleChange,
    handleImage,
  };
};

export default useInput;
