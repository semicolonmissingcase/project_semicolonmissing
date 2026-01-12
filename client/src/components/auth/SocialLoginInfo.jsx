import { useState } from "react";
import "./SocialLoginInfo.css";
import useKakaoPostcode from "../hooks/useKakaoPostcode.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice.js';
import axiosInstance from '../../api/axiosInstance.js';

export default function SocialLoginInfo() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URL 파라미터에서 정보 추출
  const email = searchParams.get('email');
  const profile = searchParams.get('profile');

  const [selectedRole, setSelectedRole] = useState(null); // 'OWNER' 또는 'CLEANER'
  const [region, setRegion] = useState(""); // 기사님용 활동 지역 상태
  const { openPostcode } = useKakaoPostcode();
  
  const [formData, setFormData] = useState({ 
    name: "", 
    phonePrefix: "010",
    phoneMiddle: "",
    phoneLast: "",
    storeName: "",
    storePhonePrefix: "02",
    storePhoneMiddle: "",
    storePhoneLast: "",
    address: "",
    addressDetail: ""
  });

  // 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 주소검색
  const handleAddressSearch = () => {
    openPostcode((addr) => {
      setFormData(prev => ({
        ...prev,
        address: addr
      }));
    });
  };

  const handleSubmit = async () => {
    // 1. 필수값 체크
    if (!formData.name) return alert("이름을 입력해주세요.");
    if (selectedRole === 'CLEANER' && !region) return alert("활동 지역을 선택해주세요.");

    // 2. 서버 전송용 데이터 조립
    const finalData = {
      email,
      name: formData.name,
      phoneNumber: `${formData.phonePrefix}-${formData.phoneMiddle}-${formData.phoneLast}`,
      role: selectedRole, // 백엔드에서 기대하는 'role' 키값 사용
      provider: 'kakao',
      profile: profile,
      // 기사님일 경우 지역 정보 추가 (배열 형태)
      activityRegions: selectedRole === 'CLEANER' ? [region] : [],
      // 점주일 경우 매장 정보 추가 (입력 안했을 시 빈 문자열 처리)
      ...(selectedRole === 'OWNER' && {
        storeName: formData.storeName || "",
        storePhone: formData.storePhoneMiddle ? `${formData.storePhonePrefix}-${formData.storePhoneMiddle}-${formData.storePhoneLast}` : "",
        address: formData.address || "",
        addressDetail: formData.addressDetail || ""
      })
    };

    console.log("전송 데이터:", finalData);

    try {
      const response = await axiosInstance.post('/api/auth/signup/complete', finalData);

      if (response.status === 200 || response.status === 201) {
        const user = response.data?.data?.user || response.data?.user;
        if (user) {
          dispatch(setCredentials({ user }));
          alert("회원가입이 완료되었습니다!");
          navigate('/', { replace: true });
        } else {
          navigate('/login');
        }
      }
    } catch (error) {
      console.error("handleSubmit 에러 발생:", error);
      const errorMessage = error.response?.data?.message || "등록 중 오류가 발생했습니다.";
      alert(`등록 알림: ${errorMessage}`);
    }
  };

  return (
    <div className="all-container sociallogininfo-container">
      <div className="ice-doctor-logo1 socialLoginInfo-logo"></div>
      
      <div className="sociallogininfo-checkuser-container">
        <h2 className="sociallogininfo-section-title">회원 정보*</h2>
        
        <div className="sociallogininfo-info-box">
          <label htmlFor="name">이름</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="실명을 입력하세요" />
        </div>

        <div className="sociallogininfo-info-box">
          <p>이메일</p>
          <p className="sociallogininfo-email">{email}</p>
        </div>

        <div className="sociallogininfo-form-group">
          <label>전화번호</label>
          <div className="sociallogininfo-phone-inputs">
            <select name="phonePrefix" value={formData.phonePrefix} onChange={handleChange}>
              <option value="010">010</option>
              <option value="011">011</option>
            </select>
            <span className="separator">-</span>
            <input type="tel" name="phoneMiddle" maxLength="4" value={formData.phoneMiddle} onChange={handleChange} />
            <span className="separator">-</span>
            <input type="tel" name="phoneLast" maxLength="4" value={formData.phoneLast} onChange={handleChange} />
          </div>
        </div>

        <p className="sociallogininfo-coment">*점주님과 기사님 중 선택해주세요.</p>

        <div className="sociallogininfo-check-container">
          <button 
            type="button" 
            className={selectedRole === 'OWNER' ? 'active' : ''} 
            onClick={() => setSelectedRole('OWNER')}
          >
            점주님
          </button>
          <button 
            type="button" 
            className={selectedRole === 'CLEANER' ? 'active' : ''} 
            onClick={() => setSelectedRole('CLEANER')}
          >
            기사님
          </button>
        </div>
      </div>

      {/* 1. 점주님 선택 시 매장 정보 (선택 사항) */}
      {selectedRole === 'OWNER' && (
        <div className="sociallogininfo-section fade-in">
          <h2 className="sociallogininfo-section-title">매장 정보 (선택)</h2>
          <div className="sociallogininfo-form-group">
            <label>매장명</label>
            <input type="text" name="storeName" value={formData.storeName} placeholder="매장명을 입력하세요" onChange={handleChange} />
          </div>
          <div className="sociallogininfo-form-group">
            <label>매장 전화번호</label>
            <div className="sociallogininfo-phone-inputs">
              <select name="storePhonePrefix" value={formData.storePhonePrefix} onChange={handleChange}>
                <option value="02">02</option>
                <option value="031">031</option>
              </select>
              <span className="separator">-</span>
              <input type="tel" name="storePhoneMiddle" value={formData.storePhoneMiddle} maxLength="4" onChange={handleChange} />
              <span className="separator">-</span>
              <input type="tel" name="storePhoneLast" value={formData.storePhoneLast} maxLength="4" onChange={handleChange} />
            </div>
          </div>
          <div className="sociallogininfo-form-group">
            <label>주소</label>
            <div className="sociallogininfo-address-search-wrapper">
              <input type="text" value={formData.address} placeholder="주소를 검색하세요" readOnly />
              <button type="button" className="sociallogininfo-address-search-btn" onClick={handleAddressSearch}>검색하기</button>
            </div>
            <input type="text" name="addressDetail" className="detail-address" placeholder="상세 주소를 입력하세요" value={formData.addressDetail} onChange={handleChange}/>
          </div>
        </div>
      )}

      {/* 2. 기사님 선택 시 활동 지역 (필수) */}
      {selectedRole === 'CLEANER' && (
        <div className="sociallogininfo-section fade-in">
          <h2 className="sociallogininfo-section-title">활동 지역 설정*</h2>
          <div className="sociallogininfo-form-group">
            <label>활동 가능 지역</label>
            <select className="full-select" value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="">지역을 선택해주세요</option>
              <option value="서울 전체">서울 전체</option>
              <option value="경기 전체">경기 전체</option>
            </select>
          </div>
        </div>
      )}

      {selectedRole && (
        <button className="sociallogininfo-submit-btn" onClick={handleSubmit}>등록하기</button>
      )}
    </div>
  );
}