import React from 'react';
import './ChatSidebarRequest.css';

const ChatSidebarRequest = ({ roomId }) => {
  const requestData = {
    ownerName: "OOO 점주님",
    phone: "010-1234-5678",
    date: "2024.10.25",
    time: "13:00 ~ 14:00",
    address: "대구광역시 중구 중앙대로 123 (2층)",
    qna: [
      { q: "제빙기 가동시간", a: "하루 8시간" },
      { q: "곰팡이 냄새/악취", a: "네, 악취가 나요", warning: true },
      { q: "얼음이 탁한가요?", a: "네, 탁해요", warning: true },
      { q: "기계 소음", a: "아니요, 없어요" },
    ],
    memo: "가게 뒷문 옆 전용 주차공간 이용하시면 됩니다."
  };

  return (
    <div className='chatsidebarrequest-container'>
      <div className='chatsidebarrequest-header'>
        <h3>의뢰 상세 정보</h3>
      </div>

      {/* 내부 스크롤 영역 */}
      <div className='chatsidebarrequest-content-scroll'>
        
        {/* 점주 정보 섹션 */}
        <div className='chatsidebarrequest-profile-section'>
          <div className='chatsidebarrequest-avatar'>🏪</div>
          <div className='chatsidebarrequest-info'>
            <span>{requestData.ownerName}</span>
            <span>{requestData.phone}</span>
          </div>
        </div>

        {/* 예약 카드 (하늘색 박스) */}
        <div className='chatsidebarrequest-request-card'>
          <div className='chatsidebarrequest-request-row'>
            <span className='chatsidebarrequest-label'>예약일시</span>
            <span className='chatsidebarrequest-value'>{requestData.date} / {requestData.time}</span>
          </div>
          <div className='chatsidebarrequest-request-row'>
            <span className='chatsidebarrequest-label'>주소</span>
            <span className='chatsidebarrequest-value'>{requestData.address}</span>
          </div>
        </div>

        {/* QNA 섹션 */}
        <div className='chatsidebarrequest-qna-section'>
          <h4>체크리스트 정보</h4>
          {requestData.qna.map((item, idx) => (
            <div key={idx} className={`chatsidebarrequest-qna-item ${item.warning ? 'warning' : ''}`}>
              <span className='chatsidebarrequest-qna-q'>{item.q}</span>
              <span className='chatsidebarrequest-qna-a'>{item.a}</span>
            </div>
          ))}
        </div>

        {/* 메모 박스 */}
        <div className='chatsidebarrequest-memo-box'>
          <p className='chatsidebarrequest-memo-label'>추가 요청사항</p>
          <p>{requestData.memo}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebarRequest;