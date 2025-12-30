import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CleanersRegistration.css';
import useKakaoPostcode from "../hooks/useKakaoPostcode.js";
import { useDispatch } from "react-redux";
const DEFAULT_PROFILE_IMAGE_URL = '/icons/default-profile.png'; // 기본 프로필 사진

export default function CleanersRegistration() {
  
  

  return (
    <div className="all-container cleaners-registration-container">
      <h1 className="ice-doctor-logo1"></h1>

      <form className="cleaners-registration-form">
        {/* 회원 정보 */}
        <div className="cleaners-registration-section">
          <h2 className="cleaners-registration-section-title">회원 정보*</h2>

          {/* 이름 */}
          <div className="cleaners-registration-form-group">
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              name="name"
              value="name"
              placeholder="이름을 입력하세요"
            />
          </div>

          {/* 성별 */}
          <div className="cleaners-registration-form-group">
            <label>성별</label>
            <div className="cleaners-registration-gender-buttons">
              <label className="cleaners-registration-gender-checkbox">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked="male"
                />
                <span>남자</span>
              </label>
              <label className="cleaners-registration-gender-checkbox">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked="female"
                />
                <span>여자</span>
              </label>
            </div>
          </div>

          {/* 이메일 */}
          <div className="cleaners-registration-form-group">
            <label>이메일</label>
            <div className="cleaners-registration-email-inputs">
              <input
                type="text"
                name="emailLocal"
                value="emailLocal"
                className="cleaners-registration-email-input"
                placeholder="이메일"
              />
              <span className="cleaners-registration-email-separator">@</span>
              <input
                type="text"
                name="emailDomain"
                value="emailDomain"
                placeholder="직접입력"
                className="cleaners-registration-email-input"
              />
              <select
                className="cleaners-registration-email-domain-select"
                value=""
              >
                <option value="">선택</option>
                <option value="naver.com">naver.com</option>
                <option value="gmail.com">gmail.com</option>
                <option value="daum.net">daum.net</option>
              </select>
            </div>
          </div>

          {/* 비밀번호 */}
          <div className="cleaners-registration-form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value="password"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          {/* 비밀번호 확인 */}
          <div className="cleaners-registration-form-group">
            <label htmlFor="passwordChk">비밀번호 확인</label>
            <input
              type="password"
              id="passwordChk"
              name="passwordChk"
              value="passwordChk"
              placeholder="비밀번호를 다시 입력하세요"
            />
          </div>

          {/* 전화번호 */}
          <div className="cleaners-registration-form-group">
            <label htmlFor="phone">전화번호</label>
            <div className="cleaners-registration-phone-inputs">
              <select
                name="phonePrefix"
                value="phonePrefix"
                className="cleaners-registration-phone-prefix"
              >
                <option value="010">010</option>
                <option value="011">011</option>
                <option value="016">016</option>
                <option value="017">017</option>
                <option value="018">018</option>
                <option value="019">019</option>
              </select>
              <span className="cleaners-registration-phone-separator">-</span>
              <input
                type="tel"
                name="phoneMiddle"
                value="phoneMiddle"
                className="cleaners-registration-phone-input"
                maxLength="4"
              />
              <span className="cleaners-registration-phone-separator">-</span>
              <input
                type="tel"
                name="phoneLast"
                value="phoneLast"
                className="cleaners-registration-phone-input"
                maxLength="4"
              />
            </div>
          </div>
        </div>


        {/* 회원가입 버튼 */}
        <button type="submit" className="bg-blue btn-big">
          회원가입
        </button>
      </form>
    </div>    
  );
}