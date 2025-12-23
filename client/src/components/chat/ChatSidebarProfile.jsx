import './ChatSidebarProfile.css'

// onClose props를 추가합니다.
const ChatSidebarProfile = ({ onClose }) => {
  const cleanerInfo = {
    name: "곽효선",
    location: "대구 달서구",
    price: 250000,
    description: "소형 제빙기 청소 전문 기사 곽효선입니다.",
    hireCount: 20,
    rating: 5.0,
    reviewCount: 12
  };

  return (
    <div className='ChatSidebarProfile-container'>
      <div className='ChatSidebarProfile-header'>
        <h3>프로필</h3>
        {/* 모바일에서만 보일 X 버튼 추가 */}
        <button className='ChatSidebarProfile-close-btn' onClick={onClose}>
          ✕
        </button>
      </div>

      <div className='ChatSidebarProfile-profile-section'>
        <div className='ChatSidebarProfile-avatar'></div>
        <div className='ChatSidebarProfile-info'>
          <div className='ChatSidebarProfile-top-row'>
            <div className='ChatSidebarProfile-name-group'>
              <span className='ChatSidebarProfile-name'>{cleanerInfo.name}</span>
              <span className='ChatSidebarProfile-location'>{cleanerInfo.location}</span>
            </div>
            
            <div className='ChatSidebarProfile-price-box'>
              <span className='ChatSidebarProfile-price-label'>예상금액</span>
              <span className='ChatSidebarProfile-price-value'>{cleanerInfo.price.toLocaleString()}원</span>
            </div>
          </div>
        </div>
      </div>

      <div className='ChatSidebarProfile-description'>
        <p>{cleanerInfo.description}</p>
      </div>

      <div className='ChatSidebarProfile-stats'>
        <div className='ChatSidebarProfile-stat-item'>
          <span className='ChatSidebarProfile-stat-label'>고용</span>
          <span className='ChatSidebarProfile-stat-value'>{cleanerInfo.hireCount}회</span>
        </div>
        <div className='ChatSidebarProfile-stat-item'>
          <span className='ChatSidebarProfile-stat-label'>리뷰</span>
          <span className='ChatSidebarProfile-stat-value'>⭐{cleanerInfo.rating}({cleanerInfo.reviewCount})</span>
        </div>
      </div>

      <div className='ChatSidebarProfile-review-preview'>
        <h4>리뷰 ⭐ 5.0 (12)</h4>
        <div className='ChatSidebarProfile-review-item'>
          <div className='ChatSidebarProfile-review-user'>박** ★ 5.0</div>
          <p>생각도 못 한 부분까지 꼼꼼하게 청소해 주셔서 너무 좋았습니다!</p>
        </div>
      </div>
    </div>
  )
}

export default ChatSidebarProfile;