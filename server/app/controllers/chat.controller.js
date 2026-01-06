/**
 * @file app/controllers/chat.controller.js
 * @description
 * 251222 seon init
 */
import chatService from '../services/chat.service.js'

/**
 * 채팅방 생성 또는 조회
 */
const createRoom = async (req, res, next) => {
  try {
    const { id, role } = req.user; 
    const { estimate_id, cleaner_id } = req.body;

    const roomData = {
      estimate_id,
      cleaner_id: role === 'CLEANER' ? id : cleaner_id,
      owner_id: role === 'OWNER' ? id : owner_id
    };

    const result = await chatService.createOrGetRoom(roomData);

    res.status(200).json({ success: true, data: result.room, isNew: result.isNew });
  } catch (error) {
    next(error);
  }
};

/**
 * 사이드바 기본 정보 조회 (점주용 프로필 또는 기사용 의뢰서 요약)
 * GET /api/chat/room/:roomId/sidebar
 */
const getSidebarInfo = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { role } = req.user;

    const result = await chatService.getChatRoomWithSidebar(roomId, role);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * 사이드바 리뷰 목록 조회 (페이징 및 정렬 필터)
 * GET /api/chat/room/:roomId/reviews?page=1&sort=latest
 */
const getSidebarReviews = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { page, sort } = req.query;

    const result = await chatService.getSidebarReviews(roomId, { 
      page: parseInt(page) || 1, 
      sort: sort || 'latest' 
    });
    res.status(200).json({ success: true, data: result });
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
    const { id, role } = req.user; // 토큰에 담긴 정보 활용

    await chatService.markAsRead(roomId, id, role);
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
 * 채팅방 닫기
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
  getSidebarInfo,
  getSidebarReviews,
  getRooms,
  getMessages,
  chatSendMessage,
  markAsRead,
  chatUploadImage,
  leaveRoom,
  closeRoom
};