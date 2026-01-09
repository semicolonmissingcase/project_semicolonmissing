import React from "react";
import "./NameEditModal.css";

function NameEditModal({ isOpen, tempName, setTempName, onCancel, onSave }) {
  if (!isOpen) return null;

  return (
    <div className="name-edit-modal-backdrop">
      <div className="name-edit-modal-content">
        <h3>이름 수정</h3>
        <input
          type="text"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          className="name-edit-modal-input"
          placeholder="새 이름을 입력하세요"
          autoFocus
        />
        <div className="name-edit-modal-actions">
          <button
            type="button"
            className="name-edit-modal-btn-cancel"
            onClick={onCancel}
          >
            취소
          </button>
          <button
            type="button"
            className="name-edit-modal-btn-submit"
            onClick={onSave}
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default NameEditModal;