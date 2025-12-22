import './ChatRoom.css';

const ChatRoom = ({ roomId }) => {
  // 임시 데이터 DB 데이터로 변경
const messages = [
    { id: 1, role: 'cleaner', text: '안녕하세요!', time: '오후 12:00' },
    { id: 2, role: 'owner', text: '네, 견적 확인했습니다.', time: '오후 12:05' },
    { id: 3, role: 'cleaner', text: '일정 변경 가능합니다.', time: '오후 12:14' },
  ];


return (
  <>
  <div className='chatroom-container'>
    <div className='chatroom-header'>
      <div className='chatroom-header-left'>
        <span className='chatroom-back-btn'>←</span>
        <h3 className='chatroom-cleaner-name'>곽효선</h3>
      </div>
      <button className='chatroom-book-btn'>예약하기</button>
    </div>
    <div className='chatroom-message-list'>
      {messages.map((msg) => (
        <div key={msg.id} className={`chatroom-message-item ${msg.role}`}>
          {msg.role === 'cleaner' && <div className='chatroom-avatar'></div>}
          <div className='chatroom-bubble-container'>
            <div className='chatroom-bubble'> {msg.text}</div>
            <span className='chatroom-time'>{msg.time}</span>
          </div>
        </div>
      ))}
    </div>
      <div className='chatroom-input'>
        <button className='chatroom-image-send'>△</button>
        <input type="text" placeholder='메세지를 입력해 주세요.'/>
        <button className='chatroom-send-btn'>↑</button>
      </div>
  </div>
  </>
)
}

export default ChatRoom;