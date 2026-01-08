import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMarkerElement } from '../../../utils/createMarkerElement.jsx';

const useMap = ({ lat, lng, id, results, zoomLevel = 15, title, location }) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const navigate = useNavigate();

  // 1. 지도 생성 (변경 없음)
  useEffect(() => {
    const mapElement = document.getElementById(id);
    if (!mapElement || !window.naver?.maps || mapRef.current) return;
  
    const initMap = (lat, lng) => {
      const location = new window.naver.maps.LatLng(lat, lng);
      mapRef.current = new window.naver.maps.Map(id, {
        center: location,
        zoom: 16,
      });
      new window.naver.maps.Marker({ position: location, map: mapRef.current });
    };
  
    // 좌표가 있으면 바로 사용
    if (lat && lng) {
      initMap(lat, lng);
      return;
    }
  
    // 좌표 없으면 주소로 Geocoding
    if (location && window.naver.maps.Service) {
      window.naver.maps.Service.geocode({ query: location }, (status, res) => {
        if (status === window.naver.maps.Service.Status.OK && res.v2.addresses.length > 0) {
          const { x, y } = res.v2.addresses[0];
          initMap(parseFloat(y), parseFloat(x));
        }
      });
    }
  }, [id, lat, lng, location]);

  // 2. 마커 업데이트
  useEffect(() => {
    const map = mapRef.current;
    if (!map || lat === null || lng === null) return;

    const newCenter = new naver.maps.LatLng(lat, lng);
    map.setCenter(newCenter);

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // [핵심] CSS transform으로 위치를 잡기 때문에, JS 앵커는 무조건 0,0으로 고정
    const cssAnchor = new naver.maps.Point(0, 0);

    // A. 단일 마커
    if (title && location) {
      const customEl = createMarkerElement(title, false);
      const marker = new naver.maps.Marker({
        position: newCenter,
        map: map,
        title: title,
        icon: {
          content: customEl,
          anchor: cssAnchor, // (0, 0)
        },
      });
      markersRef.current.push(marker);
    }
    // B. 검색 결과 리스트 마커
    else if (results && results.length > 0) {
      results.forEach(
        ({
          gallery_name: name,
          gallery_latitude: rLat,
          gallery_longitude: rLng,
          is_liked: isLike,
          id,
        }) => {
          const customEl = createMarkerElement(name, isLike);
          const position = new naver.maps.LatLng(rLat, rLng);

          const marker = new naver.maps.Marker({
            position,
            map: map,
            title: name,
            icon: {
              content: customEl,
              anchor: cssAnchor, // (0, 0)
            },
          });

          naver.maps.Event.addListener(marker, 'click', () => {
            navigate(`/galleries/${id}`);
          });
          markersRef.current.push(marker);
        },
      );
    }
    // C. 현재 위치 마커
    else {
      const currentMarker = new naver.maps.Marker({
        position: newCenter,
        map: map,
        title: '현재 위치',
      });
      markersRef.current.push(currentMarker);
    }
  }, [lat, lng, results, title, location, zoomLevel, navigate]);

  return mapRef;
};

export default useMap;
