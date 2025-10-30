import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// 지도 api 키 발급시 리팩토링 필요
const useMap = ({ lat, lng, id, results, zoomLevel = 15, title, location }) => {
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const markersRef = useRef([]);
  const markerStyle = (title, location) => `
                <div style="
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  width: 15rem;
                  height: 10rem;
                ">
                  <div style="
                    width: 2rem;
                    aspect-ratio: 1 / 1;
                    background-color: rgb(229, 115, 115);
                    border-radius: 50%;
                    border: 0.3rem solid white;
                    box-shadow: rgba(0, 0, 0, 0.3) 0 0.2rem 0.5rem;
                    margin-bottom: 0.5rem;
                  " >
                  </div>
                  <div style="
                    width: 100%;
                    padding: 0.8rem 1.2rem;
                    border-radius: 0.4rem;
                    background-color: #fff;
                    color: #333;
                    font-size: 1.4rem;
                    font-weight: 600;
                    text-align: center;
                  ">
                    ${title}
                    <div style="
                      padding-top: 1rem;
                      color: #666;
                      font-size: 1.2rem;
                      text-align: center;
                  ">${location}</div>
                  </div>
                </div>
              `;

  useEffect(() => {
    // 네이버 기능이 실행 가능하거나 위도, 경도가 있을 경우에만 동작작

    const mapElement = document.getElementById(id);
    if (!window.naver?.maps || !mapElement || lat == null || lng == null) {
      return; // 하나라도 준비되지 않았다면, 아무것도 하지 않고 즉시 종료
    }

    const map = new naver.maps.Map(mapElement, {
      center: new naver.maps.LatLng(lat, lng),
      zoom: zoomLevel,
    });
    mapRef.current = map;

    // --- 마커 관리 로직 개선 ---
    // 1. 기존에 있던 모든 마커를 지도에서 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = []; // 마커 배열 초기화

    // 2. 새로운 마커들을 생성하고 ref에 추가
    if (title && location) {
      new naver.maps.Marker({
        position: new naver.maps.LatLng(lat, lng),
        map: map,
        title: title,
        icon: { content: markerStyle(title, location) },
      });
    } else {
      // title 이 없을 경우 유저 위치 마커
      const currentMarker = new naver.maps.Marker({
        position: new naver.maps.LatLng(lat, lng),
        map: mapRef.current,
        title: '현재 위치',
      });
      markersRef.current.push(currentMarker);
    }

    if (results && results.length > 0) {
      // 검색 결과 배열이 존재할 경우 각 요소에 대한 마커 생성
      const markers = results.map(
        ({
          gallery_name: name,
          gallery_latitude: lat,
          gallery_longitude: lng,
          gallery_address: address,
          id,
        }) => {
          const position = new naver.maps.LatLng(lat, lng);
          const marker = new naver.maps.Marker({
            position,
            map: mapRef.current,
            title: name,
            icon: {
              content: markerStyle(name, address),
            },
          });

          // 마커 클릭 이벤트 부여
          naver.maps.Event.addListener(marker, 'click', () => {
            navigate(`/galleries/${id}`);
          });

          // 개별 마커를 ref에 삽입
          markersRef.current.push(marker);
        },
      );
    }
    return () => {
      const mapInstance = mapRef.current;

      // 1. 파괴할 지도 인스턴스가 존재하는가?
      // 2. 그 지도가 붙어있던 DOM 요소(map.getElement())가 아직 존재하는가?
      if (mapInstance && mapInstance.getElement()) {
        mapInstance.destroy();
      }
      mapRef.current = null;
    };
  }, [id, lat, lng, results, navigate, zoomLevel, title, location]);
  return mapRef;
};

export default useMap;
