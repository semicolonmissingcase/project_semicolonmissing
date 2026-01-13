import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; 
import { format } from 'date-fns'; 

import { getTodayJobs, getPendingJobs, getSettlementSummary } from '../../../api/axiosCleaner.js'; 

import ReservationCompletedList from './ReservationCompletedList.jsx';
import TodayJobList from './TodayJobList.jsx';
import CleanersInquiries from './CleanersInquiries.jsx';
import CleanersReview from './CleanersReview.jsx';
import SettlementMain from './SettlementMain.jsx';

import './CleanersMyPage.css';

function CleanersMyPage() {
  const [activeTab, setActiveTab] = useState(''); 
  const [todayCount, setTodayCount] = useState(0); 
  const [reservationCount, setReservationCount] = useState(0); 
  const [totalSettlement, setTotalSettlement] = useState(0); 

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const initData = async () => {
      try {
        const [todayRes, pendingRes, settlementRes] = await Promise.all([
          getTodayJobs(),
          getPendingJobs(),
          getSettlementSummary() 
        ]);

        if (todayRes.data.success && pendingRes.data.success && settlementRes.data.success) {
          const todayJobs = Array.isArray(todayRes.data.data) ? todayRes.data.data : [];
          const pendingJobs = Array.isArray(pendingRes.data.data) ? pendingRes.data.data : [];
          
          setTodayCount(todayJobs.length);

          const allJobs = [...todayJobs, ...pendingJobs];
          const todayStr = format(new Date(), 'yyyy-MM-dd');
          const newReservations = allJobs.filter(job => 
            (job.createdAt || job.created_at || '').substring(0, 10) === todayStr
          );
          setReservationCount(newReservations.length);

          const sData = settlementRes.data.data;
          if (sData && sData.summary && sData.summary.completed !== undefined) {
            setTotalSettlement(sData.summary.completed);
          } else {
            setTotalSettlement(0);
          }

          // 초기 탭 설정
          if (todayJobs.length > 0) {
            setActiveTab('오늘 일정');
          } else {
            setActiveTab('대기 작업');
          }
        }
      } catch (error) {
        console.error("데이터 로딩 오류:", error);
        setActiveTab('대기 작업');
      }
    };

    initData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount || 0) + '원';
  };

  const renderTabContent = () => {
    if (!activeTab) return <div className="tab-placeholder">로딩 중...</div>;

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
      <header className="cleanermypage-profile-header">
        <button className="cleanermypage-edit-info-btn" onClick={() => navigate('/cleaners/infoedit')}>
          정보 수정
        </button>
        <div className="cleanermypage-profile-main">
          <div className="cleanermypage-profile-image-container">
            <div 
              className="cleanermypage-profile-placeholder-img" 
              style={{ backgroundImage: `url(${user?.profile || '/icons/default-profile.png'})`, backgroundSize: 'cover' }}
            ></div>            
            <button type='button' className="cleanermypage-profile-edit-badge" onClick={() => navigate('/cleaners/profileedit')}></button>
          </div>
          <div className="cleanermypage-info-container">
            <div className="cleanermypage-profile-info">
              <p className="cleanermypage-welcome">안녕하세요, {user?.name || '기사'} 기사님!</p>
              <h4 className="cleanermypage-total-amount">
                총 정산금액: <span>{formatCurrency(totalSettlement)}</span>
              </h4>
              <div className="cleanermypage-today-summary">
                <p>오늘의 의뢰 건수: <strong>{todayCount}건</strong></p>
                <p>오늘의 예약 건수: <strong>{reservationCount}건</strong></p>
              </div>
            </div>
          </div>
        </div>
      </header>

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

      <div className="cleanermypage-tab-content-wrapper">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default CleanersMyPage;