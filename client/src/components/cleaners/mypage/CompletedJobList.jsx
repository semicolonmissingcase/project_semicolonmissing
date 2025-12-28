import './CompletedJobList.css';
import { FaMapMarkerAlt } from "react-icons/fa";

// 작업완료
export default function CompletedJobList() {
  // 카카오맵 열기 함수
  function openKakaoMap(location) {
    // 카카오맵 URL 스킴 (모바일 앱 우선, 없으면 웹)
    // 매장 이름이나 주소로 검색하기 때문에 매장이름 앞에 넣는 게 나아보이는데 체크해주세요.
    // >> 제 생각에도 그렇게 하는 게 나을 것 같아서 수정했습니다!
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
    <div className="completedjoblist-container">
      {/* 작업 목록 카드 */}
      <div className="completedjoblist-cards">        
        <div  className="completedjoblist-card card-shadow">
          {/* 매장명 */}
          <div className="completedjoblist-card-row">
            <span className="completedjoblist-card-label">매장명</span>
              <div className="completedjoblist-card-place">
                <FaMapMarkerAlt style={{ fontSize: '1rem', color: '#7C7F88', cursor: "pointer" }}
                onClick={openKakaoMap}/>
                <span className="completedjoblist-card-value">스벅동성로</span>
              </div>
          </div>

          {/* 시간 */}
          <div className="completedjoblist-card-row">
            <span className="completedjoblist-card-label">시간</span>
            <span className="completedjoblist-card-value">12:00</span>
          </div>

          {/* 위치 */}
          <div className="completedjoblist-card-row">
            <span className="completedjoblist-card-label">위치</span>
            <span className="completedjoblist-card-value">대구 광역시 중구 어쩌구</span>
            
          </div>

          {/* 점주 이름 */}
          <div className="completedjoblist-card-row">
            <span className="completedjoblist-card-label">점주</span>
            <span className="completedjoblist-card-value">신세계</span>
          </div>
        </div>          
      </div>
    </div>
  );
}