/**
 * @file app/services/owner/owner.like.service.js
 * @description 좋아요 Service
 * 260102 CK init
 */

import ownerLikeRepository from "../../repositories/owner/owner.like.repository.js";

/**
 * 점주와 기사님 간의 좋아요 상태
 * @param {number} ownerId 
 * @param {number} cleanerId
 */
async function toggleFavorite(ownerId, cleanerId) {
  const existingLike = await ownerLikeRepository.findByOwnerIdAndCleanerId(ownerId, cleanerId);
  
  if(existingLike) {
    // 좋아요 누른 상태면 취소
    await ownerLikeRepository.deleteLike(ownerId, cleanerId);
    return false; // 좋아요 아님
  } else {
    // 좋아요 누르지 않은 상태면 추가
    await ownerLikeRepository.createLike(ownerId, cleanerId);
    return true; // 좋아요
  }
}

/**
 * 찜한 기사님 목록 조회
 * @param {number} ownerId 
 */
async function getFavoriteCleaners(ownerId) {
  const favoriteCleaners = await ownerLikeRepository.findFavoriteCleanersByOwnerId(ownerId);
  
  return favoriteCleaners;
}

export default {
  toggleFavorite,
  getFavoriteCleaners,
}