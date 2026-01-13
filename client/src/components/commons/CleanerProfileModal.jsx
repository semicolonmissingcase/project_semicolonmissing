import React from 'react';
import './CleanerProfileModal.css';

export default function CleanerProfileModal({ isOpen, onClose, cleanerData }) {
  if (!isOpen || !cleanerData) return null;

  return (
    <div className="cleanerprofilemodal-modal-overlay" onClick={onClose}>
      <div className="cleanerprofilemodal-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="cleanerprofilemodal-modal-close-btn" onClick={onClose}>X</button>

        {/* 프로필 이미지 영역 */}
        <div className="cleanerprofilemodal-profile-image-container">
          <img 
            src={cleanerData.profile || "/icons/default-profile.png"} 
            alt={`${cleanerData.name} 기사님`} 
            className="cleanerprofilemodal-profile-modal-img" 
          />
        </div>

        {/* 이름 & 평점 */}
        <h2 className="cleanerprofilemodal-profile-name">
          {cleanerData.name} 기사님 
          <span className="cleanerprofilemodal-name-star">
            <span className="cleanerprofilemodal-star-icon">★</span>
            <span className="cleanerprofilemodal-star-number">
              {cleanerData.star ? Number(cleanerData.star).toFixed(0) : '5'}
            </span>
          </span>
        </h2>

        {/* 소개글 영역 */}
        <div className="cleanerprofilemodal-profile-bio-box">
          {cleanerData.introduction || ""}
        </div>

        {/* 하단 정보 섹션 */}
        <div className="cleanerprofilemodal-profile-info-section">
          <div className="cleanerprofilemodal-info-row">
            <span className="cleanerprofilemodal-info-label">작업 지역</span>
            <div className="cleanerprofilemodal-tag-container">
              {Array.isArray(cleanerData.regions) ? (
                cleanerData.regions.length > 0 ? (
                  cleanerData.regions.map((region, idx) => (
                    <span key={idx} className="cleanerprofilemodal-info-tag">{region}</span>
                  ))
                ) : (
                  <span className="cleanerprofilemodal-no-region">선택된 지역이 없습니다.</span>
                )
              ) : (
                cleanerData.region ? (
                  <span className="cleanerprofilemodal-info-tag">{cleanerData.region}</span>
                ) : (
                  <span className="cleanerprofilemodal-no-region">선택된 지역이 없습니다.</span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}