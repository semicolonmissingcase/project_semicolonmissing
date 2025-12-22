import React, { useState } from 'react';
import './MyPage.css';
import Estimates from './Estimates.jsx'; // 받은견적
import Reservations from './Reservations.jsx'; // 예약내역
import MyReviews from './MyReviews.jsx'; // 내 리뷰
import FavoriteCleaner from './FavoriteCleaner.jsx'; // 찜한 기사님
import InquiryHistory from './InquiryHistory.jsx' // 문의내역

export default function OwnerPage() {
  const [activeTab, setActiveTab] = useState('받은 견적');

  const renderTabContent = () => {
    switch (activeTab) {
      case '받은 견적': return <Estimates />;
      case '예약내역': return <Reservations />;
      case '내 리뷰': return <MyReviews />;
      case '찜한 기사님': return <FavoriteCleaner />;
      case '문의내역': return <InquiryHistory />;
      // 예약 내역 등 다른 탭도 추가 가능
      default: return <div style={{padding: '20px'}}>준비 중인 페이지입니다.</div>;
    }
  };

  return (
    <div className="owner-page-container">
      {/* 1. 상단 프로필 (이전 코드와 동일) */}
      <header className="profile-header">
        <button className="edit-info-btn">회원정보 수정</button>
        <div className="profile-main">
          <div className="profile-image-container">
            <div className="profile-placeholder-img">🧊</div>
            <button className="profile-edit-badge">✎</button>
          </div>
          <div className="profile-info">
            <h2>OOO 점주님</h2>
            <p>admin@admin.com</p>
          </div>
        </div>
        <div className="stats-container">
          <div className="stat-item"><span>이용 횟수</span><strong>10</strong></div>
          <div className="stat-item"><span>리뷰 갯수</span><strong>5</strong></div>
          <div className="stat-item"><span>견적 요청</span><strong>1</strong></div>
          <div className="stat-item"><span>받은 견적</span><strong>5</strong></div>
        </div>
      </header>

      {/* 2. 탭 메뉴 */}
      <nav className="tabs">
        {['받은 견적', '예약 완료', '내 리뷰', '찜한 기사님', '문의 내역'].map(tab => (
          <button 
            key={tab}
            className={`tab-item ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* 3. 동적 컨텐츠 렌더링 */}
      <div className="tab-content-wrapper">
        {renderTabContent()}
      </div>
    </div>
  );
};