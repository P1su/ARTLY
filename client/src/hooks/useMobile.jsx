import { useEffect } from 'react';

const useMobile = () => {
  const setScreenSize = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    const windowWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
<<<<<<< HEAD
    const maxWidth = Math.min(375, windowWidth);
=======
    const maxWidth = Math.min(360, windowWidth);
>>>>>>> main
    document.documentElement.style.setProperty('max-width', `${maxWidth}px`);
  };

  useEffect(() => {
    setScreenSize();
    window.addEventListener('resize', setScreenSize);

    return () => {
      window.removeEventListener('resize', setScreenSize);
    };
  }, []);
};

export default useMobile;
