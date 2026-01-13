import React from 'react';
import './EstimatesShow.css';
import PaymentModal from '../../payment/paymentModal.jsx';
import { useState } from 'react';

export default function EstimatesShow({ isOpen, onClose, data, showReserveButton = true }) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // 결제 모달
  if (!isOpen || !data) return null;

  return (
    <div className="estimateshow-overlay" onClick={onClose}>
      <div className="estimateshow-content" onClick={(e) => e.stopPropagation()}>
        {/* 상단 닫기 버튼 및 타이틀 */}
        <button className="estimateshow-close-x" onClick={onClose}>X</button>
        <h2 className="estimateshow-main-title">{data.cleanerName || 'OOO'} 기사님의 견적서</h2>

        {/* 기사님 정보 카드 */}
        <div className="estimateshow-cleaner-card">
          <div className="estimateshow-avatar-circle">
            <img 
              src={data.cleanerProfile || "/icons/default-profile.png"} 
              alt="기사님 프로필" 
              className="estimateshow-avatar-img"
            />
          </div>
          <div className="estimateshow-cleaner-info">
            <h3 className="estimateshow-cleaner-name">{data.cleanerName || 'OOO'} 기사님</h3>
            <div className="estimateshow-rating">
              <span className="estimateshow-star">★</span>
              <span className="estimateshow-score">{data.avgReviewScore || '0.0'}</span>
            </div>
            <p className="estimateshow-one-liner">{data.comment || ''}</p>
          </div>
        </div>

        {/* 견적 금액 및 설명 섹션 */}
        <div className="estimateshow-detail-box">
          <div className="estimateshow-price-row">
            <span className="estimateshow-label">견적 금액</span>
            <span className="estimateshow-price-value">
              {data.price?.toLocaleString() || '0'}원
            </span>
          </div>

          <div className="estimateshow-description-section">
            <h4 className="estimateshow-label">견적 설명</h4>
            <div className="estimateshow-description-text">
              {data.description || '견적에 대한 상세 설명이 없습니다.'}
            </div>
          </div>
        </div>

        {/* 하단 버튼 그룹 */}
        {showReserveButton && (
          <div className="estimateshow-button-group">
            <button className="estimateshow-btn-reserve" onClick={() => setIsPaymentModalOpen(true)}>
              예약하기
            </button>
          </div>
        )}
      </div>

      {/* 결제 모달 */}
      {isPaymentModalOpen && (
        <PaymentModal 
          onClose={() => setIsPaymentModalOpen(false)}
          reservationId={data.reservationId}
          userId={data.userId}
        />
      )}
    </div>
  );
}