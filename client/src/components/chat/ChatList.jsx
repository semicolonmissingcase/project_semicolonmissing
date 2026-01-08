import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import './ChatList.css';
import { io } from 'socket.io-client';

const ChatList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/chat/rooms');
      
      setChatRooms(response.data.data || []);
    } catch (error) {
      console.error("❌ [Front] 목록 로딩 에러:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // 3. 소켓 설정 (실시간 업데이트)
  useEffect(() => {
    const socketAddr = 'http://localhost:3000'; // 서버 주소에 맞게 수정
    const newSocket = io(socketAddr, { withCredentials: true });

    const token = localStorage.getItem('accessToken');
    if (token) {
      newSocket.emit("authenticate", { token });
    }

    newSocket.on("receive_message", () => {
      fetchRooms();
    });

    return () => {
      newSocket.off("receive_message");
      newSocket.close();
    };
  }, [fetchRooms]);

  const handleRoomClick = (roomId) => {
    navigate(`/chatroom/${roomId}`);
  };

  // 렌더링 부분
  return (
    <div className="chatlist-container">
      <h2 className="chatlist-title">채팅</h2>

      <div className="chatlist-search-box">
        <input type="text" placeholder="이름을 검색해 주세요." />
        <span className="chatlist-search-icon">🔍</span>
      </div>

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

      <div className="chatlist-items-wrapper">
        {loading ? (
          <p className="chatlist-no-data">로딩 중...</p>
        ) : chatRooms.length === 0 ? (
          <p className="chatlist-no-data">진행 중인 채팅이 없습니다.</p>
        ) : (
          chatRooms.map((room) => {
            const isDeleted = !room.opponentName || room.opponentName === "탈퇴한 회원";
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
                      {room.opponentName || "알 수 없는 사용자"}
                    </span>
                  </div>
                  
                  <div className="chatlist-info-bottom">
                    <p className="chatlist-last-message">
                    {room.lastMessage?.includes('storage/images') || room.lastMessage?.match(/\.(jpeg|jpg|gif|png)$/i)
                          ? "(사진)"
                          : (room.lastMessage || "메시지가 없습니다.")
                        }
                    </p>
                    <div className="chatlist-meta">
                      {/* 1. 안 읽은 메시지 배지 (값이 0보다 클 때만 표시) */}
                      {room.unreadCount > 0 && (
                        <span className="chatlist-unread-badge">
                          {room.unreadCount > 99 ? '99+' : room.unreadCount}
                        </span>
                      )}
                      
                      {/* 2. 마지막 메시지 시간 */}
                      <span className="chatlist-last-time">
                        {dayjs(room.lastMessageTime).format('A h:mm')}
                      </span>
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