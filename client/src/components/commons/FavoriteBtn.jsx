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
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} // 버튼 기본 스타일 제거
    >
      {/* 아이콘 대신 CSS 클래스를 가진 span 태그 사용 */}
      {isFavorited ? (
        <span className="icon-heart-fill" title="즐겨찾기 해제"></span>
      ) : (
        <span className="icon-heart-empty" title="즐겨찾기 추가"></span>
      )}

      {/* 로딩 스피너 (필요 시 유지) */}
      {loading && <span className="favoritebtn-loading-spinner"></span>}
    </button>
  )
}