import { useParams } from 'react-router-dom';
import './Chatmain.css'
import ChatRoom from './ChatRoom.jsx'
import ChatSidebarProfile from './ChatSidebarProfile.jsx'
import ChatSidebarRequest from './ChatSidebarRequest.jsx';


const ChatMain = () => {
  const { id } = useParams();
  return (
    <div className='chatmain-container'>
      <div className='chatmain-center'>
        <ChatRoom roomId={id}/>
      </div>
      <div className='chatmain-right'>
        <ChatSidebarProfile roomId={id}/>
      </div>
    </div>
  );
};

export default ChatMain;