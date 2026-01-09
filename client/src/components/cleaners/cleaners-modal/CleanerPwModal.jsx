import React, { useState } from "react";
import "./CleanerPwModal.css";
import { changeCleanerPasswordThunk } from "../../../store/thunks/authThunk.js";
import { useDispatch } from "react-redux";

function CleanerPwModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [pwData, setPwData] = useState({
    currentPw: "",
    newPw: "",
    confirmPw: "",
  });
  const [error, setError] = useState("");

  // 폼 초기화 함수
  const resetForm = () => {
    setPwData({
      currentPw: "",
      newPw: "",
      confirmPw: "",
    });
    setError("");
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPwData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 1. 프론트엔드 유효성 검사
    if (pwData.newPw !== pwData.confirmPw) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return; // API 호출 중단
    }
    if (pwData.newPw.length < 8) {
      setError("비밀번호는 8자 이상으로 설정해주세요.");
      return; // API 호출 중단
    }

    // 2. API 호출 및 에러 처리
    try {
      await dispatch(changeCleanerPasswordThunk({
        currentPassword: pwData.currentPw,
        newPassword: pwData.newPw,
      })).unwrap();

      alert("비밀번호가 성공적으로 변경되었습니다.");
      resetForm();
      onClose();

    } catch (caughtError) { // 변수 이름을 'error'에서 'caughtError'로 변경하여 혼동 방지
      // 백엔드에서 보낸 에러 메시지를 사용
      setError(caughtError.info || "비밀번호 변경에 실패했습니다.");
    }
  };

  return (
    <div className="cleaner-pw-modal-overlay">
      <div className="cleaner-pw-modal-container">
        <div className="cleaner-pw-modal-header">
          <h3>비밀번호 변경</h3>
          <button className="cleaner-pw-modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        <form className="cleaner-pw-modal-form" onSubmit={handleSubmit}>
          {/* 현재 비밀번호 입력 필드 */}
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

          {/* 새 비밀번호 입력 필드 */}
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

          {/* 새 비밀번호 확인 필드 */}
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

          {/* 에러 메시지 표시 영역 */}
          {error && <p className="cleaner-pw-modal-error">{error}</p>}

          {/* 하단 버튼 */}
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