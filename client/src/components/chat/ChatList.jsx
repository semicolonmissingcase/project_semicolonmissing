import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatList.css';

const ChatList = () => {
  const navigate = useNavigate();
  // 탭 상태 관리 (전체 / 고용)
  const [activeTab, setActiveTab] = useState('all');

  // 임시 데이터 (DB의 chat_rooms와 cleaner 정보 결합 형태)
  const chatRooms = [
    {
      id: 1,
      cleanerName: "곽효선",
      location: "대구 달서구",
      lastMessage: "네네, 일정변경 가능합니다.",
      time: "오후 12:14",
      isDeleted: false
    },
    {
      id: 2,
      cleanerName: "탈퇴한 회원입니다",
      location: "삭제된 회원",
      lastMessage: "네네, 일정변경 가능합니다.",
      time: "오후 12:14",
      isDeleted: true
    }
  ];

  const handleRoomClick = (roomId) => {
    console.log("클릭된 방 ID", roomId);
    navigate(`/chatroom/${roomId}`);
  }

  return (
    <div className="chatlist-container">
      <h2 className="chatlist-title">채팅</h2>

      {/* 검색창 */}
      <div className="chatlist-search-box">
        <input type="text" placeholder="이름을 검색해 주세요." />
        <span className="search-icon">🔍</span>
      </div>

      {/* 탭 메뉴 */}
      <div className="chatlist-tabs">
        <button 
          className={activeTab === 'all' ? 'active' : ''} 
          onClick={() => setActiveTab('all')}
        >전체</button>
        <button 
          className={activeTab === 'hire' ? 'active' : ''} 
          onClick={() => setActiveTab('hire')}
        >고용</button>
      </div>

      {/* 채팅방 리스트 영역 */}
      <div className="chatlist-items-wrapper">
        {chatRooms.map((room) => (
          <div key={room.id} className="chatlist-item" onClick={() => handleRoomClick(room.id)}>
            <div className="chatlist-avatar">
              {/* 이미지 시안의 아이콘 형태 */}
              <div className="avatar-icon">🧊</div>
            </div>
            <div className="chatlist-info">
              <div className="info-top">
                <span className={`cleaner-name ${room.isDeleted ? 'deleted' : ''}`}>
                  {room.cleanerName}
                </span>
                <span className="cleaner-location">{room.location}</span>
              </div>
              <div className="info-bottom">
                <p className="last-message">{room.lastMessage}</p>
                <span className="last-time">{room.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;