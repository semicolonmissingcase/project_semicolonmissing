import { useEffect, useState, useRef } from 'react'; // useRef 추가
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { fetchLocations, registerCleaner } from "../../store/thunks/cleanersThunk.js";
import { clearRegistrationStatus } from "../../store/slices/cleanersSlice.js";
import './CleanersRegistration.css';

export default function CleanersRegistration() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // 다음 입력을 위한 Ref 생성
  const phoneMiddleRef = useRef(null);
  const phoneLastRef = useRef(null);

  const { locationData, isLoading, error, registrationSuccess } = useSelector((state) => state.cleaners);

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
    locations: [], 
  });

  // 가입 성공/에러 처리 로직은 동일 (생략 가능하나 유지)
  useEffect(() => {
    if (registrationSuccess) {
      alert("회원가입이 완료되었습니다!");
      dispatch(clearRegistrationStatus());
      navigate('/login');
    }
  }, [registrationSuccess, navigate, dispatch]);

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearRegistrationStatus());
    }
  }, [error, dispatch]);

  useEffect(() => {
    dispatch(fetchLocations()); 
  }, [dispatch]);

  // 통합 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // 숫자만 입력받아야 하는 필드 처리
    if (name === 'phoneMiddle' || name === 'phoneLast') {
      const onlyNumber = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: onlyNumber }));

      // 4글자가 되면 다음 포커스로 이동 (사용자 편의성)
      if (onlyNumber.length === 4) {
        if (name === 'phoneMiddle') phoneLastRef.current?.focus();
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleGenderChange = (e) => {
    setFormData(prev => ({ ...prev, gender: e.target.value }));
  };

  const handleLocationToggle = (district) => {
    if (!selectedCity) return;
    const locationStr = `${selectedCity} ${district}`;
    setFormData(prev => {
      const isExist = prev.locations.includes(locationStr);
      if (isExist) {
        return { ...prev, locations: prev.locations.filter(loc => loc !== locationStr) };
      } else {
        if (prev.locations.length >= 5) {
          alert("활동 지역은 최대 5개까지 선택 가능합니다.");
          return prev;
        }
        return { ...prev, locations: [...prev.locations, locationStr] };
      }
    });
  };

  const removeLocation = (locToRemove) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.filter(loc => loc !== locToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.passwordChk) {
      return alert("비밀번호가 일치하지 않습니다.");
    }
    if (formData.locations.length === 0) {
        return alert("활동 지역을 최소 1개 이상 선택해주세요.");
    }

    const payload = {
      name: formData.name,
      gender: formData.gender,
      email: `${formData.emailLocal}@${formData.emailDomain}`,
      password: formData.password,
      // 백엔드 모델이 phone_number(13자)를 요구하므로 형식을 맞춤
      phone: `${formData.phonePrefix}-${formData.phoneMiddle}-${formData.phoneLast}`,
      locations: formData.locations,
    };

    dispatch(registerCleaner(payload));
  }; 

  return (
    <div className="all-container cleaners-registration-container">
      <h1 className="ice-doctor-logo1"></h1>
      <form className="cleaners-registration-form" onSubmit={handleSubmit}>
        <div className="cleaners-registration-section">
          <h2 className="cleaners-registration-section-title">회원 정보*</h2>

          <div className="cleaners-registration-form-group">
            <label>이름</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="cleaners-registration-form-group">
            <label>성별</label>
            <div className="cleaners-registration-gender-buttons">
              <label className={`cleaners-registration-gender-checkbox ${formData.gender === 'male' ? 'active' : ''}`}>
                <input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleGenderChange} />
                <span>남자</span>
              </label>
              <label className={`cleaners-registration-gender-checkbox ${formData.gender === 'female' ? 'active' : ''}`}>
                <input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleGenderChange} />
                <span>여자</span>
              </label>
            </div>
          </div>

          {/* 전화번호 수정 부분 */}
          <div className="cleaners-registration-form-group">
            <label>전화번호</label>
            <div className="cleaners-registration-phone-inputs">
              <select
                name="phonePrefix"
                value={formData.phonePrefix}
                className="cleaners-registration-phone-prefix"
              >
                <option value="010">010</option>
                <option value="02">02</option>
                <option value="031">031</option>
                {/* ... 다른 옵션들 ... */}
              </select>
              <span className="phone-separator">-</span>
              <input
                type="text"
                name="phoneMiddle"
                ref={phoneMiddleRef}
                value={formData.phoneMiddle}
                onChange={handleChange}
                className="cleaners-registration-phone-input"
                maxLength="4"
                required
              />
              <span className="phone-separator">-</span>
              <input
                type="text"
                name="phoneLast"
                ref={phoneLastRef}
                value={formData.phoneLast}
                onChange={handleChange}
                className="cleaners-registration-phone-input"
                maxLength="4"
                required
              />
            </div>
          </div>

          {/* 이메일 / 비밀번호 / 지역 선택 (기존과 동일하되 오타 점검 완료) */}
          <div className="cleaners-registration-form-group">
            <label>이메일</label>
            <div className="cleaners-registration-email-inputs">
              <input type="text" name="emailLocal" value={formData.emailLocal} onChange={handleChange} required />
              <span>@</span>
              <input type="text" name="emailDomain" value={formData.emailDomain} onChange={handleChange} required />
            </div>
          </div>

          <div className="cleaners-registration-form-group">
            <label>비밀번호</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="cleaners-registration-form-group">
            <label>비밀번호 확인</label>
            <input type="password" name="passwordChk" value={formData.passwordChk} onChange={handleChange} required />
          </div>

          <div className="cleaners-registration-form-group">
            <label>희망 활동 지역 (최대 5개)</label>
            <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
              <option value="">시/도 선택</option>
              {locationData && Object.keys(locationData).map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            {selectedCity && (
              <div className="cleaners-registration-district-selection-box">
                {locationData[selectedCity]?.map(dist => (
                  <button key={dist} type="button" onClick={() => handleLocationToggle(dist)}
                    className={formData.locations.includes(`${selectedCity} ${dist}`) ? 'active' : ''}>
                    {dist}
                  </button>
                ))}
              </div>
            )}

            <div className="cleaners-registration-selected-locations-wrapper">
              {formData.locations.map(loc => (
                <span key={loc} className="selected-location-chip">
                  {loc} <button type="button" onClick={() => removeLocation(loc)}>×</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <button type="submit" className="bg-blue btn-big" disabled={isLoading}>
          {isLoading ? "처리 중..." : "회원가입"}
        </button>
      </form>
    </div>
  );
}