import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { getChatRoomDetail, getCleanerReviewsForRoom } from '../../api/axiosChat';
import './ChatMain.css';
import ChatRoom from './ChatRoom.jsx';
import ChatSidebarProfile from './ChatSidebarProfile.jsx';
import ChatSidebarRequest from './ChatSidebarRequest.jsx';

const ChatMain = () => {
  const { id: rawId } = useParams();
  const safeid = rawId ? rawId.replace(/[^0-9]/g, '') : null;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [socket, setSocket] = useState(null); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ sidebarInfo, setSidebarInfo ] = useState({
    sideType: null,
    data: null,
    reviews: [],
  });
  const [isSidebarLoading, setIsSidebarLoading] = useState(true);
  const [sidebarError, setSidebarError] = useState(null);

  useEffect(() => {
    // 서버가 연결 즉시 브라우저의 쿠키를 읽어 인증
    const newSocket = io('http://localhost:3000', {
      withCredentials: true,
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });

    newSocket.on("authenticated", (data) => {
      console.log("✅ 서버 쿠키 인증 완료:", data.userKey);
      setIsAuthenticated(true);
      
      // 인증 완료 직후 방 입장
      if (safeid) {
        console.log(`📤 방 입장 요청 (roomId: ${safeid})`);
        newSocket.emit("join_room", safeid);
      }
    });

    // 인증 실패 또는 토큰 만료 시
    newSocket.on("error", (err) => {
      console.error("❌ 소켓 인증/연결 에러:", err.message);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        if (safeid) newSocket.emit("leave_room", { roomId: safeid });
        newSocket.disconnect();
      }
    };
  }, [safeid]);

  useEffect(() => {
    if(!safeid) {
      setIsSidebarLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsSidebarLoading(true);
      setSidebarError(null);
      try {
        const sidebarRes = await getChatRoomDetail(safeid);
        const { sideType, data } = sidebarRes.data.data;

        let reviewsData = [];
        if(sideType === 'OWNER') {
          const reviewsRes = await getCleanerReviewsForRoom(safeid);
          reviewsData = reviewsRes.data.data;
        }

        setSidebarInfo({ sideType, data, reviews: reviewsData });
      } catch (err) {
        setSidebarError('정보를 불러오는 데 실패했습니다.');
        console.error("사이드바 데이터 로딩 에러", err);
      } finally {
        setIsSidebarLoading(false); // <--- CORRECTED LINE
      }
    };
    fetchData();
  }, [safeid]);

  const toggleSidebar = (status) => {
    setIsSidebarOpen(status);
  };

  const renderSidebar = () => {
    if(isSidebarLoading) return <p>정보 로딩 중...</p>;
    if(sidebarError) return <p>{sidebarError}</p>;

    const commonProps = {
      onClose: () => toggleSidebar(false),
    };
    if (sidebarInfo.sideType === 'OWNER') {
      return (
        <ChatSidebarProfile {...commonProps} data={sidebarInfo.data} reviews={sidebarInfo.reviews} />
      );
    }
    if (sidebarInfo.sideType === 'CLEANER') {
      return (
        <ChatSidebarRequest {...commonProps} data={sidebarInfo.data} />
      );
    }
    return null;
  }

  return (
    <div className='chatmain-container'>
      <div className='chatmain-center'>
        {socket && isAuthenticated ? (
          <ChatRoom 
            roomId={safeid} 
            socket={socket} 
            onOpenSidebar={toggleSidebar} 
            isSidebarOpen={isSidebarOpen}
          />
        ) : (
          <div className="chat-loading">
            <div className="spinner"></div>
            <p>채팅 서버 인증 중...</p>
          </div>
        )}
      </div>

      <div className={`chatmain-right ${isSidebarOpen ? 'open' : ''}`}>
        {renderSidebar()}
      </div>

      {isSidebarOpen && (
        <div className="chatmain-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </div>
  );
};

export default ChatMain;