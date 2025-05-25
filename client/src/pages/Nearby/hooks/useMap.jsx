import { useEffect, useRef } from 'react';

const useMap = (lat, lng) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.naver) {
      return;
    }

    if (!mapRef.current) {
      mapRef.current = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(lat, lng),
        zoom: 15,
      });
    } else {
      mapRef.current.panTo(new naver.maps.LatLng(lat, lng));
    }
  });

  return mapRef;
};

export default useMap;
