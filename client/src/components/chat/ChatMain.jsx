import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { 
  getChatRoomDetail, 
  getCleanerReviewsForRoom,
  getQuotationDetail 
} from '../../api/axiosChat.js'; 
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
  try {
    const sidebarRes = await getChatRoomDetail(safeid);
    const { sideType, data: baseData } = sidebarRes.data.data;

    let finalData = baseData;
    let reviewsArray = [];

    if (sideType === 'OWNER') {
      const reviewsRes = await getCleanerReviewsForRoom(safeid);
      reviewsArray = reviewsRes.data.data.reviews || [];
    } 
    else if (sideType === 'CLEANER') {
      const qId = baseData.reservationId || baseData.id || 1; 

      try {
        const quoteRes = await getQuotationDetail(qId);
        const detail = quoteRes.data.data;

        finalData = {
          ownerName: detail.reservation.owner.name,
          storeName: detail.reservation.store.name,
          wishDate: detail.reservation.date,
          wishTime: detail.reservation.time,
          // 주소 합치기 (addr1, addr2, addr3)
          storeAddress: `${detail.reservation.store.addr1} ${detail.reservation.store.addr2} ${detail.reservation.store.addr3}`,
          
          qaList: detail.submissions.map((sub) => {
            if (sub.answerText) return { question: sub.question?.content || "기타", answer: sub.answerText };

            const selectedOption = sub.question?.questionOptions?.find(opt => opt.id === sub.questionOptionId);
            return {
              question: sub.question?.content || "질문 정보 없음",
              answer: selectedOption ? selectedOption.correct : "답변 정보 없음"
            };
          })
        };
      } catch (err) {
        console.error("상세 정보 로드 실패:", err);
        finalData = { ...baseData, storeAddress: baseData.region };
      }
    }

    setSidebarInfo({ sideType, data: finalData, reviews: reviewsArray });
  } catch (err) {
    setSidebarError('정보를 불러오지 못했습니다.');
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
      return (
        <ChatSidebarProfile 
          {...commonProps} 
          data={sidebarInfo.data} 
          reviews={sidebarInfo.reviews}
          sideType={sidebarInfo.sideType} 
        />
      );
    }
    
    if (sidebarInfo.sideType === 'CLEANER') {
      return (
        <ChatSidebarRequest 
          {...commonProps} 
          data={sidebarInfo.data} 
        />
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
            <p>채팅 서버 연결 중...</p>
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