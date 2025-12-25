import React, { useState } from 'react';
import './OwnerMyPage.css';
import Estimates from './Estimates.jsx'; // 받은견적
import Reservations from './Reservations.jsx'; // 예약내역
import MyReviews from './MyReviews.jsx'; // 내 리뷰
import FavoriteCleaner from './FavoriteCleaner.jsx'; // 찜한 기사님
import InquiryHistory from './InquiryHistory.jsx' // 문의내역
import { useNavigate } from 'react-router-dom';

export default function OwnerMyPage() {
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
            <input 
              type="file" 
              id="profile-upload" 
              style={{ display: 'none' }} 
              accept="image/*" 
              onChange={(e) => {
                // 파일 선택 시 실행될 로직
                console.log(e.target.files[0]);
              }}
            />

            {/* 연필 모양의 버튼 역할을 하는 label */}
            <label 
              htmlFor="profile-upload" 
              className="owner-mypage-profile-edit-badge"
            >
              {/* 아이콘이 배경이미지로 들어가 있다면 비워두셔도 됩니다 */}
            </label>
          </div>
            <div className="owner-mypage-info-container">
            <div className="owner-mypage-profile-info">
              <h2>OOO 점주님</h2>
              <p>admin@admin.com</p>
            </div>
            <div className="owner-mypage-stats-container">
              <div className="owner-mypage-stat-item"><p>이용 횟수</p><p>10</p></div>
              <div className="owner-mypage-stat-item"><p>리뷰 갯수</p><p>5</p></div>
              <div className="owner-mypage-stat-item"><p>견적 요청</p><p>1</p></div>
              <div className="owner-mypage-stat-item"><p>받은 견적</p><p>5</p></div>
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