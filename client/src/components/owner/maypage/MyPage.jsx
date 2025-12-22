import React, { useState } from 'react';
import './MyPage.css';
import Estimates from './Estimates.jsx'; // 받은견적
import Reservations from './Reservations.jsx'; // 예약내역
import MyReviews from './MyReviews.jsx'; // 내 리뷰
import FavoriteCleaner from './FavoriteCleaner.jsx'; // 찜한 기사님
import InquiryHistory from './InquiryHistory.jsx' // 문의내역
import { useNavigate } from 'react-router-dom';

export default function OwnerPage() {
  const [activeTab, setActiveTab] = useState('받은 견적');
  const navigate = useNavigate();

  function userInfo() {
    navigate('/owners/info');
  }

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
    <div className="owner-mypage-container">
      {/* 1. 상단 프로필 (이전 코드와 동일) */}
      <header className="owner-mypage-profile-header">
        <button className="owner-mypage-edit-info-btn" onClick={userInfo}>회원정보 수정</button>
        <div className="owner-mypage-profile-main">
          <div className="owner-mypage-profile-image-container">
            <div className="owner-mypage-profile-placeholder-img" style={{ backgroundImage: `url('/icons/default-profile.png')` }}></div>
            <button className="owner-mypage-profile-edit-badge"></button>
          </div>
            <div className="owner-mypage-info-container">
            <div className="owner-mypage-profile-info">
              <h2>OOO 점주님</h2>
              <p>admin@admin.com</p>
            </div>
            <div className="owner-mypage-stats-container">
              <div className="owner-mypage-stat-item"><span>이용 횟수</span><strong>10</strong></div>
              <div className="owner-mypage-stat-item"><span>리뷰 갯수</span><strong>5</strong></div>
              <div className="owner-mypage-stat-item"><span>견적 요청</span><strong>1</strong></div>
              <div className="owner-mypage-stat-item"><span>받은 견적</span><strong>5</strong></div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. 탭 메뉴 */}
      <nav className="owner-mypage-tabs">
        {['받은 견적', '예약 완료', '내 리뷰', '찜한 기사님', '문의 내역'].map(tab => (
          <button 
            key={tab}
            className={`owner-mypage-tab-item ${activeTab === tab ? 'owner-mypage-active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* 3. 동적 컨텐츠 렌더링 */}
      <div className="owner-mypage-tab-content-wrapper">
        {renderTabContent()}
      </div>
    </div>
  );
};