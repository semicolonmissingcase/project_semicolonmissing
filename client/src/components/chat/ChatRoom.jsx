import { useRef, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import './ChatRoom.css';
import { FaRegFileImage } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import PaymentModal from '../payment/paymentModal.jsx';

import { 
  getChatRoomDetail, 
  getChatMessages, 
  markMessageAsRead, 
  uploadChatImage, 
} from '../../api/axiosChat.js';

const ChatRoom = ({ roomId: rawRoomId, onOpenSidebar, isSidebarOpen, socket }) => {
  // 상태 추가
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  // 예약 정보 저장을 위한 상태
  const [reservationId, setReservationId] = useState(null);

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
    const responseData = roomRes?.data?.data;

    if (responseData) {
      onOpenSidebar(responseData, false);
      
      const detail = responseData.data; 
      const isMeOwner = responseData.sideType === 'OWNER';

      if (detail) {
        setOpponentName((isMeOwner ? detail.cleanerName : detail.ownerName) || "이름 없음");
        setOpponentId(isMeOwner ? detail.cleanerId : detail.ownerId);

        const rId = detail.reservationId;
        
        setReservationId(rId);
        console.log("세팅된 최종 예약 ID:", rId); 
      }
    }

    await markMessageAsRead(roomId);
    if (socket) socket.emit("mark_as_read", { roomId, userRole });
    setHasMore(true);
    setPage(1);
    await fetchMessages(1, true);

  } catch (err) { 
    console.warn("초기화 중 오류 발생:", err); 
    fetchMessages(1, true);
  }
};

    init();
  }, [roomId, socket]);

  // 스크롤 핸들러
  const handleScroll = () => {
    if (scrollRef.current && scrollRef.current.scrollTop === 0 && hasMore && !isLoading) {
      fetchMessages(page);
    }
  };

  // 소켓 리스너
  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit('join_room', roomId);

    const handleMessagesRead = (data) => {
      if (String(data.roomId) === String(roomId)) {
        setMessageList(prev => prev.map(m => ({ ...m, isRead: 1 })));
      }
    };

    const handleReceive = (newMsg) => {
      if (String(newMsg.chatRoomId || newMsg.room_id) === String(roomId)) {
        setMessageList(prev => {
          // 중복 메시지 방지 로직 추가
          const isDup = prev.some(m => m.id && newMsg.id && m.id === newMsg.id);
          return isDup ? prev : [...prev, newMsg];
        });
        
        socket.emit('mark_as_read', { roomId }); 
        markMessageAsRead(roomId).catch(() => {});
        
        setTimeout(() => scrollToBottom('smooth'), 100);
      }
    };

    socket.on("messages_read", handleMessagesRead);
    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("messages_read", handleMessagesRead);
      socket.off("receive_message", handleReceive);
    };
  }, [socket, roomId]);

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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await uploadChatImage(roomId, formData);
      const imageUrl = res.data.data.path;

      socket.emit("send_message", { 
        roomId, 
        content: imageUrl, 
        type: 'IMAGE', 
        receiverId: opponentId 
      });

      e.target.value = ''; 
      setTimeout(() => scrollToBottom('smooth'), 100);
    } catch(err) { 
      console.error("이미지 업로드 실패", err);
      alert("이미지 전송에 실패했습니다.");
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
          <button className='chatroom-detail-btn' onClick={() => onOpenSidebar(true)}>상세보기</button>
          {userRole === 'OWNER' && (<button className='chatroom-book-btn' onClick={() => setIsPaymentModalOpen(true)}>예약하기</button>)}
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
          
          const isImage = (msg.messageType || msg.type) === 'IMAGE';
          const isReadVal = msg.isRead !== undefined ? msg.isRead : msg.is_read;
          const showUnread = isMe && Number(isReadVal) === 0;

          return (
            <div key={msg.id || index} className={`chatroom-message-item ${isMe ? 'mine' : 'other'}`}>
              <div className='chatroom-bubble-container'>
                <div className='chatroom-bubble-row'>
                  {showUnread && <span className='unread-count'>1</span>}
                  
                  <div className={`chatroom-bubble ${isImage ? 'has-image' : ''}`}>
                    {isImage ? (
                      <img 
                        src={msg.content} 
                        alt="chat" 
                        className="chat-image-content" 
                        onClick={() => window.open(msg.content, '_blank')}
                      />
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
                <span className='chatroom-time'>
                  {dayjs(msg.createdAt || msg.created_at).format('A h:mm')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {isPaymentModalOpen && reservationId && (<PaymentModal reservationId={reservationId} onClose={() => setIsPaymentModalOpen(false)}/>)}

      <div className='chatroom-input'>
        <input 
          type="file" 
          accept='image/*' 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleImageChange} 
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