import React from 'react';
import './ChatSidebarRequest.css';

const ChatSidebarRequest = ({ data, onClose }) => {
  if (!data) {
    return (
      <div className="chatsidebarrequest-container">
        <div className="chatsidebarrequest-header">
          <h3>의뢰서</h3>
          <button onClick={onClose} className="chatsidebarrequest-close-btn">✕</button>
        </div>
        <p className="loading-text">의뢰 정보를 불러오는 중...</p>
      </div>
    );
  }

  const dateTime = (data.wishDate && data.wishTime) 
    ? `${data.wishDate} / ${data.wishTime.substring(0, 5)}` 
    : '정보 없음';

  return (
    <div className="chatsidebarrequest-container">
      <div className="chatsidebarrequest-header">
        <h3>의뢰서</h3>
        <button onClick={onClose} className="chatsidebarrequest-close-btn">✕</button>
      </div>

      <div className="chatsidebarrequest-content-scroll">
        {/* 점주 정보 */}
        <div className="chatsidebarrequest-profile-section">
          <div className="chatsidebarrequest-avatar">🏪</div>
          <div className="chatsidebarrequest-info">
            <span className="owner-name">{data.ownerName}</span>
            <span className="store-name">{data.storeName}</span>
          </div>
        </div>

        {/* 예약 카드 */}
        <div className="chatsidebarrequest-request-card">
          <div className="chatsidebarrequest-request-row">
            <span className="chatsidebarrequest-label">예약일시</span>
            <span className="chatsidebarrequest-value">{dateTime}</span>
          </div>
          <div className="chatsidebarrequest-request-row">
            <span className="chatsidebarrequest-label">주소</span>
            <span className="chatsidebarrequest-value address-text">{data.storeAddress || '주소 정보 없음'}</span>
          </div>
        </div>

        {/* 체크리스트 */}
        <div className="chatsidebarrequest-qna-section">
          <h4>요청 체크리스트</h4>
          {data.qaList && data.qaList.length > 0 ? (
            data.qaList.map((item, idx) => (
              <div key={idx} className={`chatsidebarrequest-qna-item ${item.warning ? 'warning' : ''}`}>
                <span className="chatsidebarrequest-qna-q">{item.question}</span>
                <span className="chatsidebarrequest-qna-a">{item.answer}</span>
              </div>
            ))
          ) : <p className="no-data">정보가 없습니다.</p>}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebarRequest;