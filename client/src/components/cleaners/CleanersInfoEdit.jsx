import React from 'react';
import './CleanersInfoEdit.css';
import { useState } from "react";

export default function CleanersInfoEdit() {
  const [phonePrefix, setPhonePrefix] = useState("010");

  return (
    <div className="all-container">
      <div className="cleanerinfoedit-wrapper">
        <h1 className="cleanerinfoedit-title">정보 수정</h1>

        <section className="cleanerinfoedit-form">
          {/* 아이디 (읽기 전용) */}
          <div className="cleanerinfoedit-group">
            <label>아이디:</label>
            <input type="text" value="id_icedoctor_cleaner" readOnly className="cleanerinfoedit-input-disabled" />
          </div>

          {/* 비밀번호 수정 */}
          <div className="cleanerinfoedit-group">
            <label>비밀번호:</label>
            <div className="cleanerinfoedit-input-with-btn">
              <input type="password" placeholder="새 비밀번호 입력" />
              <button type="button" className="cleanerinfoedit-inline-btn">수정</button>
            </div>
          </div>

          {/* 이메일 주소 (단순 출력 및 연동 표시) */}
          <div className="cleanerinfoedit-group">
            <label>이메일 주소:</label>
            <div className="cleanerinfoedit-email-display">
              <div className="cleanerinfoedit-email-row">
                <span>ice_cleaner@kakao.com</span>
              </div>
            </div>
          </div>

          {/* 이름 */}
          <div className="cleanerinfoedit-group">
            <label>이름:</label>
            <input type="text" placeholder="이름을 입력하세요" />
          </div>

          {/* 휴대전화 (선택-4자리-4자리) */}
          <div className="cleanerinfoedit-group">
            <label>휴대전화:</label>
            <div className="cleanerinfoedit-phone-container">
              <select value={phonePrefix} onChange={(e) => setPhonePrefix(e.target.value)}>
                <option value="010">010</option>
                <option value="011">011</option>
                <option value="016">016</option>
                <option value="017">017</option>
                <option value="018">018</option>
                <option value="019">019</option>
              </select>
              <span>-</span>
              <input type="text" maxLength="4" className="cleanerinfoedit-phone-input" />
              <span>-</span>
              <input type="text" maxLength="4" className="cleanerinfoedit-phone-input" />
            </div>
          </div>

          {/* 하단 안내 및 버튼 */}
          <div className="cleanerinfoedit-footer">
            <div className="cleanerinfoedit-status-msg">
              <p className="cleanerinfoedit-status-title">정산 가능</p>
              <p className="cleanerinfoedit-status-desc">※ 계좌 인증이 완료되어 정산이 가능합니다.</p>
            </div>

            <div className="cleanerinfoedit-confirm-msg">
              <div className="cleanerinfoedit-check-icon">✓</div> {/* 리액트아이콘 있나 찾아보죠 */}
              <p>수정하신 내용을 한 번 더 확인하시고<br />왼쪽 버튼을 눌러주세요.</p>
            </div>

            <div className="cleanerinfoedit-action-btns">
              <button type="button" className="btn-medium bg-light-gray">수정 취소</button>
              <button type="button" className="btn-medium bg-blue">수정 완료</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}