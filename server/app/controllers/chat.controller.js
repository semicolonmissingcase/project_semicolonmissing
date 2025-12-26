/**
 * @file app/controllers/chat.controller.js
 * @description Chat controller
 * 251223 v1.0.0 seon init
 */
import chatService from '../services/chat.service.js'

/**
 * 채팅방 생성 또는 조회
 */
const createRoom = async (req, res, next) => {
  try {
    const ownerId = req.user.id; 
    const { estimate_id, cleaner_id } = req.body;

    const result = await chatService.createOrGetRoom({
      estimate_id,
      cleaner_id,
      owner_id: ownerId
    });

    res.status(200).json({ success: true, data: result.room, isNew: result.isNew });
  } catch (error) {
    next(error);
  }
};

/**
 * 사용자의 채팅방 목록 조회
 */
const getRooms = async (req, res, next) => {
  try {
    const { id, role } = req.user; 
    
    const rooms = await chatService.getRoomsByUser(id, role);
    res.status(200).json({ success: true, data: rooms });
  } catch (error) {
    next(error);
  }
};

/**
 * 채팅방 메시지 내역 조회
 */
const getMessages = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { page, limit } = req.query;
    
    const messages = await chatService.getMessages(roomId, page, limit);
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

/**
 * 메시지 전송 및 DB 저장
 */
const chatSendMessage = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { content, type } = req.body;
    const { id, role } = req.user;

    const newMessage = await chatService.saveMessage({
      room_id: roomId,
      sender_id: id,
      sender_role: role,
      content: content,
      type: type || 'TEXT'
    });

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    next(error);
  }
};

/**
 * 메시지 읽음 처리
 */
const markAsRead = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { id } = req.user; 

    await chatService.markAsRead(roomId, id);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

/**
 * 이미지 파일 업로드
 */
const chatUploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "파일이 업로드 되지 않았습니다." });
    }
    
    // 접근 가능한 정적 경로 생성
    const fileUrl = `/uploads/chat/${req.file.filename}`;

    res.status(200).json({ success: true, url: fileUrl });
  } catch (error) {
    next(error);
  }
};

/**
 * 채팅방 나가기
 */
const leaveRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { role } = req.user;

    await chatService.leaveRoom(roomId, role);
    res.status(200).json({ success: true, message: "채팅방이 목록에서 제거되었습니다." });
  } catch (error) {
    next(error);
  }
};

/**
 * 채팅방 닫기 (의뢰서 기간 마감이나 견적 마감 종료 시 닫는 로직)
 */
const closeRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    await chatService.closeRoom(roomId);
    res.status(200).json({ success: true, message: "상담이 종료되었습니다." });
  } catch (error) {
    next(error);
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