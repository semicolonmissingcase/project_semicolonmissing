import "./TodayJobList.css";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function TodayJobList() {
  // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // 카카오맵 열기 함수
  function openKakaoMap(location) {
    // 카카오맵 URL 스킴 (모바일 앱 우선, 없으면 웹)
    // 매장 이름이나 주소로 검색하기 때문에 매장이름 앞에 넣는 게 나아보이는데 체크해주세요.
    const kakaoMapUrl = `kakaomap://search?q=${encodeURIComponent(location)}`;
    const webMapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(location)}`;
    
    // 모바일에서 앱 열기 시도
    window.location.href = kakaoMapUrl;
    
    // 앱이 설치되어 있지 않으면 웹으로 이동 (2초 후)
    setTimeout(() => {
      window.open(webMapUrl, '_blank');
    }, 2000);
  }

  return (
    <div className="todayJobList-container">
      {/* 오늘 날짜 표시 */}
      <h2 className="todayJobList-date">{getTodayDate()}</h2>

      {/* 작업 목록 카드 */}
      <div className="todayJobList-cards ">        
        <div  className="todayJobList-card card-shadow">
          {/* 매장명 */}
          <div className="todayJobList-card-row">
            <span className="todayJobList-card-label">매장명</span>
            <span className="todayJobList-card-value">스벅동성로</span>
          </div>

          {/* 시간 */}
          <div className="todayJobList-card-row">
            <span className="todayJobList-card-label">시간</span>
            <span className="todayJobList-card-value">12:00</span>
          </div>

          {/* 위치 */}
          <div className="todayJobList-card-row">
            <span className="todayJobList-card-label">위치</span>
            <span className="todayJobList-card-value">대구 광역시 중구 어쩌구</span>
            <FaMapMarkerAlt style={{ fontSize: '1rem', color: '#7C7F88' }}
              onClick={openKakaoMap}
            />
          </div>

          {/* 점주 이름 */}
          <div className="todayJobList-card-row">
            <span className="todayJobList-card-label">점주</span>
            <span className="todayJobList-card-value">신세계</span>
          </div>
        </div>          
      </div>
    </div>
  );
}