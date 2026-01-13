import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SettlementCards.css';

const SettlementCards = ({ data }) => {
  const { pending = 0, completed = 0 } = data || {};
  const navigate = useNavigate();

  const handleAccountEdit = () => {
    navigate('/cleaners/accountedit');
  };

  return (
    <div className="SettlementCards-container">
      <div className="SettlementCards-header">
        <h3 className="SettlementCards-title">당월 정산 상태</h3>
        <p className="SettlementCards-date-text">
          {new Date().getFullYear()}년 {new Date().getMonth() + 1}월
        </p>
      </div>
      
      <div className="SettlementCards-stats-wrapper">
        <div className="SettlementCards-stat-box">
          <span className="SettlementCards-stat-label">입금 예정</span>
          <p className="SettlementCards-amount-pending">
            {pending.toLocaleString()} 원
          </p>
        </div>
        
        <div className="SettlementCards-divider"></div>
        
        <div className="SettlementCards-stat-box">
          <span className="SettlementCards-stat-label">정산 완료</span>
          <p className="SettlementCards-amount-complete">
            {completed.toLocaleString()} 원
          </p>
        </div>
      </div>
      
      <div className="SettlementCards-footer">
        <button 
          className="SettlementCards-account-btn" 
          onClick={handleAccountEdit}
        >
          계좌 수정
        </button>
      </div>
    </div>
  );
};

export default SettlementCards;