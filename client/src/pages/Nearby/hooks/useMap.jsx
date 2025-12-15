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
    if (mapRef.current || !mapElement || !window.naver?.maps) return;
    if (lat === null || lng === null) return;

    const map = new naver.maps.Map(mapElement, {
      center: new naver.maps.LatLng(lat, lng),
      zoom: zoomLevel,
    });
    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
