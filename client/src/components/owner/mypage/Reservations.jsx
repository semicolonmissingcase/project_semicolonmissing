import React from 'react';
import './Reservations.css';
import { getAcceptedEstimatesByOwnerId } from '../../../api/axiosOwner.js';
import FavoriteButton from '../../commons/FavoriteBtn.jsx';
import { useEffect } from 'react';
import { useState } from 'react';

// 예약완료
export default function Reservations() {
  const [estimates, setEstimates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const APP_SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;

  useEffect(() => {
    const fetchEstimates = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAcceptedEstimatesByOwnerId();
        setEstimates(data);
      } catch (err) {
        console.error("예약 목록 불러오기 실패:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEstimates();
  }, []);

  if (loading) {
    return <div className="reservations-tab-container"><p>예약 목록을 불러오는 중...</p></div>;
  }
  if (error) {
    return <div className="reservations-tab-container"><p>예약 목록을 불러오는데 오류가 발생했습니다: {error.message}</p></div>;
  }
  if (!estimates || estimates.length === 0) {
    return (
      <div className="reservations-tab-container">
        <p className="reservations-no-items">아직 예약된 내역이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="reservations-tab-container">
      <p className="reservations-top-notice">지난 1년간의 예약 내역입니다.</p>
      
      <div className="reservations-list">
        {estimates.map((item) => (
          <div key={item.id} className="reservations-card">
            <div className="reservations-card-left">
              {/* 기사님 프로필 이미지 */}
              <div className="reservations-avatar-circle">
                <img 
                  src={item.cleanerProfile ? item.cleanerProfile : "/icons/default-profile.png"} 
                  alt={`${item.name} 기사님`} 
                  className="reservations-avatar-img" 
                />
              </div>
              
              <div className="reservations-info-content">
                <h4 className="reservations-driver-name">
                  {item.name}
                  <FavoriteButton cleanerId={item.cleanerId} initialIsFavorited={item.heart} />
                </h4>
                <p className="reservations-detail-text">{item.time}</p>
                <p className="reservations-detail-text">{item.store}</p>
                <p className="reservations-price-text">견적 금액 {item.price}원</p>
                <p className="reservations-detail-text">상태: {item.status}</p>
              </div>
            </div>

            <div className="reservations-card-right">
              <button className="reservations-btn-secondary">견적보기</button>
              
              {item.status === '승인' ? (
                <>
                  <button className="reservations-btn-danger">예약취소</button>
                </>
              ) : item.status === '완료' ? (
                <button className="bg-blue">기능고민중</button>
              ) : (
                <button className="reservations-btn-secondary" disabled>대기중</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}