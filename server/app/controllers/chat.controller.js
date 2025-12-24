/**
 * @file app/controllers/chat.controller.js
 * @description Chat controller (DB Access & Image Upload)
 * 251223 v1.0.0 seon init
 */
import chatService from '../services/chat.service.js';

/**
 *  채팅방 생성 또는 조회
 */
const createRoom = async (req, res, next) => {
  try {
    const result = await chatService.createOrGetRoom(req.body);
    res.status(200).json({ success: true, data: result.room, isNew: result.isNew });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 *  사용자의 채팅방 목록 조회
 */
const getRooms = async (req, res, next) => {
  try {
    // 현재는 query에서 받지만, 나중에 authMiddleware 적용 시 req.user에서 추출하도록 변경 예정
    const { userId, userRole } = req.query;
    const rooms = await chatService.getRoomsByUser(userId, userRole);
    res.status(200).json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 *  채팅방 메시지 내역 조회 (페이징)
 */
const getMessages = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { page, limit } = req.query;
    const messages = await chatService.getMessages(roomId, page, limit);
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 메시지 전송 및 DB 저장
 */
const chatSendMessage = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { senderId, senderRole, content, type } = req.body;

    const newMessage = await chatService.saveMessage({
      room_id: roomId,
      sender_id: senderId,
      sender_role: senderRole,
      content: content,
      type: type || 'TEXT'
    });

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 메시지 읽음 처리
 */
const markAsRead = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.body; 
    await chatService.markAsRead(roomId, userId);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 *  이미지 파일 업로드
 */
const chatUploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "파일이 업로드 되지 않았습니다." });
    }
    
    // 미들웨어가 저장한 파일명을 사용하여 접근 가능한 URL 생성
    const fileUrl = `/uploads/chat/${req.file.filename}`;

    res.status(200).json({
      success: true,
      url: fileUrl
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 7. 채팅방 나가기 / 닫기
 */
const leaveRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { userName } = req.body;
    await chatService.leaveRoom(roomId, userName);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const closeRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    await chatService.closeRoom(roomId);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  createRoom,
  getRooms,
  getMessages,
  chatSendMessage,
  markAsRead,
  chatUploadImage,
  leaveRoom,
  closeRoom
};