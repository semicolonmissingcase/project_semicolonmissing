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

  // 1. 목록 가져오기 함수 (useCallback으로 메모이제이션)
  const fetchRooms = useCallback(async () => {
    try {
      console.log("📡 [Front] 채팅 목록 API 요청 시작..."); // 이 로그가 찍히는지 확인하세요
      const response = await axiosInstance.get('/api/chat/rooms');
      console.log("✅ [Front] 서버 응답 데이터:", response.data.data);
      
      setChatRooms(response.data.data || []);
    } catch (error) {
      console.error("❌ [Front] 목록 로딩 에러:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. 컴포넌트 마운트 시 즉시 실행
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
      console.log("🔔 새 메시지 수신: 목록 새로고침");
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
                      {room.lastMessage || "메시지가 없습니다."}
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