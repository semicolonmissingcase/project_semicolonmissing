import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OwnerRegistration.css';
import useKakaoPostcode from "../../hooks/useKakaoPostcode.js";
import { useDispatch } from "react-redux";
import { ownerStoreThunk } from "../../../store/thunks/userStore.Thunk.js";
import ConfirmModal from '../../result/ConfirmModal.jsx';

const DEFAULT_PROFILE_IMAGE_URL = '/icons/default-profile.png'; // 기본 프로필 사진

export default function OwnerRegistration() {
  const navigate = useNavigate();
  const { openPostcode } = useKakaoPostcode();
  const dispatch = useDispatch();
  
  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState({});
  
  // 모달 제어
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState(null);

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
    storeName: '',
    storePhonePrefix: '02',
    storePhoneMiddle: '',
    storePhoneLast: '',
    address: '',
    addressDetail: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 에러 메시지 초기화
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (serverErrors[name]) {
      setServerErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhoneInput = (e, nextFieldName) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, '');
    
    setFormData(prev => ({
      ...prev,
      [name]: numericValue
    }));

    if (numericValue.length === 4 && nextFieldName) {
      const nextField = document.querySelector(`input[name="${nextFieldName}"]`);
      if (nextField) nextField.focus();
    }

    if (errors.phone || errors.storePhone) {
      setErrors(prev => ({ ...prev, phone: '', storePhone: '' }));
    }
  };

  const handleEmailDomainChange = (e) => {
    const selectedDomain = e.target.value;
    if (selectedDomain) {
      setFormData(prev => ({ ...prev, emailDomain: selectedDomain }));
    }
  };

  const handleGenderChange = (e) => {
    setFormData(prev => ({ ...prev, gender: e.target.value }));
  };

  const handleAddressSearch = () => {
    openPostcode((addr) => {
      setFormData(prev => ({ ...prev, address: addr }));
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = '이름을 입력해주세요';
    if (!formData.emailLocal || !formData.emailDomain) newErrors.email = '이메일을 입력해주세요';
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다';
    }
    if (formData.password !== formData.passwordChk) newErrors.passwordChk = '비밀번호가 일치하지 않습니다';
    if (!formData.phoneMiddle || !formData.phoneLast) newErrors.phone = '전화번호를 입력해주세요';

    if (formData.storeName || formData.address || (formData.storePhoneMiddle && formData.storePhoneLast)) {
      if (!formData.addressDetail.trim()) newErrors.addressDetail = '매장 상세주소를 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setServerErrors({});

    try {
      const submitData = {
        name: formData.name,
        gender: formData.gender,
        email: `${formData.emailLocal}@${formData.emailDomain}`,
        password: formData.password,
        passwordChk: formData.passwordChk,
        phone: `${formData.phonePrefix}-${formData.phoneMiddle}-${formData.phoneLast}`,
        profile: DEFAULT_PROFILE_IMAGE_URL,
      }

      if (formData.storeName || formData.address || formData.addressDetail || (formData.storePhoneMiddle && formData.storePhoneLast)) {
        let processedAddr1 = '';
        let processedAddr2 = '';
        let processedAddr3 = '';

        if(formData.address) {
          const addressParts = formData.address.split(' ');
          if(addressParts.length > 0) processedAddr1 = addressParts[0];
          if(addressParts.length > 1) processedAddr2 = addressParts.slice(1).join(' ');
          processedAddr3 = formData.addressDetail.trim();
        }

        submitData.store = {
          name: formData.storeName,
          addr1: processedAddr1,
          addr2: processedAddr2,
          addr3: processedAddr3,
          phoneNumber: formData.storePhoneMiddle && formData.storePhoneLast 
            ? `${formData.storePhonePrefix}${formData.storePhoneMiddle}${formData.storePhoneLast}`
            : '',
        };
      }

      await dispatch(ownerStoreThunk(submitData)).unwrap();
      navigate('/result', {
        state: {
          title: '회원가입이 완료되었습니다!',
          message: '안녕하세요 점주님!\n다양한 기사님을 만나보세요.',
          imgSrc: '/icons/success.png',
          button1Text: '홈으로 가기',
          button1Path: '/',
          button2Text: '로그인으로 가기',
          button2Path: '/login',
          showButton2: true,
        },
      });

    } catch (error) {
      console.error('회원가입 오류:', error);

      // 실패 모달 설정 (원인에 상관없이 실패 안내만 출력)
      setModalConfig({
        message: "회원가입에 실패했습니다.",
        confirmText: "확인",
        cancelText: null, // 버튼 1개만 나옴
        isDelete: false,
        onConfirm: () => {} // 모달 닫기 외 추가 동작 없을 때
      });
      setIsConfirmModalOpen(true);

      // 필드별 서버 에러 처리 (기존 로직 유지)
      if (error && error.data && Array.isArray(error.data.message)) {
        const newServerErrors = {};
        error.data.message.forEach(err => {
          const [field, ...message] = err.split(': ');
          newServerErrors[field.trim()] = message.join(': ');
        });
        setServerErrors(newServerErrors);
      }
    }
  };

  return (
    <div className="all-container owner-registration-container">
      <h1 className="ice-doctor-logo1"></h1>

      <form onSubmit={handleSubmit} className="owner-registration-form">
        <div className="owner-registration-section">
          <h2 className="owner-registration-section-title">회원 정보*</h2>
          
          <div className="owner-registration-form-group">
            <label htmlFor="name">이름</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="이름을 입력하세요" />
            {(errors.name || serverErrors.name) && <span className="owner-registration-error-text">{errors.name || serverErrors.name}</span>}
          </div>

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

          <div className="owner-registration-form-group">
            <label>이메일</label>
            <div className="owner-registration-email-inputs">
              <input type="text" name="emailLocal" value={formData.emailLocal} onChange={handleChange} className="owner-registration-email-input" placeholder="이메일" />
              <span className="owner-registration-email-separator">@</span>
              <input type="text" name="emailDomain" value={formData.emailDomain} onChange={handleChange} placeholder="직접입력" className="owner-registration-email-input" />
              <select className="owner-registration-email-domain-select" value="" onChange={handleEmailDomainChange}>
                <option value="">선택</option>
                <option value="naver.com">naver.com</option>
                <option value="gmail.com">gmail.com</option>
                <option value="daum.net">daum.net</option>
              </select>
            </div>
            {(errors.email || serverErrors.email) && <span className="owner-registration-error-text">{errors.email || serverErrors.email}</span>}
          </div>

          <div className="owner-registration-form-group">
            <label htmlFor="password">비밀번호</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="비밀번호를 입력하세요" />
            {(errors.password || serverErrors.password) && <span className="owner-registration-error-text">{errors.password || serverErrors.password}</span>}
          </div>

          <div className="owner-registration-form-group">
            <label htmlFor="passwordChk">비밀번호 확인</label>
            <input type="password" id="passwordChk" name="passwordChk" value={formData.passwordChk} onChange={handleChange} placeholder="비밀번호를 다시 입력하세요" />
            {errors.passwordChk && <span className="owner-registration-error-text">{errors.passwordChk}</span>}
          </div>

          <div className="owner-registration-form-group">
            <label htmlFor="phone">전화번호</label>
            <div className="owner-registration-phone-inputs">
              <select name="phonePrefix" value={formData.phonePrefix} onChange={handleChange} className="owner-registration-phone-prefix">
                <option value="010">010</option>
                <option value="011">011</option>
                <option value="016">016</option>
                <option value="017">017</option>
                <option value="018">018</option>
                <option value="019">019</option>
              </select>
              <span className="owner-registration-phone-separator">-</span>
              <input type="tel" name="phoneMiddle" value={formData.phoneMiddle} onChange={(e) => handlePhoneInput(e, 'phoneLast')} className="owner-registration-phone-input" maxLength="4" />
              <span className="owner-registration-phone-separator">-</span>
              <input type="tel" name="phoneLast" value={formData.phoneLast} onChange={(e) => handlePhoneInput(e, null)} className="owner-registration-phone-input" maxLength="4" />
            </div>
            {(errors.phone || serverErrors.phone) && <span className="owner-registration-error-text">{errors.phone || serverErrors.phone}</span>}
          </div>
        </div>

        <div className="owner-registration-section">
          <h2 className="owner-registration-section-title">매장 정보</h2>
          <div className="owner-registration-form-group">
            <label htmlFor="storeName">매장명</label>
            <input type="text" id="storeName" name="storeName" value={formData.storeName} onChange={handleChange} placeholder="매장명을 입력하세요" />
            {(errors.storeName || serverErrors.storeName) && <span className="owner-registration-error-text">{errors.storeName || serverErrors.storeName}</span>}
          </div>

          <div className="owner-registration-form-group">
            <label htmlFor="storePhone">전화번호</label>
            <div className="owner-registration-phone-inputs">
              <select name="storePhonePrefix" value={formData.storePhonePrefix} onChange={handleChange} className="owner-registration-phone-prefix">
                <option value="02">02</option>
                <option value="031">031</option>
                <option value="032">032</option>
              </select>
              <span className="owner-registration-phone-separator">-</span>
              <input type="tel" name="storePhoneMiddle" value={formData.storePhoneMiddle} onChange={(e) => handlePhoneInput(e, 'storePhoneLast')} className="owner-registration-phone-input" maxLength="4" />
              <span className="owner-registration-phone-separator">-</span>
              <input type="tel" name="storePhoneLast" value={formData.storePhoneLast} onChange={(e) => handlePhoneInput(e, null)} className="owner-registration-phone-input" maxLength="4" />
            </div>
          </div>

          <div className="owner-registration-form-group">
            <label htmlFor="address">주소</label>
            <div className="owner-registration-address-search-wrapper">
              <input type="text" id="address" name="address" value={formData.address} placeholder="주소를 검색하세요" readOnly />
              <button type="button" className="owner-registration-address-search-btn bg-blue btn-small" onClick={handleAddressSearch}>검색하기</button>
            </div>
          </div>

          <div className="owner-registration-form-group">
            <input type="text" name="addressDetail" value={formData.addressDetail} onChange={handleChange} placeholder="상세 주소를 입력하세요" />
            {errors.addressDetail && <span className="owner-registration-error-text">{errors.addressDetail}</span>}
          </div>
        </div>

        <button type="submit" className="bg-blue btn-big">회원가입</button>
      </form>

      {/* 실패 알림 모달 */}
      <ConfirmModal 
        isOpen={isConfirmModalOpen} 
        onClose={() => setIsConfirmModalOpen(false)} 
        config={modalConfig} 
      />
    </div>    
  );
}