import axios from 'axios';
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
  const [selectedRole, setSelectedRole] = useState(null); // 'OWNER' 또는 'CLEANER'
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


const handleSubmit = async () => {

  try {
    const response = await axiosInstance.post('/api/auth/signup/complete', finalData);

    // response.data 전체를 먼저 출력해서 구조를 확인해보세요
    console.log("서버 전체 응답:", response.data);

    if (response.status === 200 || response.status === 201) {
      // 서버 응답 구조가 response.data.data.user 인지 확인이 필요합니다.
      // 만약 구조가 다르다면 아래처럼 안전하게 추출하세요.
      const user = response.data?.data?.user || response.data?.user;

      if (user) {
        dispatch(setCredentials({ user }));
        alert("회원가입이 완료되었습니다!");
        //  성공 시에만 페이지 이동
        navigate('/', { replace: true });
      } else {
        // 유저 정보가 없으면 수동으로라도 이동 시키거나 로그인을 다시 유도
        console.warn("유저 정보가 응답에 없습니다.");
        navigate('/login');
      }
    }
  } catch (error) {
    // 에러가 났을 때 어떤 에러인지 상세히 출력
    console.error("handleSubmit 에러 발생:", error);
    
    // 네트워크 탭의 'me' 401 에러 때문일 가능성이 큽니다.
    const errorMessage = error.response?.data?.message || "등록은 되었으나 로그인 정보를 가져오지 못했습니다. 다시 로그인해주세요.";
    alert(`등록 알림: ${errorMessage}`);
    
    // 저장은 되었으니 로그인 페이지로 보내버리는 것도 방법입니다.
    navigate('/login');
  }
};

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

  return (
    <div className="all-container sociallogininfo-container">
      <div className="ice-doctor-logo1 socialLoginInfo-logo"></div>
      
      <div className="sociallogininfo-checkuser-container">
        <h2 className="sociallogininfo-section-title">회원 정보*</h2>
        {/* 이름 입력 */}
        <div className="sociallogininfo-info-box">
          <label htmlFor="name">이름</label>
          <input type="text" id="name" name="name" placeholder="기존이름출력" onChange={handleChange} />
        </div>

        {/* 이메일(출력) */}
        <div className="sociallogininfo-info-box">
          <p>이메일</p>
          <p className="sociallogininfo-email">kakao@kakao</p>
        </div>

        {/* 개인 전화번호 */}
        <div className="sociallogininfo-form-group">
          <label>전화번호</label>
          <div className="sociallogininfo-phone-inputs">
            <select name="phonePrefix" value={formData.phonePrefix} onChange={handleChange}>
              <option value="010">010</option>
              <option value="011">011</option>
              <option value="016">016</option>
              <option value="017">017</option>
              <option value="018">018</option>
              <option value="019">019</option>
            </select>
            <span className="separator">-</span>
            <input type="tel" name="phoneMiddle" maxLength="4" onChange={handleChange} />
            <span className="separator">-</span>
            <input type="tel" name="phoneLast" maxLength="4" onChange={handleChange} />
          </div>
        </div>

        <p className="sociallogininfo-coment">*점주님과 기사님 중 선택해주세요.</p>

        {/* 역할 선택 버튼 */}
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

      {/* --- 조건부 렌더링 영역 --- */}
      
      {/* 1. 점주님 선택 시 매장 정보 출력 */}
      {selectedRole === 'OWNER' && (
        <div className="sociallogininfo-section fade-in">
          <h2 className="sociallogininfo-section-title">매장 정보</h2>
          
          <div className="sociallogininfo-form-group">
            <label>매장명</label>
            <input type="text" name="storeName" placeholder="매장명을 입력하세요" onChange={handleChange} />
          </div>

          <div className="sociallogininfo-form-group">
            <label>매장 전화번호</label>
            <div className="sociallogininfo-phone-inputs">
              <select name="storePhonePrefix" onChange={handleChange}>
                <option value="02">02</option>
                <option value="031">031</option>
                <option value="032">032</option>
                <option value="033">033</option>
                <option value="041">041</option>
                <option value="042">042</option>
                <option value="043">043</option>
                <option value="044">044</option>
                <option value="051">051</option>
                <option value="052">052</option>
                <option value="053">053</option>
                <option value="054">054</option>
                <option value="055">055</option>
                <option value="061">061</option>
                <option value="062">062</option>
                <option value="063">063</option>
                <option value="064">064</option>
              </select>
              <span className="separator">-</span>
              <input type="tel" name="storePhoneMiddle" maxLength="4" onChange={handleChange} />
              <span className="separator">-</span>
              <input type="tel" name="storePhoneLast" maxLength="4" onChange={handleChange} />
            </div>
          </div>

          <div className="sociallogininfo-form-group">
            <label>주소</label>
            <div className="sociallogininfo-address-search-wrapper">
              <input type="text" placeholder="주소를 검색하세요" readOnly />
              <button type="button" className="sociallogininfo-address-search-btn"
                onClick={handleAddressSearch}>
                검색하기
              </button>
            </div>
            <input type="text" className="detail-address" placeholder="상세 주소를 입력하세요" />
          </div>
        </div>
      )}

      {/* 2. 기사님 선택 시 (예시: 지역 선택) */}
      {/* 이거 윤희씨가 푸시해주면 지역선택하는 거 들고 올 거에요. */}
      {selectedRole === 'CLEANER' && (
        <div className="sociallogininfo-section fade-in">
          <h2 className="sociallogininfo-section-title">활동 지역 설정</h2>
          <div className="sociallogininfo-form-group">
            <label>활동 가능 지역</label>
            <select className="full-select">
              <option>지역을 선택해주세요</option>
              <option>서울 전체</option>
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