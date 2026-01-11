import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import './ChatList.css';
import { io } from 'socket.io-client';

const ChatList = () => {
  const navigate = useNavigate();
  
  // --- 상태 관리 ---
  const [activeTab, setActiveTab] = useState('all');
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState(new Set());

  const fetchRooms = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/chat/rooms');
      setChatRooms(response.data.data || []);
    } catch (error) {
      console.error("❌ 목록 로딩 에러:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  // --- 소켓 연결 ---
  useEffect(() => {
    const socketAddr = 'http://localhost:3000'; 
    const newSocket = io(socketAddr, { withCredentials: true });
    const token = localStorage.getItem('accessToken');
    if (token) newSocket.emit("authenticate", { token });
    newSocket.on("receive_message", () => fetchRooms());
    return () => {
      newSocket.off("receive_message");
      newSocket.close();
    };
  }, [fetchRooms]);

  // --- 핸들러 ---
  const handleRoomClick = (roomId) => {
    if (isEditMode) {
      handleToggleSelect(roomId);
    } else {
      navigate(`/chatroom/${roomId}`);
    }
  };

  const handleToggleSelect = (roomId) => {
    const newSelected = new Set(selectedRooms);
    if (newSelected.has(roomId)) newSelected.delete(roomId);
    else newSelected.add(roomId);
    setSelectedRooms(newSelected);
  };

  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setSelectedRooms(new Set());
  };

  const handleLeaveRooms = async () => {
    if (selectedRooms.size === 0) return;
    if (!window.confirm(`${selectedRooms.size}개의 채팅방에서 나가시겠습니까?`)) return;

    try {
      await Promise.all(
        Array.from(selectedRooms).map(roomId => 
          axiosInstance.patch(`/api/chat/rooms/${roomId}/leave`)
        )
      );
      setIsEditMode(false);
      setSelectedRooms(new Set());
      fetchRooms();
    } catch (error) {
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  // --- 필터링 로직 ---
  const filteredRooms = useMemo(() => {
    return chatRooms.filter(room => {
      return (room.opponentName || "").toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [chatRooms, searchTerm]);

  return (
    <div className="chatlist-container">
      <div className="chatlist-header-flex">
        <h2 className="chatlist-title">채팅</h2>
        <button 
          className={`chatlist-edit-toggle ${isEditMode ? 'active' : ''}`}
          onClick={handleToggleEditMode}
        >
          {isEditMode ? "취소" : "편집"}
        </button>
      </div>

      {/* 검색 바 */}
      <div className="chatlist-search-box">
        <input 
          type="text" 
          placeholder="이름을 검색해 주세요." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="chatlist-search-icon">🔍</span>
      </div>
      
      <div className="chatlist-tabs">
        <button className={activeTab === 'all' ? 'chatlist-active' : ''} onClick={() => setActiveTab('all')}>
          전체
        </button>
      </div>

      {/* 리스트 영역 */}
      <div className={`chatlist-items-wrapper ${isEditMode ? 'is-editing' : ''}`}>
        {loading ? (
          <p className="chatlist-no-data">로딩 중...</p>
        ) : filteredRooms.length === 0 ? (
          <p className="chatlist-no-data">
            {searchTerm ? `'${searchTerm}'에 대한 검색 결과가 없습니다.` : "진행 중인 채팅이 없습니다."}
          </p>
        ) : (
          filteredRooms.map((room) => {
            const isSelected = selectedRooms.has(room.id);
            const isDeletedUser = !room.opponentName || room.opponentName === "탈퇴한 회원";
            
            return (
              <div 
                key={room.id} 
                className={`chatlist-item ${isSelected ? 'chatlist-item-selected' : ''}`} 
                onClick={() => handleRoomClick(room.id)}
              >
                {isEditMode && (
                  <div className="chatlist-edit-checkbox">
                    <input type="checkbox" checked={isSelected} readOnly />
                  </div>
                )}

                <div className="chatlist-avatar">
                  {room.opponentProfileImg ? (
                    <img src={room.opponentProfileImg} alt="profile" className="chatlist-profile-img" />
                  ) : '🧊'}
                </div>
                
                <div className="chatlist-info">
                  <div className="chatlist-info-top">
                    <span className={`chatlist-cleaner-name ${isDeletedUser ? 'chatlist-deleted' : ''}`}>
                      {room.opponentName || "알 수 없는 사용자"}
                    </span>
                  </div>
                  <div className="chatlist-info-bottom">
                    <p className="chatlist-last-message">
                      {room.lastMessage?.includes('storage/images') ? "(사진)" : (room.lastMessage || "메시지가 없습니다.")}
                    </p>
                    <div className="chatlist-meta">
                      {!isEditMode && room.unreadCount > 0 && (
                        <span className="chatlist-unread-badge">{room.unreadCount}</span>
                      )}
                      <span className="chatlist-last-time">{dayjs(room.lastMessageTime).format('A h:mm')}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 하단 나가기 버튼 바 */}
      {isEditMode && (
        <div className="chatlist-edit-footer">
          <button 
            className="chatlist-leave-submit-btn" 
            disabled={selectedRooms.size === 0}
            onClick={handleLeaveRooms}
          >
            나가기 ({selectedRooms.size})
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatList;