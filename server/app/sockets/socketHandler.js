/**
 * @file app/middlewares/socketMiddleware.js
 * @description Socket.io Event Handler (실시간 수신 및 개인 채널 강화 버전)
 */

import chatService from '../services/chat.service.js';
import jwtUtil from '../utils/jwt/jwt.util.js';

export default (io) => {
  const connectedUsers = new Map();

  io.on('connection', (socket) => {
    console.log('✅ 새 소켓 연결:', socket.id);

    /**
     * 사용자 인증 및 개인 채널 조인
     */
    socket.on('authenticate', (data) => {
      try {
        const { token } = data;
        if (!token) throw new Error('토큰이 없습니다.');

        const claims = jwtUtil.getClaimsWithVerifyToken(token);
        const userId = parseInt(claims.sub);
        const userRole = claims.role;

        socket.userId = userId;
        socket.userRole = userRole;
        
        connectedUsers.set(userId, socket.id);

        // [중요] 상대방이 보내는 실시간 메시지 알림을 받기 위해 개인 채널 입장
        socket.join(`user_${userId}`); 
        
        console.log(`👤 사용자 ${userId}(${userRole}) 인증 및 개인 채널(user_${userId}) 입장 완료`);
        socket.emit('authenticated', { success: true });
      } catch (error) {
        console.error('소켓 인증 실패:', error.message);
        socket.emit('error', { message: '인증에 실패하였습니다.' });
      }
    });

    /**
     * 채팅방 입장
     */
    socket.on('join_room', async (roomId) => {
      try {
        if (!socket.userId) throw new Error('인증되지 않은 사용자입니다.');

        // 방 번호를 문자열로 변환하여 조인 (타입 불일치 방지)
        const roomName = String(roomId);
        socket.join(roomName);
        console.log(`🚪 ${socket.userId}가 방 ${roomName}에 입장`);

        // 읽음 처리 및 상대방에게 알림 전송
        await chatService.markAsRead(roomId, socket.userId);
        socket.to(roomName).emit('messages_read', { roomId, userId: socket.userId });
      } catch (error) {
        socket.emit('error', { message: '채팅방 입장 실패' });
      }
    });

    /**
     * 메시지 전송 (DB 저장 및 양방향 실시간 전송)
     */
    socket.on('send_message', async (data) => {
      try {
        if (!socket.userId) throw new Error('인증 필요');

        const { roomId, content, type = 'TEXT' } = data;
        
        // 1. DB 메시지 저장 및 방 상태 업데이트
        const newMessage = await chatService.saveMessage({
          room_id: roomId,
          content: content,
          sender_id: socket.userId,
          sender_role: socket.userRole,
          type: type
        });

        const roomName = String(roomId);

        // 2. 현재 방에 있는 모든 사용자에게 메시지 전송 (나 포함)
        io.to(roomName).emit('receive_message', newMessage);
        
        // 3. 상대방 목록 페이지 실시간 갱신을 위해 상대방 개인 채널로도 전송
        // 서비스에서 채팅방 상세 정보를 가져와 상대방 ID를 식별
        const roomData = await chatService.getChatRoomWithSidebar(roomId, socket.userRole);
        
        // 기사/점주 관계에 따라 상대방 ID 추출 (DB 구조에 따라 로직 확인 필요)
        // 만약 roomData 내부에 상대방 ID 정보가 없다면 chatService에서 추가 조회가 필요할 수 있습니다.
        const receiverId = data.receiverId; // 프론트에서 receiverId를 직접 보내주는 것이 가장 확실합니다.

        if (receiverId) {
          io.to(`user_${receiverId}`).emit('receive_message', newMessage);
          console.log(`🔔 상대방(user_${receiverId})에게 실시간 알림 전송`);
        }

      } catch (error) {
        console.error('메시지 전송 에러:', error.message);
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

        await chatService.leaveRoom(roomId, socket.userRole);
        socket.leave(String(roomId));
        
        console.log(`🚪 ${socket.userId}가 방 ${roomId}에서 퇴장`);
        socket.emit('left_room', { roomId, success: true });
      } catch (error) {
        socket.emit('error', { message: '방 나가기 처리 실패' });
      }
    });

    socket.on('disconnect', () => {
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
      }
      console.log('❌ 사용자 연결 해제:', socket.id);
    });
  });
};