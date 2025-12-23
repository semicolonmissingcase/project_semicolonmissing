/**
 * @file app/controllers/chat.controller.js
 * @description Chat controller (DB Access)
 * 251222 v1.0.0 seon init
 */
import chatService from '../services/chat.service.js';

const createRoom = async (req, res, next) => {
  try {
    const result = await chatService.createOrGetRoom(req.body);
    res.status(200).json({ success: true, data: result.room, isNew: result.isNew });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRooms = async (req, res, next) => {
  try {
    const { userId, userRole } = req.query;
    const rooms = await chatService.getRoomsByUser(userId, userRole);
    res.status(200).json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

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

const chatUploadImage = async (req, res, next) => {
  try {
    if(!req.file) {
      return res.status(400).json({success: false, message: "파일이 업로드 되지 않았습니다."})
    }
    const fileUrl = `/uploads/chat/${req.file.filename}`;

    res.status(200).json({
      success: true,
      url: fileUrl
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message});
  }
}

export default {
  createRoom,
  getRooms,
  getMessages,
  markAsRead,
  leaveRoom,
  closeRoom,
  chatUploadImage
};