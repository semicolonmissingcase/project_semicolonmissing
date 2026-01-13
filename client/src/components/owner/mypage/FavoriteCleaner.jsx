import React, { useEffect, useState } from 'react';
import './FavoriteCleaner.css';
import FavoriteButton from '../../commons/FavoriteBtn.jsx';
import { getLikedCleaners } from '../../../api/axiosOwner.js';
import CleanerProfileModal from '../../commons/CleanerProfileModal.jsx';
import { useNavigate } from 'react-router-dom';

export default function FavoriteCleaner() {
  const navigate = useNavigate();
  const [likedCleaners, setLikedCleaners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCleaner, setSelectedCleaner] = useState(null);

  const fetchFavoriteCleaners = async () => {
    setIsLoading(true);
    try {
      const data = await getLikedCleaners();

      if (Array.isArray(data)) {
        setLikedCleaners(data);
      } else {
        setError(new Error("서버 응답 형식이 올바르지 않습니다."));
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoriteCleaners();
  }, []);

  const handleToggle = (cleanerId, isFavorited) => {
    if(!isFavorited) {
      setLikedCleaners(prevCleaners => {
        const updatedList = prevCleaners.filter(cleaner => cleaner.id !== cleanerId);
        return updatedList;
      });
    }
  };

  function ownerQuteList() {
    navigate('/owners/reservation'); 
  }

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

  const cleanersToRender = Array.isArray(likedCleaners) ? likedCleaners : [];

  if (cleanersToRender.length === 0) {
    return (
      <div className="favoritecleaner-tab-container">
        <p className="favoritecleaner-no-items">찜한 기사님이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="favoritecleaner-tab-container">
      <div className="favoritecleaner-driver-grid">
        {cleanersToRender.map((cleaner) => (
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
                <FavoriteButton cleanerId={cleaner.id} 
                  initialIsFavorited={true} onToggle={handleToggle} /></span>
              </h4>
              <p className="favoritecleaner-rating-star">
                <span className="favoritecleaner-star-icon">★</span>
                {cleaner.star ? Number(cleaner.star).toFixed(1) : '평점 없음'} 
              </p>
            </div>

            <div className="favoritecleaner-fav-btn-group">
              <button 
                className="favoritecleaner-btn-request"
                onClick={ownerQuteList}
              >
                요청서 보내기
              </button>
              
              <button 
                className="favoritecleaner-btn-profile"
                onClick={() => openProfile(cleaner)}
              >
                프로필
              </button>
            </div>
          </div>
        ))}
      </div>
            {/* 기사님 프로필 모달 */}
            {isModalOpen && selectedCleaner && (
              <CleanerProfileModal 
                isOpen={isModalOpen}
                onClose={closeModal}
                cleanerData={selectedCleaner}
              />
            )}
    </div>
  );
}