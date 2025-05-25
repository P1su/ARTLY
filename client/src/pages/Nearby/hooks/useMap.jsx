import { useEffect } from 'react';

const useMap = (lat, lng) => {
  useEffect(() => {
    if (!window.naver) {
      return;
    }
    const map = new naver.maps.Map('map', {
      center: new naver.maps.LatLng(lat, lng),
      zoom: 15,
    });
  });
};

export default useMap;
