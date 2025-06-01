import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const useMap = (lat, lng, id, results, zoomLevel = 15) => {
  const mapRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.naver || !lat || !lng) {
      return;
    }

    const mapOptions = {
      center: new naver.maps.LatLng(lat, lng),
      zoom: zoomLevel,
    };

    if (!mapRef.current) {
      mapRef.current = new naver.maps.Map(id, mapOptions);
    } else {
      mapRef.current.panTo(new naver.maps.LatLng(lat, lng));
    }
    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(lat, lng),
      map: mapRef.current,
      title: '현재 위치',
    });

    if (results) {
      const markers = results.map(
        ({
          gallery_name: name,
          gallery_latitude: lat,
          gallery_longitude: lng,
          id,
        }) => {
          const position = new naver.maps.LatLng(lat, lng);
          const marker = new naver.maps.Marker({
            position,
            map: mapRef.current,
            title: name,
          });
        },
      );
    }
  });

  return mapRef;
};

export default useMap;
