import cookie from 'cookie';
import chatService from '../services/chat.service.js';
import jwtUtil from '../utils/jwt/jwt.util.js';

export default (io) => {
  const connectedUsers = new Map();

  io.on('connection', async (socket) => {
    try {
      const rawCookies = socket.handshake.headers.cookie || '';
      const parsedCookies = cookie.parse(rawCookies);
      const token = parsedCookies.accessToken;

      if (token) {
        const claims = jwtUtil.getClaimsWithVerifyToken(token);
        socket.userId = parseInt(claims.sub || claims.id);
        socket.userRole = claims.role;

        const userKey = `${socket.userRole}_${socket.userId}`;
        connectedUsers.set(userKey, socket.id);
        
        socket.join(`user_${userKey}`);
        
        socket.emit('authenticated', { success: true, userKey });
      }
    } catch (err) {
      console.error("❌ [Socket] 인증 실패:", err.message);
      socket.emit('error', { message: '인증 실패' });
    }

    socket.on('join_room', async (roomId) => {
      try {
        if (!socket.userId) return;
        const roomName = String(roomId);
        socket.join(roomName);

        await chatService.markAsRead(roomId, socket.userId);
        socket.to(roomName).emit('messages_read', { roomId, userId: socket.userId });
      } catch (error) {
        console.error('입장 에러:', error.message);
      }
    });

    socket.on('mark_as_read', async (data) => {
      try {
        const { roomId } = data;
        const roomName = String(roomId);
        await chatService.markAsRead(roomId, socket.userId);
        socket.to(roomName).emit('messages_read', { roomId, userId: socket.userId });
      } catch (error) {
        console.error('읽음 처리 에러:', error.message);
      }
    });

    socket.on('send_message', async (data) => {
      try {
        const { roomId, content, type = 'TEXT' } = data;
        if (!socket.userId || !roomId) return;

        const roomName = String(roomId);

        const newMessage = await chatService.saveMessage({
          room_id: roomId,
          content: content,
          sender_id: socket.userId,
          sender_role: socket.userRole,
          type
        });


        io.to(roomName).emit('receive_message', newMessage);

        const roomInfo = await chatService.getChatRoomWithSidebar(roomId, socket.userRole);
        const roomData = roomInfo.data; 
        const isOwner = socket.userRole === 'OWNER';
        const opponentId = isOwner ? roomData.cleanerId : roomData.ownerId;
        const opponentRole = isOwner ? 'CLEANER' : 'OWNER';

        if (opponentId) {
          const opponentKey = `user_${opponentRole}_${opponentId}`;
          
          socket.to(`user_${opponentKey}`).emit('new_notification', {
            ...newMessage,
            roomName: roomData.cleanerName || roomData.ownerName
          });
        }

      } catch (error) {
        console.error('❌ 전송 실패:', error.message);
        socket.emit('error', { message: '메시지 전송 실패' });
      }
    });

    socket.on('disconnect', () => {
      if (socket.userId) {
        connectedUsers.delete(`${socket.userRole}_${socket.userId}`);
      }
    });
  });
};