import React, { useState } from "react";
import "./CleanerPwModal.css";

function CleanerPwModal({ isOpen, onClose }) {
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
    <div className="cleaner-pw-modal-overlay">
      <div className="cleaner-pw-modal-container">
        <div className="cleaner-pw-modal-header">
          <h3>비밀번호 변경</h3>
          <button className="cleaner-pw-modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        <form className="cleaner-pw-modal-form" onSubmit={handleSubmit}>
          <div className="cleaner-pw-modal-field">
            <label htmlFor="currentPw">현재 비밀번호</label>
            <input
              type="password"
              id="currentPw"
              name="currentPw"
              className="cleaner-pw-modal-input"
              placeholder="현재 비밀번호를 입력하세요"
              value={pwData.currentPw}
              onChange={handleChange}
              required
            />
          </div>

          <div className="cleaner-pw-modal-field">
            <label htmlFor="newPw">새 비밀번호</label>
            <input
              type="password"
              id="newPw"
              name="newPw"
              className="cleaner-pw-modal-input"
              placeholder="새 비밀번호를 입력하세요"
              value={pwData.newPw}
              onChange={handleChange}
              required
            />
          </div>

          <div className="cleaner-pw-modal-field">
            <label htmlFor="confirmPw">새 비밀번호 확인</label>
            <input
              type="password"
              id="confirmPw"
              name="confirmPw"
              className="cleaner-pw-modal-input"
              placeholder="새 비밀번호를 한 번 더 입력하세요"
              value={pwData.confirmPw}
              onChange={handleChange}
              required
            />
          </div>

          <div className="cleaner-pw-modal-footer">
            <button type="button" className="cleaner-pw-modal-btn-cancel" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="cleaner-pw-modal-btn-submit">
              변경하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CleanerPwModal;