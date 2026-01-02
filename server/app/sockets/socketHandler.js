import cookie from 'cookie';
import chatService from '../services/chat.service.js';
import jwtUtil from '../utils/jwt/jwt.util.js';

export default (io) => {
  const connectedUsers = new Map();

  io.on('connection', async (socket) => {
    // 1. 쿠키 기반 자동 인증
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
        
        // 개인 알림용 채널 입장
        socket.join(`user_${userKey}`);
        
        console.log(`✅ [Socket] 인증 및 개인채널 입장: ${userKey}`);

        // 프론트엔드에 인증 완료 신호 전송
        socket.emit('authenticated', { success: true, userKey });
      }
    } catch (err) {
      console.error("❌ [Socket] 인증 실패:", err.message);
      socket.emit('error', { message: '인증 실패' });
    }

    // 2. 채팅방 입장 (실시간의 핵심)
    socket.on('join_room', async (roomId) => {
      try {
        if (!socket.userId) return;
        
        // [중요] 모든 roomId는 문자열로 통일하여 관리
        const roomName = String(roomId);
        
        // 기존에 혹시 들어가있던 방이 있다면 정리 (선택사항)
        // socket.rooms.forEach(room => { if(room !== socket.id) socket.leave(room); });

        socket.join(roomName);
        console.log(`🚪 [Join] 유저 ${socket.userId}(${socket.userRole}) -> 방 ${roomName}`);

        // 입장 시 읽음 처리
        await chatService.markAsRead(roomId, socket.userId);
        
        // 상대방에게 내가 읽었음을 알림
        socket.to(roomName).emit('messages_read', { roomId, userId: socket.userId });
      } catch (error) {
        console.error('입장 에러:', error.message);
      }
    });

    // 3. 메시지 전송 및 실시간 브로드캐스트
    socket.on('send_message', async (data) => {
      try {
        const { roomId, content, type = 'TEXT' } = data;
        if (!socket.userId || !roomId) return;

        const roomName = String(roomId);

        // (1) DB 저장
        const newMessage = await chatService.saveMessage({
          room_id: roomId,
          content: content,
          sender_id: socket.userId,
          sender_role: socket.userRole,
          type
        });

        // (2) 해당 방에 있는 모든 유저에게 전송 (본인 포함)
        // io.to를 써야 내 화면과 상대방 화면에 동시에 뜹니다.
        io.to(roomName).emit('receive_message', newMessage);
        console.log(`✉️ [Msg] 방 ${roomName} 전송: ${content.substring(0, 10)}...`);

        // (3) 상대방이 방 밖에 있을 경우를 위한 개인 알림 전송
        const roomInfo = await chatService.getChatRoomWithSidebar(roomId, socket.userRole);
        const roomData = roomInfo.data; 
        const isOwner = socket.userRole === 'OWNER';
        const opponentId = isOwner ? roomData.cleanerId : roomData.ownerId;
        const opponentRole = isOwner ? 'CLEANER' : 'OWNER';

        if (opponentId) {
          const opponentKey = `user_${opponentRole}_${opponentId}`;
          // 상대방 개인 채널로 한 번 더 쏴줌 (방에 없더라도 알림을 받게 함)
          socket.to(opponentKey).emit('receive_message', newMessage);
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