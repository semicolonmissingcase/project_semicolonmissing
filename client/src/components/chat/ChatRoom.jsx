import { useRef, useState, useEffect } from 'react';
import './ChatRoom.css';
import { FaRegFileImage } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import axios from 'axios';

const ChatRoom = ({ roomId, onOpenSidebar, isSidebarOpen, socket }) => {
  const [messageList, setMessageList] = useState([
    { id: 1, role: 'cleaner', type: 'text', text: '안녕하세요!', time: '오후 12:00', isRead: true },
    { id: 2, role: 'owner', type: 'text', text: '네, 견적 확인했습니다.', time: '오후 12:05', isRead: true },
    { id: 3, role: 'cleaner', type: 'text', text: '일정 변경 가능합니다.', time: '오후 12:14', isRead: true },
  ]);
  
  const [inputText, setInputText] = useState("");
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('/api/chat/upload', formData);
      const imageUrl = res.data.url;

      const imageMsg = {
        roomId,
        sender: 'owner',
        type: 'image',
        text: imageUrl,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Date, Time 오타 수정
        isRead: false
      };

      // 소켓 전송 및 내 화면 업데이트
      socket.emit("send_message", imageMsg);
      setMessageList((prev) => [...prev, imageMsg]);
    } catch (error) {
      console.error("이미지 업로드 실패", error);
    }
  };

  return (
    <div className='chatroom-container'>
      <div className='chatroom-header'>
        <div className='chatroom-header-left'>
          <span className='chatroom-back-btn'>←</span>
          <h3 className='chatroom-cleaner-name'>곽효선</h3>
        </div>
        
        {!isSidebarOpen && (
          <div className='chatroom-header-right'>
            <button className='chatroom-detail-btn' onClick={onOpenSidebar}>상세보기</button>
            <button className='chatroom-book-btn'>예약하기</button>
          </div>
        )}
      </div>

      <div className='chatroom-message-list'>
        {messageList.map((msg, index) => (
          <div key={index} className={`chatroom-message-item ${msg.role}`}>
            <div className='chatroom-bubble-container'>
              <div className='chatroom-bubble'>
                {msg.type === 'image' ? (
                  <img src={msg.text} alt="chat-payload" className="chat-image-content" />
                ) : (
                  msg.text
                )}
              </div>
              <span className='chatroom-time'>{msg.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div className='chatroom-input'>
        <input 
          type="file" 
          accept='image/*' 
          ref={fileInputRef} 
          onChange={uploadImage} 
          style={{display: 'none'}} 
        />
        <button className='chatroom-image-send' onClick={handleImageClick}>
          <FaRegFileImage size={22} />
        </button>
        <input 
          type="text" 
          placeholder='메세지를 입력해 주세요.' 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button className='chatroom-send-btn'>
          <IoSend size={22} />
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;