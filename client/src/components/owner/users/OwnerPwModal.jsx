import React, { useState } from "react";
import "./OwnerPwModal.css";

function OwnerPwModal({ isOpen, onClose }) {
  const [pwData, setPwData] = useState({
    currentPw: "",
    newPw: "",
    confirmPw: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPwData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 비밀번호 변경 로직 (API 호출 등)
    console.log("비밀번호 변경 데이터:", pwData);
    alert("비밀번호가 변경되었습니다.");
    onClose();
  };

  return (
    <div className="owner-pw-modal-overlay">
      <div className="owner-pw-modal-container">
        <div className="owner-pw-modal-header">
          <h3>비밀번호 변경</h3>
          <button className="owner-pw-modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        <form className="owner-pw-modal-form" onSubmit={handleSubmit}>
          <div className="owner-pw-modal-field">
            <label htmlFor="currentPw">현재 비밀번호</label>
            <input
              type="password"
              id="currentPw"
              name="currentPw"
              className="owner-pw-modal-input"
              placeholder="현재 비밀번호를 입력하세요"
              value={pwData.currentPw}
              onChange={handleChange}
              required
            />
          </div>

          <div className="owner-pw-modal-field">
            <label htmlFor="newPw">새 비밀번호</label>
            <input
              type="password"
              id="newPw"
              name="newPw"
              className="owner-pw-modal-input"
              placeholder="새 비밀번호를 입력하세요"
              value={pwData.newPw}
              onChange={handleChange}
              required
            />
          </div>

          <div className="owner-pw-modal-field">
            <label htmlFor="confirmPw">새 비밀번호 확인</label>
            <input
              type="password"
              id="confirmPw"
              name="confirmPw"
              className="owner-pw-modal-input"
              placeholder="새 비밀번호를 한 번 더 입력하세요"
              value={pwData.confirmPw}
              onChange={handleChange}
              required
            />
          </div>

          <div className="owner-pw-modal-footer">
            <button type="button" className="owner-pw-modal-btn-cancel" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="owner-pw-modal-btn-submit">
              변경하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OwnerPwModal;