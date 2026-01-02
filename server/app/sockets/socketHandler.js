import cookie from 'cookie';
import chatService from '../services/chat.service.js';
import jwtUtil from '../utils/jwt/jwt.util.js';

export default (io) => {
  const connectedUsers = new Map();

  io.on('connection', async (socket) => {
    // 1. 쿠키 기반 자동 인증 (기존 로직 유지)
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
        
        // 개인 알림용 채널 입장 (방 밖에 있을 때 알림을 받기 위함)
        socket.join(`user_${userKey}`);
        
        socket.emit('authenticated', { success: true, userKey });
      }
    } catch (err) {
      console.error("❌ [Socket] 인증 실패:", err.message);
      socket.emit('error', { message: '인증 실패' });
    }

    // 2. 채팅방 입장 (기존 로직 유지)
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

    // 4. 실시간 읽음 신호 수신 (기존 로직 유지)
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

    // 3. 메시지 전송 및 실시간 브로드캐스트 (중복 수정 완료)
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
        // 채팅방 내부의 메시지 목록을 업데이트하는 용도입니다.
        io.to(roomName).emit('receive_message', newMessage);

        // (3) 상대방이 방 밖에 있을 경우를 위한 개인 알림 전송 (수정 포인트)
        const roomInfo = await chatService.getChatRoomWithSidebar(roomId, socket.userRole);
        const roomData = roomInfo.data; 
        const isOwner = socket.userRole === 'OWNER';
        const opponentId = isOwner ? roomData.cleanerId : roomData.ownerId;
        const opponentRole = isOwner ? 'CLEANER' : 'OWNER';

        if (opponentId) {
          const opponentKey = `user_${opponentRole}_${opponentId}`;
          
          // [핵심] 이벤트 이름을 'receive_message'에서 'new_notification'으로 변경
          // 이렇게 해야 채팅창 안에서 중복으로 메시지가 쌓이지 않습니다.
          socket.to(`user_${opponentKey}`).emit('new_notification', {
            ...newMessage,
            roomName: roomData.cleanerName || roomData.ownerName // 알림창에 띄울 이름 추가
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