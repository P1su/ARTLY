import { useEffect, useState } from 'react';
import { useAlert } from '../../../store/AlertProvider';

const useGeoLocation = () => {
  const [coords, setCoords] = useState({
    lat: 37.3595704,
    lng: 127.105399,
  });
  const { showAlert } = useAlert();

  const onSuccess = (position) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    setCoords({ lat: lat, lng: lng });
  };

  const onError = (error) => {
    showAlert(`에러코드(${error.code}): ${error.message}`);
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      showAlert('위치 정보를 파악할 수 없습니다!');
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
  }, []);

  return { coords, setCoords };
};

export default useGeoLocation;
