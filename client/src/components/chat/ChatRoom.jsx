import { useRef, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import './ChatRoom.css';
import { FaRegFileImage } from "react-icons/fa";
import { IoSend } from "react-icons/io5";

import { 
  getChatRoomDetail, 
  getChatMessages, 
  markMessageAsRead, 
  uploadChatImage 
} from '../../api/axiosChat.js';

const ChatRoom = ({ roomId: rawRoomId, onOpenSidebar, isSidebarOpen, socket }) => {
  const [messageList, setMessageList] = useState([]);
  const [inputText, setInputText] = useState("");
  const [opponentName, setOpponentName] = useState("채팅방");
  const [opponentId, setOpponentId] = useState(null);
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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

  const fetchMessages = async (targetPage, isInitial = false) => {
    if (!roomId || isLoading || (!hasMore && !isInitial)) return;
    setIsLoading(true);

    try {
      const msgRes = await getChatMessages(roomId, targetPage);
      const newMsgs = msgRes.data?.data || [];

      if (newMsgs.length === 0) {
        setHasMore(false);
      } else {
        if (isInitial) {
          setMessageList(newMsgs);
          setTimeout(() => scrollToBottom('auto'), 50);
        } else {
          const prevHeight = scrollRef.current.scrollHeight;
          setMessageList(prev => [...newMsgs, ...prev]);
          setTimeout(() => {
            if (scrollRef.current) {
              scrollRef.current.scrollTop = scrollRef.current.scrollHeight - prevHeight;
            }
          }, 0);
        }
        setPage(targetPage + 1);
      }
    } catch (err) {
      console.error("메시지 로드 실패:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!roomId) return;

    const init = async () => {
      try {
        const roomRes = await getChatRoomDetail(roomId);
        const responseData = roomRes.data?.data; 
        
        if (responseData) {
          onOpenSidebar(responseData, false);

          const sideType = responseData.sideType; // "OWNER" 또는 "CLEANER"
          const detail = responseData.data;

          const isMeOwner = sideType === 'OWNER';
          const targetName = isMeOwner ? detail.cleanerName : detail.ownerName;
          const targetId = isMeOwner ? detail.cleanerId : detail.ownerId;

          setOpponentName(targetName || "이름 없음");
          setOpponentId(targetId);
        }
      } catch (err) { 
        console.warn("방 정보 조회 실패", err); 
        setOpponentName("채팅방");
      }

      setHasMore(true);
      setPage(1);
      await fetchMessages(1, true);
      markMessageAsRead(roomId).catch(() => {});
    };

    init();
  }, [roomId]);

  const handleScroll = () => {
    if (scrollRef.current && scrollRef.current.scrollTop === 0 && hasMore && !isLoading) {
      fetchMessages(page);
    }
  };

  useEffect(() => {
    if (!socket || !roomId) return;

    const handleReceive = (newMsg) => {
      const incomingId = String(newMsg.chatRoomId || newMsg.room_id || newMsg.roomId);
      if (incomingId === String(roomId)) {
        setMessageList(prev => {
          if (prev.some(m => (m.id && m.id === newMsg.id))) return prev;
          return [...prev, newMsg];
        });
        setTimeout(() => scrollToBottom('smooth'), 100);
      }
    };

    socket.on("receive_message", handleReceive);
    return () => socket.off("receive_message", handleReceive);
  }, [socket, roomId, scrollToBottom]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !socket) return;
    socket.emit("send_message", { 
      roomId, 
      content: inputText, 
      type: 'TEXT', 
      receiverId: opponentId 
    });
    setInputText("");
    setTimeout(() => scrollToBottom('smooth'), 100);
  };

  return (
    <div className='chatroom-container'>
      <div className='chatroom-header'>
        <div className='chatroom-header-left'>
          <span className='chatroom-back-btn' onClick={() => window.history.back()}>←</span>
          <h3 className='chatroom-cleaner-name'>{opponentName}</h3>
        </div>
        <div className='chatroom-header-right'>
          <button className='chatroom-detail-btn' onClick={() => onOpenSidebar(null, true)}>상세보기</button>
          {userRole === 'OWNER' && (<button className='chatroom-book-btn'>예약하기</button>)}
        </div>
      </div>

      <div className='chatroom-message-list' ref={scrollRef} onScroll={handleScroll}>
        {isLoading && hasMore && page > 1 && (
          <div className="scroll-loading-msg" style={{textAlign:'center', padding:'10px', color:'#888', fontSize:'12px'}}>
            이전 대화 불러오는 중...
          </div>
        )}

        {messageList.map((msg, index) => {
          const sId = Number(msg.senderId || msg.sender_id);
          const sRole = (msg.senderType || msg.sender_role || '').toUpperCase();
          const isMe = sId === myId && (
            (isCleanerUser && sRole.includes('CLEANER')) ||
            (!isCleanerUser && sRole.includes('OWNER'))
          );

          return (
            <div key={msg.id || index} className={`chatroom-message-item ${isMe ? 'mine' : 'other'}`}>
              <div className='chatroom-bubble-container'>
                <div className='chatroom-bubble'>
                  {(msg.messageType || msg.type) === 'IMAGE' ? (
                    <img src={msg.content} alt="chat" className="chat-image-content" />
                  ) : msg.content}
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
          style={{ display: 'none' }} 
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const formData = new FormData();
            formData.append('image', file);
            try {
              const res = await uploadChatImage(roomId, formData);
              socket.emit("send_message", { 
                roomId, 
                content: res.data.data.url, 
                type: 'IMAGE', 
                receiverId: opponentId 
              });
            } catch(err) { console.error("이미지 업로드 실패", err); }
          }} 
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
};

export default ChatRoom;