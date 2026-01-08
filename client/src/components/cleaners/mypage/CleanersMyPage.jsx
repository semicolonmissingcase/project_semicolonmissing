import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // 리덕스 연결
// 출력 카드 컴포넌트
import ReservationCompletedList from './ReservationCompletedList.jsx';
import TodayJobList from './TodayJobList.jsx';
import CleanersInquiries from './CleanersInquiries.jsx';
import CleanersReview from './CleanersReview.jsx';
import CleanersSettlementStatus from './CleanersSettlementStatus.jsx';
import './CleanersMyPage.css'

function CleanersMyPage() {
  const [activeTab, setActiveTab] = useState('오늘 작업'); // 초기 탭 설정
  const navigate = useNavigate();
  
  // 1. 리덕스에서 유저 정보 가져오기
  const { user } = useSelector((state) => state.auth);

  // 2. 금액 포맷팅 함수 (3,000,000원 형식)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount || 0) + '원';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '정산 대기': return <CleanersSettlementStatus />;
      case '대기 작업': return <ReservationCompletedList />;
      case '오늘 일정': return <TodayJobList />;
      case '문의 내역': return <CleanersInquiries />;
      case '리뷰 내역': return <CleanersReview />
      default: return <div className="tab-placeholder">내용을 불러오는 중...</div>;
    }
  };

  return (
    <div className="cleanermypage-container">
      {/* 1. 상단 프로필 헤더 */}
      <header className="cleanermypage-profile-header">
        <button className="cleanermypage-edit-info-btn" onClick={() => navigate('/cleaners/infoedit')}>
          정보 수정
        </button>
        
        <div className="cleanermypage-profile-main">
          <div className="cleanermypage-profile-image-container">
            <div 
              className="cleanermypage-profile-placeholder-img" 
              style={{ 
                backgroundImage: `url(${user?.profileImage || '/icons/default-profile.png'})`,
                backgroundSize: 'cover'
              }}
            ></div>            
            <button 
              type='button' 
              className="cleanermypage-profile-edit-badge"
              onClick={() => navigate('/cleaners/profileedit')}
            ></button>
          </div>

          <div className="cleanermypage-info-container">
            <div className="cleanermypage-profile-info">
              {/* 유저 이름 동적 표시 */}
              <p className="cleanermypage-welcome">
                안녕하세요, {user?.name || '김기사'} 기사님!
              </p>
              {/* 실제 정산 데이터가 있다면 user.totalSettlement 등으로 교체 */}
              <h4 className="cleanermypage-total-amount">
                총 정산금액: <span>{formatCurrency(user?.totalSettlement || 0)}</span>
              </h4>
              <div className="cleanermypage-today-summary">
                {/* 이 부분은 추후 API에서 받아온 데이터로 연결 */}
                <p>오늘의 의뢰 건수: <strong>{user?.todayWorks || 0}건</strong></p>
                <p>오늘의 예약 건수: <strong>{user?.todayReservations || 0}건</strong></p>
              </div>
            </div>
            
          </div>
        </div>
      </header>

      {/* 2. 기사님 전용 탭 메뉴 */}
      <nav className="cleanermypage-tabs">
        {['대기 작업', '오늘 일정', '정산 대기', '문의 내역', '리뷰 내역'].map(tab => (
          <button 
            key={tab}
            className={`cleanermypage-tab-item ${activeTab === tab ? 'cleanermypage-active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* 3. 컨텐츠 영역 */}
      <div className="cleanermypage-tab-content-wrapper">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default CleanersMyPage;