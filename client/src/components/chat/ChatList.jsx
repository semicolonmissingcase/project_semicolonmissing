import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../../api/axiosInstance';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import './ChatList.css';

const ChatList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state) => state.auth);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/chat/rooms');
      setChatRooms(response.data.data);
    } catch (error) {
      console.error("채팅 목록 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleRoomClick = (roomId) => {
    navigate(`/chatroom/${roomId}`);
  };

  if (loading) return <div className="chatlist-container">로딩 중...</div>;

  return (
    <div className="chatlist-container">
      <h2 className="chatlist-title">채팅</h2>

      {/* 검색창 */}
      <div className="chatlist-search-box">
        <input type="text" placeholder="이름을 검색해 주세요." />
        <span className="chatlist-search-icon">🔍</span>
      </div>

      {/* 탭 메뉴 */}
      <div className="chatlist-tabs">
        <button 
          className={activeTab === 'all' ? 'chatlist-active' : ''} 
          onClick={() => setActiveTab('all')}
        >전체</button>
        <button 
          className={activeTab === 'hire' ? 'chatlist-active' : ''} 
          onClick={() => setActiveTab('hire')}
        >고용</button>
      </div>

      {/* 채팅방 리스트 영역 */}
      <div className="chatlist-items-wrapper">
        {chatRooms.length === 0 ? (
          <p className="chatlist-no-data">진행 중인 채팅이 없습니다.</p>
        ) : (
          chatRooms.map((room) => {
            const isDeleted = room.opponentName === "알 수 없는 사용자" || room.opponentName === "탈퇴한 회원";

            return (
              <div 
                key={room.id} 
                className="chatlist-item" 
                onClick={() => handleRoomClick(room.id)}
              >
                <div className="chatlist-avatar">
                  <div className="chatlist-avatar-icon">
                    {room.opponentProfileImg ? (
                      <img src={room.opponentProfileImg} alt="profile" className="chatlist-profile-img" />
                    ) : '🧊'}
                  </div>
                </div>
                
                <div className="chatlist-info">
                  <div className="chatlist-info-top">
                    <span className={`chatlist-cleaner-name ${isDeleted ? 'chatlist-deleted' : ''}`}>
                      {room.opponentName}
                    </span>
                    <span className="chatlist-cleaner-location">
                      {room.opponentAddress || ""}
                    </span>
                  </div>
                  
                  <div className="chatlist-info-bottom">
                    <p className="chatlist-last-message">
                      {room.lastMessage}
                    </p>
                    <div className="chatlist-meta">
                      <span className="chatlist-last-time">
                        {dayjs(room.lastMessageTime).format('A h:mm')}
                      </span>
                      {room.unreadCount > 0 && (
                        <span className="chatlist-unread-badge">{room.unreadCount}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatList;