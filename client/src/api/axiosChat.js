import axiosInstance from './axiosInstance';

// 채팅방 목록 가져오기
export const getChatRooms = () => axiosInstance.get('/api/chat/rooms');

// 특정 방 메시지 가져오기
export const getChatMessages = (roomId, page = 1) => 
  axiosInstance.get(`/api/chat/rooms/${roomId}/messages?page=${page}`);