import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

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
    if (!window.naver || !lat || !lng) {
      return;
    }

    // 지도 초기 설정
    const mapOptions = {
      center: new naver.maps.LatLng(lat, lng),
      zoom: zoomLevel,
    };

    if (!mapRef.current) {
      // 지도 요소가 없을 경우 새롭게 지도 인스턴스 생성
      mapRef.current = new naver.maps.Map(id, mapOptions);
    } else {
      // 지도 요소가 이미 존재하는데 위, 경도 값이 바꼈을 경우 지도 이동
      mapRef.current.panTo(new naver.maps.LatLng(lat, lng));
    }

    // 현재 유저의 위치 마커
    if (title && location) {
      // title 존재할 경우 갤러리 혹은 전시회 마커
      const currentMarker = new naver.maps.Marker({
        position: new naver.maps.LatLng(lat, lng),
        map: mapRef.current,
        title: title,
        icon: {
          content: markerStyle(title, location),
        },
      });
      markersRef.current.push(currentMarker);
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

    // 클린업으로 기존 마커들을 삭제
    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, [lat, lng, results]);

  return mapRef;
};

export default useMap;
