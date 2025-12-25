import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../../api/axiosInstance';
import dayjs from 'dayjs';
import './ChatList.css';

const ChatList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redux에서 내 정보 가져오기
  const { user } = useSelector((state) => state.auth);
  const isOwner = user?.role === 'owner';

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
            // 내가 점주면 기사 정보를, 내가 기사면 점주 정보를 표시
            const opponent = isOwner ? room.cleaner : room.owner;
            const isDeleted = !opponent; // 상대방 정보가 없으면 탈퇴 회원 처리

            return (
              <div 
                key={room.id} 
                className="chatlist-item" 
                onClick={() => handleRoomClick(room.id)}
              >
                <div className="chatlist-avatar">
                  <div className="chatlist-avatar-icon">
                    {opponent?.profileImageUrl ? (
                      <img src={opponent.profileImageUrl} alt="profile" className="chatlist-profile-img" />
                    ) : '🧊'}
                  </div>
                </div>
                <div className="chatlist-info">
                  <div className="chatlist-info-top">
                    <span className={`chatlist-cleaner-name ${isDeleted ? 'chatlist-deleted' : ''}`}>
                      {isDeleted ? "탈퇴한 회원입니다" : opponent?.name}
                    </span>
                    <span className="chatlist-cleaner-location">
                      {isDeleted ? "삭제된 회원" : (isOwner ? opponent?.region : opponent?.address)}
                    </span>
                  </div>
                  <div className="chatlist-info-bottom">
                    <p className="chatlist-last-message">
                      {room.lastMessage || "메시지가 없습니다."}
                    </p>
                    <div className="chatlist-meta">
                      <span className="chatlist-last-time">
                        {dayjs(room.updatedAt).format('A h:mm')}
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