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
  const [sidebarInfo, setSidebarInfo] = useState({
    sideType: null,
    data: null,
    reviews: [],
  });
  const [isSidebarLoading, setIsSidebarLoading] = useState(true);
  const [sidebarError, setSidebarError] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000', {
      withCredentials: true,
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });

    newSocket.on("authenticated", (data) => {
      setIsAuthenticated(true);
      if (safeid) newSocket.emit("join_room", safeid);
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
        let { sideType, data } = sidebarRes.data.data;

        let reviewsArray = []; 
        if(sideType === 'OWNER') {
          const reviewsRes = await getCleanerReviewsForRoom(safeid);
          reviewsArray = reviewsRes.data.data.reviews || [];

          // [프론트엔드 계산] 리뷰 기반 평균 별점 산출
          if (reviewsArray.length > 0) {
            const totalStar = reviewsArray.reduce((acc, cur) => acc + (Number(cur.star) || 0), 0);
            const averageStar = totalStar / reviewsArray.length;
            // data 객체에 계산된 평균 별점 주입
            data = { ...data, star: averageStar };
          } else {
            data = { ...data, star: 0 };
          }
        }

        setSidebarInfo({ sideType, data, reviews: reviewsArray });
      } catch (err) {
        setSidebarError('정보를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setIsSidebarLoading(false); 
      }
    };
    fetchData();
  }, [safeid]);

  const toggleSidebar = (status) => setIsSidebarOpen(status);

  const renderSidebar = () => {
    if(isSidebarLoading) return <p className="loading-text">정보 로딩 중...</p>;
    if(sidebarError) return <p className="error-text">{sidebarError}</p>;
    const commonProps = { onClose: () => toggleSidebar(false) };

    if (sidebarInfo.sideType === 'OWNER') {
      return <ChatSidebarProfile {...commonProps} data={sidebarInfo.data} reviews={sidebarInfo.reviews} />;
    }
    if (sidebarInfo.sideType === 'CLEANER') {
      return <ChatSidebarRequest {...commonProps} data={sidebarInfo.data} />;
    }
    return null;
  }

  return (
    <div className='chatmain-container'>
      <div className='chatmain-center'>
        {socket && isAuthenticated ? (
          <ChatRoom roomId={safeid} socket={socket} onOpenSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        ) : (
          <div className="chat-loading"><div className="spinner"></div><p>채팅 서버 인증 중...</p></div>
        )}
      </div>
      <div className={`chatmain-right ${isSidebarOpen ? 'open' : ''}`}>{renderSidebar()}</div>
      {isSidebarOpen && <div className="chatmain-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
    </div>
  );
};

export default ChatMain;