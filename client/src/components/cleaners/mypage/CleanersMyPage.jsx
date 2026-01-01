import React, { useState } from 'react';
import './CleanersMyPage.css';
import { useNavigate } from 'react-router-dom';

// 출력 카드 컨포넌트
import ReservationCompletedList from './ReservationCompletedList.jsx';
import TodayJobList from './TodayJobList.jsx';
import CancelledJobList from './CancelledJobList.jsx';
import CompletedJobList from './CompletedJobList.jsx';
import CleanersSettlementStatus from "../CleanersSettlementStatus.jsx";

function CleanersMyPage () {
  const [activeTab, setActiveTab] = useState('정산 대기 건수');
  const navigate = useNavigate();

  const renderTabContent = () => {
    switch (activeTab) {
      case '정산': return <CleanersSettlementStatus />;
      case '예약 완료': return <ReservationCompletedList />;
      case '오늘 작업': return <TodayJobList />;
      case '문의 내역': return <CancelledJobList />;
      case '리뷰': return <CompletedJobList />
      default: return <div className="tab-placeholder">내용을 불러오는 중...</div>;
    }
  };

  // 네비게이션 경로
  function cleanerInfoPage() {
    navigate('/cleaners/infoedit');
  }

  function cleanerProfileEditPage() {
    navigate('/cleaners/profileedit')
  }

  return (
    <div className="cleanermypage-container">
      {/* 1. 상단 프로필 헤더 */}
      <header className="cleanermypage-profile-header">
        <button className="cleanermypage-edit-info-btn" onClick={cleanerInfoPage}>정보 수정</button>
        
        <div className="cleanermypage-profile-main">
          {/* 프로필 이미지 업로드 영역 */}
          <div className="cleanermypage-profile-image-container">
            <div 
              className="cleanermypage-profile-placeholder-img" 
              style={{ backgroundImage: `url('/icons/default-profile.png')` }}
            ></div>            
            <button type='button' 
              htmlFor="cleaner-profile-upload" 
              className="cleanermypage-profile-edit-badge"
              onClick={cleanerProfileEditPage}
            ></button>
          </div>

          {/* 기사님 전용 정보 영역 (image_326fcb 참고) */}
          <div className="cleanermypage-info-container">
            <div className="cleanermypage-profile-info">
              <p className="cleanermypage-welcome">안녕하세요, 김기사 기사님!</p>
              <h2 className="cleanermypage-total-amount">총 정산금액: <span>3,000,000원</span></h2>
              <div className="cleanermypage-today-summary">
                <p>오늘의 의뢰 건수: <strong>10건</strong></p>
                <p>오늘의 예약 건수: <strong>1건</strong></p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. 기사님 전용 탭 메뉴 */}
      <nav className="cleanermypage-tabs">
        {['예약 완료', '오늘 작업', '정산', '문의 내역', '리뷰'].map(tab => (
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