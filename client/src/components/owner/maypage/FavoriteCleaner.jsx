import React from 'react';
import './FavoriteCleaner.css';

export default function FavoriteCleaner() {
  return (
    <div className="favoritecleaner-tab-container">
      <div className="favoritecleaner-driver-grid">
        {[1, 2].map((i) => (
          <div key={i} className="favoritecleaner-fav-card">
            {/* 기사님 원형 프로필 이미지 */}
            <div className="favoritecleaner-fav-avatar-circle">
              <img 
                src="https://via.placeholder.com/150" 
                alt="기사님" 
                className="favoritecleaner-fav-img" 
              />
            </div>
            
            <div className="favoritecleaner-fav-info">
              <h4>
                OOO 기사님 <span className="favoritecleaner-heart-red">❤</span>
              </h4>
              <p className="favoritecleaner-rating-star">
                <span className="favoritecleaner-star-icon">★</span> 4.8
              </p>
            </div>

            <div className="favoritecleaner-fav-btn-group">
              <button className="favoritecleaner-btn-cancel">찜 취소</button>
              <button className="favoritecleaner-btn-profile">프로필</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}