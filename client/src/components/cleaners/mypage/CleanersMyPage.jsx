import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; 

// API 호출 함수 (경로에 맞춰 확인 필요)
import { getTodayJobs } from '../../../api/axiosCleaner.js';

// 출력 카드 컴포넌트
import ReservationCompletedList from './ReservationCompletedList.jsx';
import TodayJobList from './TodayJobList.jsx';
import CleanersInquiries from './CleanersInquiries.jsx';
import CleanersReview from './CleanersReview.jsx';
import SettlementMain from './SettlementMain.jsx';

import './CleanersMyPage.css';

function CleanersMyPage() {
  // 1. 초기 상태는 빈 문자열('')로 두어 로딩 상태를 관리합니다.
  const [activeTab, setActiveTab] = useState(''); 
  const navigate = useNavigate();
  
  // 리덕스에서 유저 정보 가져오기
  const { user } = useSelector((state) => state.auth);

  // 2. 컴포넌트 로드 시 오늘 일정을 체크하여 기본 탭 결정
  useEffect(() => {
    const initDefaultTab = async () => {
      try {
        const response = await getTodayJobs();
        // 오늘 일정 데이터가 존재하면 '오늘 일정', 없으면 '대기 작업'
        if (response.data.success && response.data.data.length > 0) {
          setActiveTab('오늘 일정');
        } else {
          setActiveTab('대기 작업');
        }
      } catch (error) {
        console.error("초기 탭 설정 중 오류 발생:", error);
        // 에러 발생 시 안전하게 '대기 작업'을 기본값으로 설정
        setActiveTab('대기 작업');
      }
    };

    initDefaultTab();
  }, []);

  // 금액 포맷팅 함수
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount || 0) + '원';
  };

  // 탭 콘텐츠 렌더링 함수
  const renderTabContent = () => {
    // 탭 결정 전(로딩 중) 처리
    if (!activeTab) {
      return <div className="tab-placeholder">일정을 확인하고 있습니다...</div>;
    }

    switch (activeTab) {
      case '정산 대기': return <SettlementMain />;
      case '대기 작업': return <ReservationCompletedList />;
      case '오늘 일정': return <TodayJobList />;
      case '문의 내역': return <CleanersInquiries />;
      case '리뷰 내역': return <CleanersReview />;
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
              <p className="cleanermypage-welcome">
                안녕하세요, {user?.name || '기사'} 기사님!
              </p>
              <h4 className="cleanermypage-total-amount">
                총 정산금액: <span>{formatCurrency(user?.totalSettlement || 0)}</span>
              </h4>
              <div className="cleanermypage-today-summary">
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