import React, { useEffect } from 'react';
import './FavoriteCleaner.css';
import FavoriteButton from '../../commons/FavoriteBtn.jsx';
import { getLikedCleaners } from '../../../api/axiosOwner.js';

export default function FavoriteCleaner({ cleaners, onRemoveFavorite }) {
  const displayCleaners = cleaners || [];
  const [likedCleaners, setLikedCleaners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCleaner, setSelectedCleaner] = useState(null);

  useEffect(() => {
    const fetchFavoriteCleaners = async () => {
      try {
        setIsLoading(true);
        const response = await getLikedCleaners();
        setLikedCleaners(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFavoriteCleaners();
  }, []);

  // 프로필 모달
  const openProfile = (cleaner) => {
    setSelectedCleaner(cleaner);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCleaner(null);
  };
  
  if(isLoading) {
    return <div className="favoritecleaner-text">찜한 기사님 목록을 불러오는 중입니다...</div>;
  }

  if(error) {
    return <div className="favoritecleaner-text">오류가 발생했습니다. : {error.message}</div>;
  }

  if(displayCleaners.length === 0) {
    return (
      <div className="favoritecleaner-tab-container">
        <p className="favoritecleaner-no-items">찜한 기사님이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="favoritecleaner-tab-container">
      <div className="favoritecleaner-driver-grid">
        {displayCleaners.map((cleaner) => (
          <div key={cleaner.id} className="favoritecleaner-fav-card">
            {/* 기사님 원형 프로필 이미지 */}
            <div className="favoritecleaner-fav-avatar-circle">
              <img 
                src={cleaner.profileImage || "/icons/default-profile.png"} 
                alt={`${cleaner.name} 기사님`} 
                className="favoritecleaner-fav-img" 
              />
            </div>
            
            <div className="favoritecleaner-fav-info">
              <h4>
                {cleaner.name} 기사님 <span className="favoritecleaner-heart-red">
                <FavoriteButton cleanerId={cleaner.id} isFavorited={true} onToggleFavorite={onRemoveFavorite}/></span>
              </h4>
              <p className="favoritecleaner-rating-star">
                <span className="favoritecleaner-star-icon">★</span>
                {cleaner.star ? cleaner.star.toFixed(1) : '평점 없음'} 
              </p>
            </div>

            <div className="favoritecleaner-fav-btn-group">
              <button className="favoritecleaner-btn-cancel"
                onClick={() => onRemoveFavorite && onRemoveFavorite(cleaner.id)}>
                  찜 취소</button>
              <button className="favoritecleaner-btn-profile"
                isOpen={openProfile}
                onClose={closeModal}
                data={selectedCleaner}
              >프로필</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}