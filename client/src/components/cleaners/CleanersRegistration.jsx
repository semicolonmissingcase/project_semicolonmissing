import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from "../../api/axiosInstance.js";
import cleanersThunk from '../../store/thunks/cleanersThunk.js';
import Select from "react-select";
import './CleanersRegistration.css';

export default function CleanersRegistration() {

  // HOOKS 및 REDUX 상태 정의 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { locations, isInitialized } = useSelector((state) => state.cleaners);

  //  LOCAL 상태 정의 
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState(''); // 시/도 선택 상태

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
    locations: [], // 선택된 지역들 저장 (location ID 배열)
    provider: 'NONE',
    profile: '',
    locationId: '',
  });

  // useMemo (파생된 데이터/옵션 계산) 

  // [정리] 시/도 옵션 생성 및 군/구 맵 생성 로직 통합
  const memoizedOptions = useMemo(() => {
    const locationArray = locations.rows || [];


    if (!Array.isArray(locationArray) || locationArray.length === 0) {
      return { cityOptions: [], districtMap: {} }; // 빈 값 반환
    }

    const cityNames = new Set();
    const districtMap = {};

    locationArray.forEach((loc) => {
      cityNames.add(loc.city);
      if (!districtMap[loc.city]) {
        districtMap[loc.city] = [];
      }

      // 군/구 옵션: value는 loc.id, label은 loc.district
      districtMap[loc.city].push({
        value: loc.id,
        label: loc.district,
        city: loc.city,
      });
    });

    // 시/도 Select 옵션 생성
    const cityOptions = Array.from(cityNames).map(cityName => ({
      value: cityName,
      label: cityName
    }));

    return { cityOptions, districtMap };

  }, [locations]);

  const { cityOptions, districtMap } = memoizedOptions;

  // [정리] 현재 선택된 시/도에 해당하는 군/구 옵션 목록 필터링
  const districtOptions = useMemo(() => {
    return selectedCity
      ? districtMap[selectedCity] || []
      : [];
  }, [selectedCity, districtMap]);


  // useEffect (데이터 로딩) 
  useEffect(() => {
    if (!isInitialized) {
      console.log(' isInitialized: false. 초기 데이터 요청을 시작합니다.');
      dispatch(cleanersThunk.locationThunk());
    } else {
      console.log('데이터가 이미 초기화(로드) 되었으므로 다시 요청하지 않습니다.');
    }
  }, [dispatch, isInitialized]);


  //  핸들러 함수 정의 

  const handleCityChange = (selectedOption) => {

    setSelectedCity(selectedOption ? selectedOption.value : '');

  };

  const handleGenderChange = (e) => {
    setFormData(prev => ({
      ...prev,
      gender: e.target.value
    }));
  };

  // 구/군 토글 핸들러 
  const handleLocationToggle = (location) => {
    const locationId = location.value;

    setFormData(prev => {
      const isExist = prev.locations.includes(locationId);

      if (isExist) {
        return {
          ...prev,
          locations: prev.locations.filter(id => id !== locationId)
        };
      } else {
        if (prev.locations.length >= 5) {
          alert("최대 5개까지만 선택 가능합니다.");
          return prev;
        }
        return {
          ...prev,
          locations: [...prev.locations, locationId]
        };
      }
    });
  };

  // 선택된 지역 삭제 버튼
  const removeLocation = (locIdToRemove) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.filter(locId => locId !== locIdToRemove)
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
      name: formData.name,
      gender: formData.gender === 'male' ? 'M' : 'F',
      email: `${formData.emailLocal}@${formData.emailDomain}`,
      password: formData.password,
      passwordChk: formData.passwordChk,
      phoneNumber: `${formData.phonePrefix}-${formData.phoneMiddle}-${formData.phoneLast}`,
      locationId: formData.locations,
      provider: formData.provider,
    };

    try {
      setIsLoading(true);
      await axiosInstance.post('/api/users/cleaner', payload);
      alert("회원가입이 완료되었습니다.");
      navigate('/login');
    } catch (error) {
      const serverErrors = error.response?.data?.data;
      if (Array.isArray(serverErrors)) {
        alert(serverErrors.join('\n'));
      } else {
        alert(error.response?.data?.msg || "오류 발생");
      }
    } finally {
      setIsLoading(false);
    }
  };


  //스타일 정의 
  const selectStyle = {
    menulist: (base) => ({
      ...base,
      overflowY: "auto",
      maxHeight: '140px',
      borderRadius: "8px",
      outline: 'none',
    }),
    menu: (base) => ({
      ...base,
      borderColor: "#E1E5EF",
      borderWidth: '1px',
      borderStyle: 'solid',
      boxShadow: 'none',
      borderRadius: '8px',
      outline: 'none',
    }),
    control: (baseStyles) => ({
      ...baseStyles,
      borderColor: '#E1E5EF',
      borderWidth: '1px',
      borderStyle: 'solid',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#7C7F88',
      },
      borderRadius: '8px',
      minHeight: '43px',
      outline: 'none',
    }),
  };


  // 렌더링 
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


          {/* 희망 활동 지역 (다중 선택) */}
          <div className="cleaners-registration-form-group">
            <label>희망 활동 지역 (1~5개)*</label>

            {/* 시/도 선택 */}
            <Select
              styles={selectStyle}
              className="cleaners-registration-location-city-select"
              options={cityOptions}
              onChange={handleCityChange}
              placeholder="시/도 선택"
              noOptionsMessage={() => "옵션 없음"}
            />

            {/* 구/군 선택 박스 - 시/도가 선택되었을 때만 노출 */}
            {selectedCity && districtOptions.length > 0 && (
              <div className="cleaners-registration-district-selection-box">
                {districtOptions
                  .map((loc) => {
                    const isSelected = formData.locations.includes(loc.value);

                    return (
                      <button
                        className={`cleaners-registration-district-selection-button ${isSelected ? 'selected' : ''}`}
                        type="button"
                        key={loc.value}
                        onClick={() => handleLocationToggle(loc)}
                      >
                        {loc.label}
                      </button>
                    );
                  })
                }
              </div>
            )}

            {/* 선택된 지역 칩 리스트 (하단에 나열) */}
            <div className="cleaners-registration-selected-locations-wrapper">
              {formData.locations.map(locId => {
                let fullLoc = null;
                // districtMap에서 locId를 찾습니다.
                for (const city in districtMap) {
                  fullLoc = districtMap[city].find(loc => loc.value === locId);
                  if (fullLoc) break;
                }

                if (!fullLoc) return null;
                const locStr = `${fullLoc.city} ${fullLoc.label}`;

                return (
                  <span key={locId} className="cleaners-registration-selected-badge-wrapper">
                    {locStr}
                    <button
                      className="cleaners-registration-selected-locations-badge"
                      type="button"
                      onClick={() => removeLocation(locId)}>
                      ×
                    </button>
                  </span>
                )
              })}
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
          </div>

        </div>

        <div className="cleaners-registration-cleaners-agreement">
          <h4 className="cleaners-registration-cleaners-agreement-title">이용약관</h4>
          <div>
            제 1 장 총칙
            <br />
            <br />
            제 1 조 (목적)
            <br />
            <br />
            본 약관은 주식회사 아이스닥터(이하 "회사" 또는 "아이스닥터")가 운영하는 '아이스닥터' 서비스(이하 "서비스")를 통해 제빙기 청소 및 관련 서비스를 제공하고자 회원으로 가입하는 자(이하 "회원" 또는 "기사님")와 회사 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.
            <br />
            <br />
            제 2 조 (용어의 정의)
            <br />
            <br />
            1. 서비스: 회사가 기사님과 고객을 중개하고 연결하는 온라인 플랫폼 및 관련 모든 기능을 의미합니다.
            <br />
            <br />
            2. 회원(기사님): 본 약관에 동의하고 회사가 정한 절차에 따라 회원으로 등록하여 제빙기 청소 서비스를 고객에게 제공하는 개인 또는 사업자를 의미합니다.
            <br />
            <br />
            3. 고객: 서비스를 통해 기사님으로부터 제빙기 청소 서비스를 제공받고자 하는 이용자를 의미합니다.
            <br />
            <br />
            4. 거래: 회원을 통해 고객에게 서비스가 제공되고 대가가 지급되는 일련의 활동을 의미합니다.
            <br />
            <br />
            5. 통신판매중개자: 회사는 통신판매중개자로서, 서비스 제공 및 거래 당사자가 아니며, 거래의 이행 및 계약 책임은 거래 당사자에게 있습니다.
            <br />
            <br />
            제 3 조 (약관의 효력 및 변경)
            <br />
            <br />
            1. 본 약관은 회원이 회원가입 시 동의하고 회사가 이를 승낙함으로써 효력이 발생합니다.
            <br />
            <br />
            2. 회사는 관계 법령을 위배하지 않는 범위 내에서 본 약관을 개정할 수 있습니다.
            <br />
            <br />
            3. 회사가 약관을 개정할 경우, 개정 약관의 효력 발생일 및 개정 사유를 명시하여 기존 약관과 함께 서비스 화면에 그 효력 발생일 7일 이전부터 공지합니다. 다만, 회원에게 불리하게 약관 내용을 변경하는 경우에는 최소한 30일 이상의 유예 기간을 두고 공지합니다.
            <br />
            <br />
            4. 개정 약관에 대해 공지 기간 내에 회원이 거부 의사를 표시하지 않는 경우, 개정 약관에 동의한 것으로 봅니다.

            <hr className="cleaners-registration-hr" />

            제 2 장 회원 가입 및 관리
            <br />
            <br />
            제 4 조 (회원가입)
            <br />
            <br />
            1. 회원가입은 서비스를 이용하고자 하는 자가 회사가 정한 양식에 따라 회원 정보를 기입하고 본 약관 및 개인정보 처리방침에 동의함으로써 이루어집니다.
            <br />
            <br />
            2. 회사는 아래 각 호에 해당하는 경우 회원가입을 승낙하지 않거나 추후에 취소할 수 있습니다.
            &nbsp;- 허위 정보를 기재하거나 필수 정보를 누락한 경우
            <br />
            <br />
            &nbsp;- 본 약관에 의해 이전에 회원 자격을 상실한 적이 있는 경우
            <br />
            <br />
            &nbsp;- 기타 회사의 정상적인 서비스 운영을 저해하거나 법령에 위반되는 경우
            <br />
            <br />
            제 5 조 (회원의 의무)
            <br />
            <br />
            1. 회원은 서비스 이용 및 청소 서비스 제공 시 관련 법령 및 본 약관, 회사가 공지하는 사항을 준수하여야 하며, 기타 회사의 업무를 방해하는 행위를 하여서는 안 됩니다.
            <br />
            <br />
            2. 거래 책임: 회원은 고객과의 거래에 대한 모든 책임(서비스의 품질, 이행, 안전, 하자 보수 등)을 스스로 부담하며, 회사는 거래 당사자가 아닙니다.
            <br />
            <br />
            3. 회원은 서비스 등록 정보 및 서비스 제공 자격과 관련된 모든 정보를 최신 상태로 유지해야 합니다.
            <br />
            <br />
            4. 회원은 고객에게 피해를 주거나 불필요한 민원을 야기하는 행위(부당한 추가 비용 요구, 불친절 등)를 하여서는 안 됩니다.
            <br />
            <br />
            제 6 조 (서비스 수수료 및 정산)
            <br />
            <br />
            1. 중개 수수료 부과: 회사는 기사님에게 고객과의 중개 서비스 제공 대가로 중개 수수료를 부과합니다.
            <br />
            <br />
            2. 수수료율: 중개 수수료율은 기사님이 고객에게 제공한 서비스의 건당 최종 결제 금액의 10%로 합니다.
            <br />
            <br />
            3. 수수료 공제: 회사는 고객으로부터 결제 대금을 수령한 후, 정산 시점에 제2항에 따른 중개 수수료를 공제한 나머지 금액을 기사님에게 지급합니다.
            <br />
            <br />
            4. 정산 주기 및 지급:
            <br />
            &nbsp;- 정산은 매주 월요일에 진행됩니다.
            <br />
            <br />
            &nbsp;- 정산 대상은 직전 주(월요일부터 일요일까지) 완료된 서비스 작업분입니다.
            <br />
            <br />
            &nbsp;- 회사는 정산 대상 기간의 결제 금액에서 중개 수수료를 공제한 금액을 기사님이 지정한 계좌로 지급합니다.
            <br />
            <br />
            &nbsp;- 지급일이 공휴일인 경우, 해당 공휴일의 직전 영업일에 지급하는 것을 원칙으로 합니다.
            <br />
            <br />
            5. 환불 및 재정산: 회원의 귀책사유로 고객에게 환불 또는 재작업이 발생하는 경우, 회사는 이미 지급된 대금 및 수수료에 대해 회수(차감) 조치를 취할 수 있습니다.
            <br />
            <br />
            6. 정책 변경: 회사가 수수료율 또는 정산 주기를 변경하고자 하는 경우, 회원에게 최소 7일 전에 사전 고지합니다. 다만, 회원에게 불리하게 변경되는 경우에는 30일 이상의 유예 기간을 두고 고지합니다.

            <hr className="cleaners-registration-hr" />

            제 3 장 서비스 이용
            <br />
            <br />
            제 7 조 (서비스의 종류 및 내용)
            <br />
            <br />
            1. 회사는 제빙기 청소 서비스 매칭, 예약 관리, 정산 지원 등 플랫폼 운영에 필요한 서비스를 제공합니다.
            <br />
            <br />
            2. 서비스의 구체적인 종류 및 내용은 회사의 정책에 따라 변경될 수 있으며, 변경 시 서비스 화면을 통해 공지합니다.
            <br />
            <br />
            제 8 조 (거래의 책임 및 의무)
            <br />
            <br />
            1. 거래의 주체: 회사는 플랫폼을 통해 고객과 회원을 연결하는 역할만 수행하며, 제빙기 청소 서비스 제공에 대한 계약의 당사자는 회원이 됩니다.
            <br />
            <br />
            2. 회원은 제공하는 서비스의 품질, 안전성, 적법성 등에 대하여 전적인 책임을 집니다.
            <br />
            <br />
            3. 회원은 고객이 예약한 서비스 내용을 성실히 이행하여야 하며, 부득이한 사유로 이행이 어려울 경우 즉시 회사와 고객에게 통지하고 협의하여야 합니다.

            <hr className="cleaners-registration-hr" />

            제 4 장 기타
            <br />
            <br />
            제 9 조 (계약 해지 및 이용 제한)
            <br />
            <br />
            1. 회원은 언제든지 회사에 통지함으로써 이용계약을 해지할 수 있습니다.
            <br />
            <br />
            2. 회사는 회원이 다음 각 호의 사유에 해당하는 경우, 사전 통보 없이 서비스 이용을 제한하거나 회원 자격을 상실시킬 수 있습니다.
            <br />
            <br />
            &nbsp;- 본 약관 및 관련 법령을 위반한 경우
            <br />
            <br />
            &nbsp;- 고객으로부터 서비스 불만, 민원 등이 반복적으로 접수되어 회사의 명예를 훼손하거나 서비스 운영에 지장을 초래하는 경우
            <br />
            <br />
            &nbsp;- 허위 또는 과장된 정보로 고객을 유인하는 경우</div>
        </div>

        <button type="submit" className="bg-blue btn-big" disabled={isLoading}>
          {isLoading ? "가입 처리 중..." : "회원가입"}
        </button>
      </form>
    </div>
  );
}