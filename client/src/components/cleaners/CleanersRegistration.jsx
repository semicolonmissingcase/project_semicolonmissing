import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../../api/axiosInstance.js"; 
import useKakaoPostcode from "../hooks/useKakaoPostcode.js";
import './CleanersRegistration.css';

const LOCATION_DATA = {
  "서울": ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"],
  "경기도": ["수원시", "용인시", "성남시", "부천시", "화성시", "안산시", "안양시", "평택시", "시흥시", "김포시", "파주시", "의정부시"],
  "인천": ["계양구", "미추홀구", "남동구", "동구", "부평구", "서구", "연수구", "중구"]
};

export default function CleanersRegistration() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGenderChange = (e) => {
    setFormData(prev => ({
      ...prev,
      gender: e.target.value
    }));
  };

  // 현재 선택 중인 시/도 상태 (UI용)
  const [selectedCity, setSelectedCity] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    gender: 'male',
    emailLocal: '',
    emailDomain: '',
    password: '',
    passwordChk: '',
    phonePrefix: '010',
    phoneMiddle: '',
    phoneLast: '',
    zipCode: '',
    address: '',
    addressDetail: '',
    locations: [], // 선택된 지역들 저장 (최대 5개)
  });

  // 지역 선택/해제 로직
  const handleLocationToggle = (district) => {
    const locationStr = `${selectedCity} ${district}`;
    
    setFormData(prev => {
      const isExist = prev.locations.includes(locationStr);
      
      if (isExist) {
        // 이미 있으면 제거
        return { ...prev, locations: prev.locations.filter(loc => loc !== locationStr) };
      } else {
        // 없으면 추가 (단, 5개 제한)
        if (prev.locations.length >= 5) {
          alert("활동 지역은 최대 5개까지 선택 가능합니다.");
          return prev;
        }
        return { ...prev, locations: [...prev.locations, locationStr] };
      }
    });
  };

  // 선택된 지역 삭제 버튼
  const removeLocation = (locToRemove) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.filter(loc => loc !== locToRemove)
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phoneMiddle' || name === 'phoneLast') {
      const onlyNumber = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: onlyNumber }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const { openPostcode } = useKakaoPostcode((data) => {
    setFormData(prev => ({ ...prev, zipCode: data.zonecode, address: data.address }));
  });

  const validate = () => {
    if (!formData.name) return "이름을 입력해주세요.";
    if (formData.password.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
    if (formData.password !== formData.passwordChk) return "비밀번호가 일치하지 않습니다.";
    if (formData.locations.length === 0) return "활동 지역을 최소 1개 이상 선택해주세요.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMsg = validate();
    if (errorMsg) return alert(errorMsg);

    const payload = {
      ...formData,
      email: `${formData.emailLocal}@${formData.emailDomain}`,
      phone: `${formData.phonePrefix}-${formData.phoneMiddle}-${formData.phoneLast}`,
      address: `${formData.address} ${formData.addressDetail}`,
      location: {
        city: formData.city,
        district: formData.district
      }
    };

    try {
      setIsLoading(true);
      await axiosInstance.post('/api/auth/register/cleaner', payload);
      alert("회원가입이 완료되었습니다.");
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || "오류 발생");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="all-container cleaners-registration-container">
      <h1 className="ice-doctor-logo1"></h1>

      <form className="cleaners-registration-form" onSubmit={handleSubmit}>
        <div className="cleaners-registration-section">
          <h2 className="cleaners-registration-section-title">회원 정보*</h2>

          {/* 이름 */}
          <div className="cleaners-registration-form-group">
            <label>이름</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="이름을 입력하세요" required />
          </div>

          {/* 성별 */}
          <div className="owner-registration-form-group">
            <label>성별</label>
            <div className="owner-registration-gender-buttons">
              <label className={`owner-registration-gender-checkbox ${formData.gender === 'male' ? 'active' : ''}`}>
                <input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleGenderChange} />
                <span>남자</span>
              </label>
              <label className={`owner-registration-gender-checkbox ${formData.gender === 'female' ? 'active' : ''}`}>
                <input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleGenderChange} />
                <span>여자</span>
              </label>
            </div>
          </div>

          {/* 이메일 */}
          <div className="cleaners-registration-form-group">
            <label>이메일</label>
            <div className="cleaners-registration-email-inputs">
              <input type="text" name="emailLocal" value={formData.emailLocal} onChange={handleChange} className="cleaners-registration-email-input" placeholder="이메일" />
              <span className="cleaners-registration-email-separator">@</span>
              <input type="text" name="emailDomain" value={formData.emailDomain} onChange={handleChange} className="cleaners-registration-email-input" placeholder="직접입력" />
              <select 
                className="cleaners-registration-email-domain-select"
                value={formData.emailDomain}
                onChange={(e) => setFormData(prev => ({ ...prev, emailDomain: e.target.value }))}
              >
                <option value="">직접입력</option>
                <option value="naver.com">naver.com</option>
                <option value="gmail.com">gmail.com</option>
                <option value="daum.net">daum.net</option>
              </select>
            </div>
          </div>

          {/* 비밀번호 */}
          <div className="cleaners-registration-form-group">
            <label>비밀번호</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="8자 이상 입력하세요" />
          </div>
          <div className="cleaners-registration-form-group">
            <label>비밀번호 확인</label>
            <input type="password" name="passwordChk" value={formData.passwordChk} onChange={handleChange} placeholder="다시 한번 입력하세요" />
          </div>

          {/* 전화번호 */}
          <div className="cleaners-registration-form-group">
            <label>전화번호</label>
            <div className="cleaners-registration-phone-inputs">
              <select name="phonePrefix" value={formData.phonePrefix} onChange={handleChange}>
                <option value="010">010</option>
                <option value="011">011</option>
              </select>
              <span className="cleaners-registration-phone-separator">-</span>
              <input type="tel" name="phoneMiddle" value={formData.phoneMiddle} onChange={handleChange} maxLength="4" className="cleaners-registration-phone-input" />
              <span className="cleaners-registration-phone-separator">-</span>
              <input type="tel" name="phoneLast" value={formData.phoneLast} onChange={handleChange} maxLength="4" className="cleaners-registration-phone-input" />
            </div>
          </div>

          {/* 거주 주소 */}
          <div className="cleaners-registration-form-group">
            <label>거주 주소</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input type="text" value={formData.zipCode} readOnly placeholder="우편번호" style={{ flex: 1 }} />
              <button type="button" onClick={openPostcode} className="bg-gray btn-small" style={{ width: '100px' }}>주소 검색</button>
            </div>
            <input type="text" value={formData.address} readOnly placeholder="기본 주소" />
            <input type="text" name="addressDetail" value={formData.addressDetail} onChange={handleChange} placeholder="상세 주소를 입력하세요" style={{ marginTop: '8px' }} />
          </div>

          {/* 희망 활동 지역 (다중 선택) */}
          <div className="cleaners-registration-form-group">
            <label>희망 활동 지역 (1~5개)*</label>
            
            {/* 시/도 선택 */}
            <select 
              className="location-city-select"
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{ marginBottom: '10px' }}
            >
              <option value="">시/도 선택</option>
              {Object.keys(LOCATION_DATA).map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            {/* 구/군 선택 박스 (가로 스크롤 또는 grid) */}
            {selectedCity && (
              <div className="district-selection-box" style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr 1fr', 
                gap: '5px', 
                maxHeight: '150px', 
                overflowY: 'auto',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}>
                {LOCATION_DATA[selectedCity].map(dist => {
                  const isSelected = formData.locations.includes(`${selectedCity} ${dist}`);
                  return (
                    <button
                      type="button"
                      key={dist}
                      onClick={() => handleLocationToggle(dist)}
                      style={{
                        padding: '5px',
                        fontSize: '12px',
                        backgroundColor: isSelected ? 'var(--color-light-blue)' : '#fff',
                        color: isSelected ? '#000' : '#000',
                        border: '1px solid #ddd',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      {dist}
                    </button>
                  );
                })}
              </div>
            )}

            {/* 선택된 지역 칩 리스트 */}
            <div className="selected-locations-wrapper" style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {formData.locations.map(loc => (
                <span key={loc} style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#e9ecef',
                  padding: '4px 8px',
                  borderRadius: '15px',
                  fontSize: '12px',
                  border: '1px solid #dee2e6'
                }}>
                  {loc}
                  <button 
                    type="button" 
                    onClick={() => removeLocation(loc)}
                    style={{ marginLeft: '5px', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-blue)', fontWeight: 'bold' }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <button type="submit" className="bg-blue btn-big" disabled={isLoading}>
          {isLoading ? "가입 처리 중..." : "회원가입"}
        </button>
      </form>
    </div>
  );
}