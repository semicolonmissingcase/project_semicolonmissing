import './Estimates.css';

// 받은 견적
export default function Estimates() {

  return (
    <div className="tab-container">
      <h3 className="tab-title">견적 요청 목록</h3>
      
      {/* 1. 상단 견적 요청 리스트 (가로형 카드) */}
      <div className="request-scroll-container">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="quote-request-card">
            <div className="req-header">매장이름A</div>
            <div className="req-body">
              <p>매장 주소</p>
              <p>날짜</p>
              <p>시간</p>
            </div>
            <button className="confirm-quote-btn">받은 견적 확인</button>
          </div>
        ))}
      </div>

      {/* 2. 매장 이름 구분선 */}
      <div className="store-selection-banner">매장이름A</div>

      {/* 3. 하단 기사님 견적 카드 (그리드) */}
      <div className="driver-quote-grid">
        {[1, 2].map((driver) => (
          <div key={driver} className="driver-selection-card">
            <div className="driver-profile-row">
              <div className="driver-avatar-small">🧊</div>
              <div className="driver-brief">
                <h4>OOO 기사님 ♡</h4>
                <p>리뷰 점수 / 작업 건수</p>
              </div>
            </div>
            <div className="quote-price-section">
              <span className="label">견적금액</span>
              <span className="price">150,000원</span>
            </div>
            <div className="card-action-row">
              <button className="btn-light">견적서 보기</button>
              <button className="btn-primary">채팅하기</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}