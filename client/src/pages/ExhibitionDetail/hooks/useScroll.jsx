import { useEffect, useState } from 'react';

export default function useScroll() {
  const initialBarPosition = 200;
  const [barPosition, setBarPosition] = useState(initialBarPosition);

  const handleScroll = () => {
    const position =
      1000 < initialBarPosition + window.scrollY
        ? 1000
        : initialBarPosition + window.scrollY;
    setBarPosition(position);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return barPosition;
}
