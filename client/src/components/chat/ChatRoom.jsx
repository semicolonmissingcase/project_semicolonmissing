import { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../../api/axiosInstance'; 
import dayjs from 'dayjs';
import 'dayjs/locale/ko'; // 한국어 설정
import './ChatRoom.css';
import { FaRegFileImage } from "react-icons/fa";
import { IoSend } from "react-icons/io5";

const ChatRoom = ({ roomId, onOpenSidebar, isSidebarOpen, socket }) => {
  const [messageList, setMessageList] = useState([]);
  const [inputText, setInputText] = useState("");
  const [opponentName, setOpponentName] = useState("채팅방");
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Redux Store에서 내 정보 가져오기
  const { user } = useSelector((state) => state.auth);
  const myId = user?.id;
  const isOwner = user?.role === 'owner';

  // 1. 방 정보 및 초기 메시지 로드
  useEffect(() => {
    const fetchChatRoomData = async () => {
      if (!roomId) return;
      try {
        // 방 상세 정보 조회 (헤더 이름용)
        const roomRes = await axiosInstance.get(`/chat/rooms/${roomId}`);
        const roomData = roomRes.data.data;
        const opponent = isOwner ? roomData.cleaner : roomData.owner;
        setOpponentName(opponent?.name || "탈퇴한 회원");

        // 메시지 내역 조회
        const msgRes = await axiosInstance.get(`/chat/rooms/${roomId}/messages`);
        // DESC로 오는 데이터를 ASC(과거->현재) 순서로 뒤집어서 저장
        setMessageList(msgRes.data.data.reverse());

        // 읽음 처리 알림 (상대방이 보낸 메시지를 내가 읽었음을 서버에 알림)
        await axiosInstance.patch(`/chat/rooms/${roomId}/read`);
      } catch (error) {
        console.error("채팅방 로드 실패:", error);
      }
    };

    fetchChatRoomData();
  }, [roomId, isOwner]);

  // 2. 실시간 메시지 수신 (Socket.io)
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (newMsg) => {
      // 현재 내가 보고 있는 방의 메시지인 경우에만 목록에 추가
      if (newMsg.chatRoomId === parseInt(roomId)) {
        setMessageList((prev) => [...prev, newMsg]);
        // 수신 시점에 내가 방에 있다면 즉시 읽음 처리 API 호출 (선택 사항)
        axiosInstance.patch(`/chat/rooms/${roomId}/read`).catch(() => {});
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => socket.off("receive_message");
  }, [socket, roomId]);

  // 3. 메시지 추가 시 스크롤을 항상 하단으로
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messageList]);

  // 4. 메시지 전송 (텍스트)
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    try {
      const msgData = {
        room_id: roomId,
        content: inputText,
        sender_id: myId,
        sender_role: user.role,
        type: 'TEXT'
      };

      // API 전송 후 DB 저장된 객체 받기
      const res = await axiosInstance.post(`/chat/rooms/${roomId}/messages`, msgData);
      const savedMsg = res.data.data;

      // 소켓으로 상대방에게 전송 및 내 화면 업데이트
      socket.emit("send_message", savedMsg);
      setMessageList((prev) => [...prev, savedMsg]);
      setInputText("");
    } catch (error) {
      console.error("전송 실패:", error);
    }
  };

  // 5. 이미지 업로드 전송
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      // 이미지 서버 업로드 (Multer 처리기 필요)
      const uploadRes = await axiosInstance.post('/chat/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const imageUrl = uploadRes.data.url;

      // 업로드된 URL을 내용으로 하는 IMAGE 타입 메시지 전송
      const msgData = {
        room_id: roomId,
        content: imageUrl,
        sender_id: myId,
        sender_role: user.role,
        type: 'IMAGE'
      };

      const res = await axiosInstance.post(`/chat/rooms/${roomId}/messages`, msgData);
      const savedMsg = res.data.data;

      socket.emit("send_message", savedMsg);
      setMessageList((prev) => [...prev, savedMsg]);
    } catch (error) {
      console.error("이미지 전송 실패:", error);
    }
  };

  return (
    <div className='chatroom-container'>
      {/* 헤더 영역 */}
      <div className='chatroom-header'>
        <div className='chatroom-header-left'>
          <span className='chatroom-back-btn'>←</span>
          <h3 className='chatroom-cleaner-name'>{opponentName}</h3>
        </div>
        
        <div className='chatroom-header-right'>
          <button className='chatroom-detail-btn' onClick={onOpenSidebar}>상세보기</button>
          <button className='chatroom-book-btn'>예약하기</button>
        </div>
      </div>

      {/* 메시지 리스트 영역 */}
      <div className='chatroom-message-list' ref={scrollRef}>
        {messageList.map((msg) => {
          // 내가 보낸 것인지 여부에 따라 CSS 클래스 분기
          const isMe = msg.senderId === myId;
          const roleClass = isMe ? 'owner' : 'cleaner';

          return (
            <div key={msg.id} className={`chatroom-message-item ${roleClass}`}>
              <div className='chatroom-bubble-container' 
                   style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', alignItems: 'flex-end' }}>
                <div className='chatroom-bubble'>
                  {msg.messageType === 'IMAGE' ? (
                    <img src={msg.content} alt="chat-attachment" className="chat-image-content" 
                         style={{ maxWidth: '100%', borderRadius: '8px', display: 'block' }} />
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

      {/* 입력창 영역 */}
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