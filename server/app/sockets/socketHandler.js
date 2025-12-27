/**
 * @file app/middlewares/socketMiddleware.js
 * @description Socket.io Event Handler
 * 251218 v1.0.0 seon init
 */

import chatService from '../services/chat.service.js';
import jwtUtil from '../utils/jwt/jwt.util.js';

export default (io) => {
  const connectedUsers = new Map();

  io.on('connection', (socket) => {
    console.log('✅ 새 소켓 연결:', socket.id);

    /**
     * 사용자 인증 (토큰 기반)
     */
    socket.on('authenticate', (data) => {
      try {
        const { token } = data;
        if (!token) throw new Error('토큰이 없습니다.');

        const claims = jwtUtil.getClaimsWithVerifyToken(token);
        const userId = parseInt(claims.sub);
        const userRole = claims.role;

        // 소켓 객체에 유저 정보 저장
        socket.userId = userId;
        socket.userRole = userRole;
        
        connectedUsers.set(userId, socket.id);
        console.log(`👤 사용자 ${userId}(${userRole}) 인증 완료`);
        
        socket.emit('authenticated', { success: true });
      } catch (error) {
        console.error('소켓 인증 실패:', error.message);
        socket.emit('error', { message: '인증에 실패하였습니다.' });
      }
    });

    /**
     * 채팅방 입장 (읽음 처리 연동)
     */
    socket.on('join_room', async (roomId) => {
      try {
        if (!socket.userId) throw new Error('인증되지 않은 사용자입니다.');

        socket.join(roomId);
        console.log(`🚪 ${socket.userId}가 방 ${roomId}에 입장`);

        // 읽음 처리 업데이트 및 상대방에게 알림
        await chatService.markAsRead(roomId, socket.userId);
        socket.to(roomId).emit('messages_read', { roomId, userId: socket.userId });
      } catch (error) {
        socket.emit('error', { message: '채팅방 입장 실패' });
      }
    });

    /**
     * 메시지 전송 (DB 저장 및 부활 로직 포함)
     */
    socket.on('send_message', async (data) => {
      try {
        if (!socket.userId) throw new Error('인증 필요');

        const { roomId, content, type = 'TEXT' } = data;
        const newMessage = await chatService.saveMessage({
          room_id: roomId,
          content: content,
          sender_id: socket.userId,
          sender_role: socket.userRole,
          type: type
        });

        // 방 전체에 실시간 메시지 전송
        io.to(roomId).emit('receive_message', newMessage);

      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    /**
     * 채팅방 나가기
     */
    socket.on('leave_room', async (data) => {
      try {
        const { roomId } = data;
        if (!socket.userId) return;

        // DB에 개별 나가기 시간(leavedAt) 기록
        await chatService.leaveRoom(roomId, socket.userRole);
        
        // 소켓 방 퇴장
        socket.leave(roomId);
        console.log(`🚪 ${socket.userId}가 방 ${roomId}에서 나감 (leavedAt 기록)`);
        
        socket.emit('left_room', { roomId, success: true });
      } catch (error) {
        socket.emit('error', { message: '방 나가기 처리 실패' });
      }
    });

    /**
     * 연결 해제
     */
    socket.on('disconnect', () => {
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
      }
      console.log('❌ 사용자 연결 해제:', socket.id);
    });
  });
};