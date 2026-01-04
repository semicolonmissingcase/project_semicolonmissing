import React, { useState } from 'react';
import { IoIosHeart, IoMdHeartEmpty } from "react-icons/io";
import './FavoriteBtn.css';
import { toggleCleanerFavorite } from '../../api/axiosOwner.js';

export default function FavoriteButton({ cleanerId, initialIsFavorited, onToggle }) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [loading, setLoading] = useState(false); // API 호출 로딩 상태

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    setLoading(true);

    try {
      const response = await toggleCleanerFavorite(cleanerId);

      setIsFavorited(response.isFavorited);

      if (onToggle) {
        onToggle(cleanerId, response.isFavorited);
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
      disabled={loading}
      className={`favoritebtn-button ${isFavorited ? 'favoritebtn-favorited' : ''}`}
    >
      {isFavorited ? <IoIosHeart className="favoritebtn-heart-icon favoritebtn-favorited" /> : <IoMdHeartEmpty className="favoritebtn-heart-icon" />}
      {loading && <span className="favoritebtn-loading-spinner"></span>}
    </button>
  )
}