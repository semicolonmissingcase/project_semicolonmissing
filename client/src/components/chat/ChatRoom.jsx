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
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const { user } = useSelector((state) => state.auth);
  const myId = user?.id ? Number(user.id) : null;

  // [수정 포인트 1] user 객체 내 role이 없을 경우를 대비한 판별 로직
  // 만약 DB 구조상 점주/기사의 ID가 모두 1이라면, 이 역할 판별이 매우 중요합니다.
  const userRole = user?.role || (user?.email?.includes('cleaner') ? 'CLEANER' : 'OWNER');
  const isCleanerUser = String(userRole).toUpperCase().includes('CLEANER');

  const roomId = rawRoomId ? String(rawRoomId).replace(/[^0-9]/g, '') : null;

  // [수정 포인트 2] 유연한 스크롤 함수
  const scrollToBottom = useCallback((behavior = 'smooth') => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: behavior // smooth: 부드럽게, auto: 즉시
      });
    }
  }, []);

  useEffect(() => {
    const fetchChatRoomData = async () => {
      if (!roomId) return;
      try {
        const roomRes = await getChatRoomDetail(roomId);
        const roomData = roomRes.data.data;
        // 내 역할에 따라 상대방 정보를 다르게 가져옴
        const opponent = isCleanerUser ? roomData.owner : roomData.cleaner;
        setOpponentName(opponent?.name || "상대방");
      } catch (err) {
        console.error("방 정보 조회 실패:", err);
      }

      try {
        const msgRes = await getChatMessages(roomId);
        if (msgRes.data && msgRes.data.data) {
          setMessageList(msgRes.data.data.reverse());
          // 초기 로딩 시에는 스크롤을 즉시(auto) 하단으로
          setTimeout(() => scrollToBottom('auto'), 100);
        }
      } catch (err) {
        console.error("메시지 내역 조회 실패:", err);
      }

      markMessageAsRead(roomId).catch(() => {});
    };
    
    fetchChatRoomData();
  }, [roomId, isCleanerUser, scrollToBottom]);

  // 실시간 메시지 수신
  useEffect(() => {
    if (!socket || !roomId) return;

    const handleReceiveMessage = (newMsg) => {
      if (String(newMsg.chatRoomId) === String(roomId)) {
        setMessageList((prev) => [...prev, newMsg]);
        markMessageAsRead(roomId).catch(() => {});
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => socket.off("receive_message", handleReceiveMessage);
  }, [socket, roomId]);

  // 메시지 리스트 변경 시 부드럽게 스크롤
  useEffect(() => {
    if (messageList.length > 0) {
      scrollToBottom('smooth');
    }
  }, [messageList, scrollToBottom]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    try {
      const msgData = { content: inputText, type: 'TEXT' };
      const res = await sendChatMessage(roomId, msgData);
      
      socket.emit("send_message", res.data.data);
      setMessageList((prev) => [...prev, res.data.data]);
      setInputText("");
    } catch (error) {
      console.error("메시지 전송 실패:", error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const uploadRes = await uploadChatImage(roomId, formData);
      const imageUrl = uploadRes.data.url;
      const msgData = { content: imageUrl, type: 'IMAGE' };
      const res = await sendChatMessage(roomId, msgData);

      socket.emit("send_message", res.data.data);
      setMessageList((prev) => [...prev, res.data.data]);
    } catch (error) {
      console.error("이미지 전송 실패:", error);
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
        {messageList.map((msg) => {
          // [수정 포인트 3] ID + Role(Type) 교차 검증
          // 1. ID 일치 여부
          // 2. 현재 로그인 유저가 기사이고 메시지 타입이 CLEANER이거나, 
          //    현재 로그인 유저가 점주이고 메시지 타입이 OWNER일 때만 mine
          const isMe = Number(msg.senderId) === myId && (
            (isCleanerUser && msg.senderType === 'CLEANER') ||
            (!isCleanerUser && msg.senderType === 'OWNER')
          );

          return (
            <div 
              key={msg.id} 
              className={`chatroom-message-item ${isMe ? 'mine' : 'other'}`}
            >
              <div className='chatroom-bubble-container'>
                <div className='chatroom-bubble'>
                  {msg.messageType === 'IMAGE' ? (
                    <img src={msg.content} alt="chat" className="chat-image-content" />
                  ) : (
                    msg.content
                  )}
                </div>
                <span className='chatroom-time'>
                  {dayjs(msg.createdAt).format('A h:mm')}
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