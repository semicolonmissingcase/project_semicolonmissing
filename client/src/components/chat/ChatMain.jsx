import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import './ChatMain.css';
import ChatRoom from './ChatRoom.jsx';
import ChatSidebarProfile from './ChatSidebarProfile.jsx';

const ChatMain = () => {
  const { id: rawId } = useParams();
  const safeid = rawId ? rawId.replace(/[^0-9]/g, '') : null;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [socket, setSocket] = useState(null); 

  useEffect(() => {
    const newSocket = io('http://localhost:3000', {
      withCredentials: true,
      reconnectionAttempts: 5,
      timeout: 10000,
    });
    
    setSocket(newSocket);

    if (safeid) {
      newSocket.emit("join_room", safeid);
    }

    return () => {
      if (safeid) newSocket.emit("leave_room", safeid);
      newSocket.close();
    };
  }, [safeid]);

  const toggleSidebar = (status) => {
    setIsSidebarOpen(status);
  };

  return (
    <div className='chatmain-container'>
      <div className='chatmain-center'>
        {socket ? (
          <ChatRoom 
            roomId={safeid} 
            socket={socket} 
            onOpenSidebar={() => toggleSidebar(true)} 
            isSidebarOpen={isSidebarOpen}
          />
        ) : (
          <div className="chat-loading">채팅 서버 연결 중...</div>
        )}
      </div>

      {/* 사이드바 영역 */}
      <div className={`chatmain-right ${isSidebarOpen ? 'open' : ''}`}>
        <ChatSidebarProfile 
          roomId={safeid} 
          onClose={() => toggleSidebar(false)} 
        />
      </div>

      {/* 모바일용 배경 어둡게 처리 */}
      {isSidebarOpen && (
        <div className="chatmain-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </div>
  );
};

export default ChatMain;