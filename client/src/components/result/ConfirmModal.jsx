import React from 'react';
import './ConfirmModal.css';

export default function ConfirmModal({ isOpen, onClose, config }) {
  if (!isOpen || !config) return null;

  const { title, message, confirmText, cancelText, onConfirm, isDelete } = config;

  return (
    <div className="custom-modal-overlay" onClick={onClose}>
      <div className="custom-modal-window" onClick={(e) => e.stopPropagation()}>
        <div className="custom-modal-body">
          <p className="custom-modal-title">{title}</p>
          <p className="custom-modal-message">{message}</p>
        </div>
        
        <div className="custom-modal-footer">
          {/* 취소 버튼이 있을 때만 렌더링 (이미지 속 연한 회색 스타일) */}
          {cancelText && (
            <button className="custom-modal-btn btn-cancel" onClick={onClose}>
              {cancelText}
            </button>
          )}
          
          {/* 확인/삭제 버튼 (isDelete가 true면 레드, 아니면 네이비) */}
          <button 
            className={`custom-modal-btn ${isDelete ? 'btn-delete' : 'btn-confirm'}`}
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
          >
            {confirmText || '확인'}
          </button>
        </div>
      </div>
    </div>
  );
}