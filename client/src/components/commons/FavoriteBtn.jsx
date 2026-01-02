import React, { useState } from 'react';
import { IoIosHeart, IoMdHeartEmpty } from "react-icons/io";
import './FavoriteBtn.css';
import { toggleCleanerFavorite } from '../../api/axiosOwner.js';

export default function FavoriteButton({ cleanerId, initialIsFavorited, onToggle }) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [loading, setLoading] = useState(false); // API 호출 로딩 상태

  const handleToggleFavorite = async () => {
    try {
      const response = await toggleCleanerFavorite(cleanerId);
      setIsFavorited(response.isFavorited);

      setIsFavorited(prev => !prev); // UI 상태 먼저 변경
      if (onToggle) {
        onToggle(response.isFavorited);
      }
    } catch (error) {
      console.error('좋아요 상태 토글 실패:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggleFavorite}
      className={`favoritebtn-button ${isFavorited ? 'favoritebtn-favorited' : ''}`}
    >
      {isFavorited ? <IoMdHeartEmpty className="favoritebtn-heart-icon favoritebtn-favorited" /> : <IoIosHeart className="heart-icon" />}
      {loading && <span className="favoritebtn-loading-spinner"></span>}
    </button>
  )
}