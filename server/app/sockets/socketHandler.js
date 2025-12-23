/**
 * @file app/middlewares/socketMiddleware.js
 * @description Socket.io Event Handler
 * 251218 v1.0.0 seon init
 */

import chatService from '../services/chat.service.js';

export default (io) => {
  // 연결된 사용자 추적
  const connectedUsers = new Map();

  io.on('connection', (socket) => {
    console.log('✅ 새 사용자 연결:', socket.id);

    // 사용자 인증
    socket.on('authenticate', (userId) => {
      connectedUsers.set(userId, socket.id);
      socket.userId = userId;
      console.log(`👤 사용자 ${userId} 인증 완료`);
    });

    // 채팅방 입장
    socket.on('join_room', async (roomId) => {
      try {
        socket.join(roomId);
        console.log(`🚪 ${socket.userId}가 방 ${roomId}에 입장`);

        // 읽음 처리
        await chatService.markAsRead(roomId, socket.userId);
        socket.to(roomId).emit('messages_read', { roomId });
      } catch (error) {
        console.error('채팅방 입장 오류:', error);
        socket.emit('error', { message: '채팅방 입장 실패' });
      }
    });

    // 메시지 전송
    socket.on('send_message', async (data) => {
      try {
        const { roomId, content, senderId, senderRole } = data;

        // 메시지 저장
        const newMessage = await chatService.saveMessage({
          room_id: roomId,
          content: content,
          sender_id: senderId,
          sender_role: senderRole
        });

        // 같은 방에 있는 모든 사용자에게 전송
        io.to(roomId).emit('receive_message', newMessage);

        console.log(`💬 메시지 전송: ${senderId} → 방 ${roomId}`);
      } catch (error) {
        console.error('메시지 전송 오류:', error);
        socket.emit('error', { message: error.message || '메시지 전송 실패' });
      }
    });

    // 채팅방 나가기
    socket.on('leave_room', async (data) => {
      try {
        const { roomId, userName } = data;
        
        // 시스템 메시지 저장
        await chatService.leaveRoom(roomId, userName);
        
        // 방에 있는 다른 사람들에게 알림
        io.to(roomId).emit('user_left', {
          message: `${userName}님이 채팅방을 나갔습니다.`,
          roomId
        });
        
        // 소켓 방 나가기
        socket.leave(roomId);
        console.log(`🚪 ${userName}가 방 ${roomId}에서 퇴장`);
      } catch (error) {
        console.error('채팅방 나가기 오류:', error);
        socket.emit('error', { message: '채팅방 나가기 실패' });
      }
    });

    // 타이핑 중 알림
    socket.on('typing', (data) => {
      socket.to(data.roomId).emit('user_typing', {
        userId: socket.userId,
        isTyping: data.isTyping
      });
    });

    // 연결 해제
    socket.on('disconnect', () => {
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
      }
      console.log('❌ 사용자 연결 해제:', socket.id);
    });
  });
};