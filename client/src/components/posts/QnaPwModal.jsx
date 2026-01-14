import React, { useState } from 'react';
import './QnaPwModal.css';

export default function QnaPwModal({ isOpen, onClose, onSubmit, errorPassword }) {
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(password);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="qnapwmodal-overlay" onClick={handleOverlayClick}>
      <div className="qnapwmodal-container">
        <h2 className="qnapwmodal-title">비밀글</h2>
        
        <form className="qnapwmodal-form" onSubmit={handleSubmit}>
          <input
            type="password"
            className="qnapwmodal-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            autoFocus
          />
          
          {errorPassword && (
            <p className="qnapwmodal-error-text">{errorPassword}</p>
          )}

          <button type="submit" className="qnapwmodal-submit-btn">
            확인
          </button>
        </form>
      </div>
    </div>
  );
}