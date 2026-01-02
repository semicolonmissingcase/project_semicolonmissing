import axiosInstance from './axiosInstance.js';

const CHAT_API_URL = '/api/chat';
const cleanId = (id) => String(id).replace(/[^0-9]/g, '');

export const getChatRoomDetail = (roomId) => 
  axiosInstance.get(`${CHAT_API_URL}/rooms/${cleanId(roomId)}/sidebar`);

export const getCleanerReviewsForRoom = (roomId) =>
  axiosInstance.get(`${CHAT_API_URL}/rooms/${cleanId(roomId)}/reviews`);

export const getChatMessages = (roomId, page = 1) => 
  axiosInstance.get(`${CHAT_API_URL}/rooms/${cleanId(roomId)}/messages?page=${page}`);

export const sendChatMessage = (roomId, msgData) => 
  axiosInstance.post(`${CHAT_API_URL}/rooms/${cleanId(roomId)}/messages`, msgData);

export const uploadChatImage = (roomId, formData) => 
  axiosInstance.post(`/api/files/chat`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const markMessageAsRead = (roomId) => 
  axiosInstance.patch(`${CHAT_API_URL}/rooms/${cleanId(roomId)}/read`);