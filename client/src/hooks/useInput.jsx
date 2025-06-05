import { useState } from 'react';

const useInput = (initialData) => {
  const [data, setData] = useState(initialData);

  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return {
    data,
    handleChange,
    setData,
  };
};

export default useInput;
