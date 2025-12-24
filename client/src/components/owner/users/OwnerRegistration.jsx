import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OwnerRegistration.css';
import useKakaoPostcode from "../../hooks/useKakaoPostcode.js";
const DEFAULT_PROFILE_IMAGE_URL = '/icons/default-profile.png';

export default function OwnerRegistration() {
  const navigate = useNavigate();
  const { openPostcode } = useKakaoPostcode();

  const [formData, setFormData] = useState({
    name: '',
    gender: 'male',
    emailLocal: '',
    emailDomain: '',
    password: '',
    passwordConfirm: '',
    phonePrefix: '010',
    phoneMiddle: '',
    phoneLast: '',
    storeName: '',
    storePhonePrefix: '02',
    storePhoneMiddle: '',
    storePhoneLast: '',
    address: '',
    addressDetail: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 에러 메시지 초기화
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePhoneInput = (e, nextFieldName) => {
    const { name, value } = e.target;
    
    // 숫자만 입력 가능하도록
    const numericValue = value.replace(/[^0-9]/g, '');
    
    setFormData(prev => ({
      ...prev,
      [name]: numericValue
    }));

    // 4자 입력 시 다음 필드로 이동
    if (numericValue.length === 4 && nextFieldName) {
      const nextField = document.querySelector(`input[name="${nextFieldName}"]`);
      if (nextField) {
        nextField.focus();
      }
    }

    // 에러 메시지 초기화
    if (errors.phone || errors.storePhone) {
      setErrors(prev => ({
        ...prev,
        phone: '',
        storePhone: ''
      }));
    }
  };

  const handleEmailDomainChange = (e) => {
    const selectedDomain = e.target.value;
    if (selectedDomain) {
      setFormData(prev => ({
        ...prev,
        emailDomain: selectedDomain
      }));
    }
  };

  const handleGenderChange = (e) => {
    setFormData(prev => ({
      ...prev,
      gender: e.target.value
    }));
  };

  const handleAddressSearch = () => {
    openPostcode((addr) => {
      setFormData(prev => ({
        ...prev,
        address: addr
      }));
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }

    if (!formData.emailLocal || !formData.emailDomain) {
      newErrors.email = '이메일을 입력해주세요';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다';
    }

    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다';
    }

    if (!formData.phoneMiddle || !formData.phoneLast) {
      newErrors.phone = '전화번호를 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        ...formData,
        email: `${formData.emailLocal}@${formData.emailDomain}`,
        phone: `${formData.phonePrefix}-${formData.phoneMiddle}-${formData.phoneLast}`,
        storePhone: `${formData.storePhonePrefix}-${formData.storePhoneMiddle}-${formData.storePhoneLast}`
      };

      const response = await fetch('/api/auth/register/owner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        alert('회원가입이 완료되었습니다!');
        navigate('/login');
      } else {
        alert('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="all-container owner-registration-container">
      <h1 className="ice-doctor-logo1"></h1>

      <form onSubmit={handleSubmit} className="owner-registration-form">
        {/* 회원 정보 */}
        <div className="owner-registration-section">
          <h2 className="owner-registration-section-title">회원 정보*</h2>

          {/* 이름 */}
          <div className="owner-registration-form-group">
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
            />
            {errors.name && <span className="owner-registration-error-text">{errors.name}</span>}
          </div>

          {/* 성별 */}
          <div className="owner-registration-form-group">
            <label>성별</label>
            <div className="owner-registration-gender-buttons">
              <label className={`owner-registration-gender-checkbox ${formData.gender === 'male' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={handleGenderChange}
                />
                <span>남자</span>
              </label>
              <label className={`owner-registration-gender-checkbox ${formData.gender === 'female' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleGenderChange}
                />
                <span>여자</span>
              </label>
            </div>
          </div>

          {/* 이메일 */}
          <div className="owner-registration-form-group">
            <label>이메일</label>
            <div className="owner-registration-email-inputs">
              <input
                type="text"
                name="emailLocal"
                value={formData.emailLocal}
                onChange={handleChange}
                className="owner-registration-email-input"
                placeholder="이메일"
              />
              <span className="owner-registration-email-separator">@</span>
              <input
                type="text"
                name="emailDomain"
                value={formData.emailDomain}
                onChange={handleChange}
                placeholder="직접입력"
                className="owner-registration-email-input"
              />
              <select
                className="owner-registration-email-domain-select"
                value=""
                onChange={handleEmailDomainChange}
              >
                <option value="">선택</option>
                <option value="naver.com">naver.com</option>
                <option value="gmail.com">gmail.com</option>
                <option value="daum.net">daum.net</option>
              </select>
            </div>
            {errors.email && <span className="owner-registration-error-text">{errors.email}</span>}
          </div>

          {/* 비밀번호 */}
          <div className="owner-registration-form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
            />
            {errors.password && <span className="owner-registration-error-text">{errors.password}</span>}
          </div>

          {/* 비밀번호 확인 */}
          <div className="owner-registration-form-group">
            <label htmlFor="passwordConfirm">비밀번호 확인</label>
            <input
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력하세요"
            />
            {errors.passwordConfirm && <span className="owner-registration-error-text">{errors.passwordConfirm}</span>}
          </div>

          {/* 전화번호 */}
          <div className="owner-registration-form-group">
            <label htmlFor="phone">전화번호</label>
            <div className="owner-registration-phone-inputs">
              <select
                name="phonePrefix"
                value={formData.phonePrefix}
                onChange={handleChange}
                className="owner-registration-phone-prefix"
              >
                <option value="010">010</option>
                <option value="011">011</option>
                <option value="016">016</option>
                <option value="017">017</option>
                <option value="018">018</option>
                <option value="019">019</option>
              </select>
              <span className="owner-registration-phone-separator">-</span>
              <input
                type="tel"
                name="phoneMiddle"
                value={formData.phoneMiddle}
                onChange={(e) => handlePhoneInput(e, 'phoneLast')}
                className="owner-registration-phone-input"
                maxLength="4"
              />
              <span className="owner-registration-phone-separator">-</span>
              <input
                type="tel"
                name="phoneLast"
                value={formData.phoneLast}
                onChange={(e) => handlePhoneInput(e, null)}
                className="owner-registration-phone-input"
                maxLength="4"
              />
            </div>
            {errors.phone && <span className="owner-registration-error-text">{errors.phone}</span>}
          </div>
        </div>

        {/* 매장 정보 */}
        <div className="owner-registration-section">
          <h2 className="owner-registration-section-title">매장 정보</h2>

          {/* 매장명 */}
          <div className="owner-registration-form-group">
            <label htmlFor="storeName">매장명</label>
            <input
              type="text"
              id="storeName"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              placeholder="매장명을 입력하세요"
            />
            {errors.storeName && <span className="owner-registration-error-text">{errors.storeName}</span>}
          </div>

          {/* 전화번호 */}
          <div className="owner-registration-form-group">
            <label htmlFor="storePhone">전화번호</label>
            <div className="owner-registration-phone-inputs">
              <select
                name="storePhonePrefix"
                value={formData.storePhonePrefix}
                onChange={handleChange}
                className="owner-registration-phone-prefix"
              >
                <option value="02">02</option> {/* 서울 */}
                <option value="031">031</option> {/* 경기 */}
                <option value="032">032</option> {/* 인천 */}
                <option value="033">033</option> {/* 강원 */}
                <option value="041">041</option> {/* 충남 */}
                <option value="042">042</option> {/* 대전 */}
                <option value="043">043</option> {/* 충북 */}
                <option value="044">044</option> {/* 세종 */}
                <option value="051">051</option> {/* 부산 */}
                <option value="052">052</option> {/* 울산 */}
                <option value="053">053</option> {/* 대구 */}
                <option value="054">054</option> {/* 경뷱 */}
                <option value="055">055</option> {/* 경남 */}
                <option value="061">061</option> {/* 전남 */}
                <option value="062">062</option> {/* 광주 */}
                <option value="063">063</option> {/* 전북 */}
                <option value="064">064</option> {/* 제주 */}
              </select>
              <span className="owner-registration-phone-separator">-</span>
              <input
                type="tel"
                name="storePhoneMiddle"
                value={formData.storePhoneMiddle}
                onChange={(e) => handlePhoneInput(e, 'storePhoneLast')}
                className="owner-registration-phone-input"
                maxLength="4"
              />
              <span className="owner-registration-phone-separator">-</span>
              <input
                type="tel"
                name="storePhoneLast"
                value={formData.storePhoneLast}
                onChange={(e) => handlePhoneInput(e, null)}
                className="owner-registration-phone-input"
                maxLength="4"
              />
            </div>
            {errors.storePhone && <span className="owner-registration-error-text">{errors.storePhone}</span>}
          </div>

          {/* 주소 */}
          <div className="owner-registration-form-group">
            <label htmlFor="address">주소</label>
            <div className="owner-registration-address-search-wrapper">
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="주소를 검색하세요"
                readOnly
              />
              <button
                type="button"
                className="owner-registration-address-search-btn bg-blue btn-small"
                onClick={handleAddressSearch}
              >
                검색하기
              </button>
            </div>
            {errors.address && <span className="owner-registration-error-text">{errors.address}</span>}
          </div>

          {/* 상세주소 */}
          <div className="owner-registration-form-group">
            <input
              type="text"
              name="addressDetail"
              value={formData.addressDetail}
              onChange={handleChange}
              placeholder="상세 주소를 입력하세요"
            />
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