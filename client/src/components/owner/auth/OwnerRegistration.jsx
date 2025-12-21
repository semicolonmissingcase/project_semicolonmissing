import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OwnerRegistration.css';

export default function OwnerRegistration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    gender: 'male',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    storeName: '',
    storePhone: '',
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

  const handleGenderClick = (gender) => {
    setFormData(prev => ({
      ...prev,
      gender
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }

    if (!formData.birthYear || !formData.birthMonth || !formData.birthDay) {
      newErrors.birth = '이메일을 입력해주세요';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다';
    }

    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다';
    }

    if (!formData.phone) {
      newErrors.phone = '전화번호를 입력해주세요';
    }

    if (!formData.storeName.trim()) {
      newErrors.storeName = '매장명을 입력해주세요';
    }

    if (!formData.storePhone) {
      newErrors.storePhone = '매장 전화번호를 입력해주세요';
    }

    if (!formData.address.trim()) {
      newErrors.address = '주소를 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressSearch = () => {
    // 주소 검색 API 연동 (예: 다음 주소 API)
    alert('주소 검색 기능 구현 예정');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch('/api/auth/register/owner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
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
        <div className="registration-section">
          <h2 className="section-title">회원 정보*</h2>

          {/* 이름 */}
          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {/* 성별 */}
          <div className="form-group">
            <label>성별</label>
            <div className="gender-buttons">
              <button
                type="button"
                className={`gender-btn ${formData.gender === 'male' ? 'active' : ''}`}
                onClick={() => handleGenderClick('male')}
              >
                남자
              </button>
              <button
                type="button"
                className={`gender-btn ${formData.gender === 'female' ? 'active' : ''}`}
                onClick={() => handleGenderClick('female')}
              >
                여자
              </button>
            </div>
          </div>

          {/* 이메일 (생년월일) */}
          <div className="form-group">
            <label>이메일</label>
            <div className="birth-inputs">
              <input
                type="text"
                name="birthYear"
                value={formData.birthYear}
                onChange={handleChange}
                className="birth-input"
              />
              <span className="birth-separator">@</span>
              <input
                type="text"
                name="birthMonth"
                value={formData.birthMonth}
                onChange={handleChange}
                placeholder="직접입력"
                className="birth-input"
              />
              <select
                name="emailDomain"
                className="email-domain-select"
                onChange={handleChange}
              >
                <option value="">직접입력</option>
                <option value="naver.com">naver.com</option>
                <option value="gmail.com">gmail.com</option>
                <option value="daum.net">daum.net</option>
              </select>
            </div>
            {errors.birth && <span className="error-text">{errors.birth}</span>}
          </div>

          {/* 비밀번호 */}
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {/* 비밀번호 확인 */}
          <div className="form-group">
            <label htmlFor="passwordConfirm">비밀번호 확인</label>
            <input
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력하세요"
            />
            {errors.passwordConfirm && <span className="error-text">{errors.passwordConfirm}</span>}
          </div>

          {/* 전화번호 */}
          <div className="form-group">
            <label htmlFor="phone">전화번호</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="010-0000-0000"
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>
        </div>

        {/* 매장 정보 */}
        <div className="registration-section">
          <h2 className="section-title">매장 정보*</h2>

          {/* 매장명 */}
          <div className="form-group">
            <label htmlFor="storeName">매장명</label>
            <input
              type="text"
              id="storeName"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              placeholder="매장명을 입력하세요"
            />
            {errors.storeName && <span className="error-text">{errors.storeName}</span>}
          </div>

          {/* 전화번호 */}
          <div className="form-group">
            <label htmlFor="storePhone">전화번호</label>
            <input
              type="tel"
              id="storePhone"
              name="storePhone"
              value={formData.storePhone}
              onChange={handleChange}
              placeholder="매장 전화번호를 입력하세요"
            />
            {errors.storePhone && <span className="error-text">{errors.storePhone}</span>}
          </div>

          {/* 주소 */}
          <div className="form-group">
            <label htmlFor="address">주소</label>
            <div className="address-search-wrapper">
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
                className="address-search-btn bg-blue btn-small"
                onClick={handleAddressSearch}
              >
                검색하기
              </button>
            </div>
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>

          {/* 상세주소 */}
          <div className="form-group">
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