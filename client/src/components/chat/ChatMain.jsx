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
  const [isAuthenticated, setIsAuthenticated] = useState(false); // [추가] 인증 상태 확인용

  useEffect(() => {
    // 1. 소켓 연결 설정
    const newSocket = io('http://localhost:3000', {
      withCredentials: true,
      reconnectionAttempts: 5,
      timeout: 10000,
    });
    
    // 2. [수정] 연결되자마자 인증 시도
    const token = localStorage.getItem('accessToken');
    if (token) {
      newSocket.emit("authenticate", { token });
    }

    // 3. [추가] 서버로부터 인증 완료 신호를 받았을 때만 실행
    newSocket.on("authenticated", () => {
      console.log("✅ 서버 인증 완료");
      setIsAuthenticated(true);
      
      // 인증이 확실히 된 상태에서만 방에 입장 (그래야 서버 로그가 뜸)
      if (safeid) {
        console.log(`📤 join_room 전송 시도: ${safeid}`);
        newSocket.emit("join_room", safeid);
      }
    });

    // 에러 발생 시 로그 확인용
    newSocket.on("error", (err) => {
      console.error("❌ 소켓 에러:", err.message);
    });

    setSocket(newSocket);

    return () => {
      if (safeid) newSocket.emit("leave_room", { roomId: safeid });
      newSocket.close();
    };
  }, [safeid]);

  const toggleSidebar = (status) => {
    setIsSidebarOpen(status);
  };

  return (
    <div className='chatmain-container'>
      <div className='chatmain-center'>
        {/* [수정] 소켓이 연결되고 '인증'까지 완료되어야 채팅방을 보여줌 */}
        {socket && isAuthenticated ? (
          <ChatRoom 
            roomId={safeid} 
            socket={socket} 
            onOpenSidebar={() => toggleSidebar(true)} 
            isSidebarOpen={isSidebarOpen}
          />
        ) : (
          <div className="chat-loading">채팅 서버 연결 및 인증 중...</div>
        )}
      </div>

      <div className={`chatmain-right ${isSidebarOpen ? 'open' : ''}`}>
        <ChatSidebarProfile 
          roomId={safeid} 
          onClose={() => toggleSidebar(false)} 
        />
      </div>

      {isSidebarOpen && (
        <div className="chatmain-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </div>
  );
};

export default ChatMain;