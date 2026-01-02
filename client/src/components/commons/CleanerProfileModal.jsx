import React from 'react';
import './ProfileModal.css';

export default function ProfileModal({ isOpen, onClose, data }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* 닫기 버튼 */}
        <button className="modal-close-btn" onClick={onClose}>X</button>

        {/* 프로필 이미지 영역 */}
        <div className="profile-image-container">
          <div className="profile-image-placeholder">
            기사님 프로필 사진
          </div>
        </div>

        {/* 점주/기사 이름 */}
        <h2 className="profile-name">OOO 기사님</h2>

        {/* 소개글 영역 (빈 칸) */}
        <div className="profile-bio-box"></div>

        {/* 하단 정보 섹션 */}
        <div className="profile-info-section">
          <div className="info-row">
            <span className="info-label">작업 지역</span>
            <div className="tag-container">
              <span className="info-tag">대구</span>
              <span className="info-tag">경북</span>
              <span className="info-tag">구미</span>
              <span className="info-tag">경산</span>
            </div>
          </div>

          <div className="info-row career-row">
            <span className="info-label">경력</span>
            <span className="career-value">5년</span>
          </div>
        </div>
      </div>
    </div>
  );
}