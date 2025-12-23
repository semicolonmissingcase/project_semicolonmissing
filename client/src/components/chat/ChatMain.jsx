import { useState } from 'react';
import { useParams } from 'react-router-dom';
import './Chatmain.css';
import ChatRoom from './ChatRoom.jsx';
import ChatSidebarProfile from './ChatSidebarProfile.jsx';

const ChatMain = () => {
  const { id } = useParams();
  // 1. 사이드바 열림/닫힘 상태 관리
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = (status) => {
    setIsSidebarOpen(status);
  }

  const event = new CustomEvent("chatSidebarStatus", {detail: {isOpen: status}});
  window.dispatchEvent(event);

  return (
    <div className='chatmain-container'>
      <div className='chatmain-center'>
        <ChatRoom roomId={id} onOpenSidebar={() => toggleSidebar(true)} />
      </div>

      <div className={`chatmain-right ${isSidebarOpen ? 'open' : ''}`}>
        <ChatSidebarProfile roomId={id} onClose={() => toggleSidebar(false)} />
      </div>

      {isSidebarOpen && (
        <div className="chatmain-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </div>
  );
};

export default ChatMain;