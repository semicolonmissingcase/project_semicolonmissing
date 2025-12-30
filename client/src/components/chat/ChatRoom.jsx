import { useRef, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import './ChatRoom.css';
import { FaRegFileImage } from "react-icons/fa";
import { IoSend } from "react-icons/io5";

import { getChatRoomDetail, getChatMessages, markMessageAsRead, sendChatMessage, uploadChatImage } from '../../api/axiosChat.js';

const ChatRoom = ({ roomId: rawRoomId, onOpenSidebar, isSidebarOpen, socket }) => {
  const [messageList, setMessageList] = useState([]);
  const [inputText, setInputText] = useState("");
  const [opponentName, setOpponentName] = useState("채팅방");
  const [opponentId, setOpponentId] = useState(null);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const { user } = useSelector((state) => state.auth);
  const myId = user?.id ? Number(user.id) : null;

  const userRole = user?.role || (user?.email?.includes('cleaner') ? 'CLEANER' : 'OWNER');
  const isCleanerUser = String(userRole).toUpperCase().includes('CLEANER');

  const roomId = rawRoomId ? String(rawRoomId).replace(/[^0-9]/g, '') : null;

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: behavior
      });
    }
  }, []);

  // 1. 초기 데이터 로드 및 소켓 방 입장
  useEffect(() => {
    const fetchChatRoomData = async () => {
      if (!roomId) return;
      
      // [수정] 소켓 방 입장 요청
      if (socket) {
        socket.emit('join_room', roomId);
      }

      try {
        const roomRes = await getChatRoomDetail(roomId);
        const roomData = roomRes.data.data;

        // --- [디버깅 로그 추가] ---
        console.log('--- 기사 계정 디버깅 ---');
        console.log('현재 사용자 역할:', userRole, '| 기사 여부:', isCleanerUser);
        console.log('API 응답 (roomData):', roomData);
        // --- [디버깅 로그 끝] ---

        // [수정] 한 단계 더 깊은 data 객체에 접근
        const roomDetails = roomData.data || {}; 
        const opponentName = isCleanerUser ? roomDetails.ownerName : roomDetails.cleanerName;
        const opponentId = isCleanerUser ? roomDetails.ownerId : roomDetails.cleanerId;

        setOpponentName(opponentName || "상대방");
        setOpponentId(opponentId || null);
      } catch (err) {
        console.warn("방 정보 조회 실패 (404 무시):", err);
      }

      try {
        const msgRes = await getChatMessages(roomId);
        if (msgRes.data && msgRes.data.data) {
          setMessageList(msgRes.data.data);
          setTimeout(() => scrollToBottom('auto'), 100);
        }
      } catch (err) {
        console.error("메시지 내역 조회 실패:", err);
      }

      markMessageAsRead(roomId).catch(() => {});
    };
    
    fetchChatRoomData();
  }, [roomId, isCleanerUser, scrollToBottom]);

  // 2. [핵심] 실시간 메시지 수신 및 중복 방지 로직
  useEffect(() => {
    if (!socket || !roomId) return;

    const handleReceiveMessage = (newMsg) => {
      // 서버 데이터의 필드명(room_id, chatRoomId 등) 유연하게 대응
      const incomingRoomId = String(newMsg.room_id || newMsg.chatRoomId || newMsg.roomId);
      
      if (incomingRoomId === String(roomId)) {
        setMessageList((prev) => {
          // 중복 방지: 이미 목록에 있는 ID라면 무시
          if (prev.find(m => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
        
        // 메시지 수신 시 읽음 처리 전송
        markMessageAsRead(roomId).catch(() => {});
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => socket.off("receive_message", handleReceiveMessage);
  }, [socket, roomId]);

  // 3. 메시지 추가 시 자동 스크롤
  useEffect(() => {
    if (messageList.length > 0) {
      scrollToBottom('smooth');
    }
  }, [messageList, scrollToBottom]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !socket) return;
    try {
      // [수정] 소켓으로만 메시지 전송
      socket.emit("send_message", { 
        roomId, 
        content: inputText, 
        type: 'TEXT',
        receiverId: opponentId // 상대방 알림용 ID
      });
      setInputText("");
    } catch (error) {
      console.error("메시지 전송 실패:", error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !socket) return;

    // 이미지 전송은 기존 HTTP 방식을 유지하되, 소켓 알림은 단순화
    const formData = new FormData();
    formData.append('image', file);

    try {
      const uploadRes = await uploadChatImage(roomId, formData);
      const imageUrl = uploadRes.data.data.url; // 응답 구조에 따라 정확한 url 경로 확인

      // [수정] 이미지 URL을 소켓으로 전송
      socket.emit("send_message", { 
        roomId, 
        content: imageUrl, 
        type: 'IMAGE',
        receiverId: opponentId
      });
    } catch (error) {
      console.error("이미지 전송 실패:", error);
    } finally {
      // 파일 입력 초기화
      if(fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className='chatroom-container'>
      <div className='chatroom-header'>
        <div className='chatroom-header-left'>
          <span className='chatroom-back-btn' onClick={() => window.history.back()}>←</span>
          <h3 className='chatroom-cleaner-name'>{opponentName}</h3>
        </div>
        <div className='chatroom-header-right'>
          <button className='chatroom-detail-btn' onClick={onOpenSidebar}>상세보기</button>
          <button className='chatroom-book-btn'>예약하기</button>
        </div>
      </div>

      <div className='chatroom-message-list' ref={scrollRef}>
        {messageList.map((msg, index) => {
          // [수정] 데이터 필드명 유연성 확보 (snake_case & camelCase 모두 대응)
          const sId = Number(msg.sender_id || msg.senderId);
          const sRole = (msg.sender_role || msg.senderType || '').toUpperCase();
          const mType = msg.type || msg.messageType;

          const isMe = sId === myId && (
            (isCleanerUser && sRole.includes('CLEANER')) ||
            (!isCleanerUser && sRole.includes('OWNER'))
          );

          return (
            <div 
              key={msg.id || index} 
              className={`chatroom-message-item ${isMe ? 'mine' : 'other'}`}
            >
              <div className='chatroom-bubble-container'>
                <div className='chatroom-bubble'>
                  {mType === 'IMAGE' ? (
                    <img src={msg.content} alt="chat" className="chat-image-content" />
                  ) : (
                    msg.content
                  )}
                </div>
                <span className='chatroom-time'>
                  {dayjs(msg.createdAt || msg.created_at).format('A h:mm')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className='chatroom-input'>
        <input 
          type="file" 
          accept='image/*' 
          ref={fileInputRef} 
          onChange={handleImageUpload} 
          style={{ display: 'none' }} 
        />
        <button className='chatroom-image-send' onClick={() => fileInputRef.current.click()}>
          <FaRegFileImage size={22} />
        </button>
        <input 
          type="text" 
          placeholder='메세지를 입력해 주세요.' 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button className='chatroom-send-btn' onClick={handleSendMessage}>
          <IoSend size={22} />
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;