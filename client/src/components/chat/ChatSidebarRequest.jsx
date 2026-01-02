import React from 'react';
import './ChatSidebarRequest.css';

const ChatSidebarRequest = ({ data, onClose }) => {
  if (!data) {
    return (
      <div className="chatsidebarrequest-container">
        <div className="chatsidebarrequest-header">
          <h3>의뢰 요약</h3>
          <button onClick={onClose} className="chatsidebarrequest-close-btn">✕</button>
        </div>
        <p>의뢰 정보를 불러오는 중...</p>
      </div>
    );
  }

  const dateTime = (data.wishDate && data.wishTime) ? 
    `${data.wishDate} / ${data.wishTime.substring(0, 5)}` : '정보 없음';

  return (
    <div className="chatsidebarrequest-container">
      <div className="chatsidebarrequest-header">
        <h3>의뢰서</h3>
        <button onClick={onClose} className="chatsidebarrequest-close-btn">✕</button>
      </div>

      <div className="chatsidebarrequest-content-scroll">
        {/* 점주 정보 섹션 */}
        <div className="chatsidebarrequest-profile-section">
          <div className="chatsidebarrequest-avatar">🏪</div>
          <div className="chatsidebarrequest-info">
            <span>{data.ownerName || '정보 없음'}</span>
            <span>{data.storeName || '매장명 정보 없음'}</span>
          </div>
        </div>

        {/* 예약 카드 */}
        <div className="chatsidebarrequest-request-card">
          <div className="chatsidebarrequest-request-row">
            <span className="chatsidebarrequest-label">예약일시</span>
            <span className="chatsidebarrequest-value">{dateTime}</span>
          </div>
          {/* 주소 반영 */}
          <div className="chatsidebarrequest-request-row">
            <span className="chatsidebarrequest-label">주소</span>
            <span className="chatsidebarrequest-value">{data.storeAddress || '주소 정보 없음'}</span>
          </div>

        </div>

        {/* Q&A 섹션 (qaList 반영) */}
        {data.qaList && data.qaList.length > 0 && (
          <div className="chatsidebarrequest-qna-section">
            <h4>요청 체크리스트</h4>
            {data.qaList.map((item, idx) => (
              <div key={idx} className={`chatsidebarrequest-qna-item ${item.warning ? 'warning' : ''}`}>
                <span className="chatsidebarrequest-qna-q">{item.question || '질문'}</span>
                <span className="chatsidebarrequest-qna-a">{item.answer || '답변'}</span>
              </div>
            ))}
          </div>
        )}
        {(!data.qaList || data.qaList.length === 0) && (
          <div className="chatsidebarrequest-qna-section">
            <h4>요청 체크리스트</h4>
            <p>체크리스트 정보 없음</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebarRequest;