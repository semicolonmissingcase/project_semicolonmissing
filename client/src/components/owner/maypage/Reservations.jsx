import React from 'react';
import './Reservations.css';

export default function Reservations() {
  const reservationData = [
    {
      id: 1,
      name: "OOO 기사님",
      time: "2025-12-25 16:00 ~ 17:00",
      store: "A매장",
      price: "150,000",
      status: "upcoming", // 예약 예정
      heart: false
    },
    {
      id: 2,
      name: "OOO 기사님",
      time: "2025-10-25 16:00 ~ 17:00",
      store: "B매장",
      price: "150,000",
      status: "completed", // 작업 완료
      heart: false
    }
  ];

  return (
    <div className="reservations-tab-container">
      <p className="reservations-top-notice">지난 1년간의 예약 내역입니다.</p>
      
      <div className="reservations-list">
        {reservationData.map((item) => (
          <div key={item.id} className="reservations-card">
            <div className="reservations-card-left">
              {/* 기사님 프로필 이미지 */}
              <div className="reservations-avatar-circle">
                <img 
                  src="https://via.placeholder.com/100" 
                  alt="기사님" 
                  className="reservations-avatar-img" 
                />
              </div>
              
              <div className="reservations-info-content">
                <h4 className="reservations-driver-name">
                  {item.name} <span className="reservations-heart-icon">{item.heart ? '♥' : '♡'}</span>
                </h4>
                <p className="reservations-detail-text">{item.time}</p>
                <p className="reservations-detail-text">{item.store}</p>
                <p className="reservations-price-text">견적 금액 {item.price}원</p>
              </div>
            </div>

            <div className="reservations-card-right">
              <button className="reservations-btn-secondary">견적보기</button>
              
              {item.status === 'upcoming' ? (
                <button className="reservations-btn-danger">취소하기</button>
              ) : (
                <button className="reservations-btn-secondary">리뷰쓰기</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}