import { useState } from "react";
import "./OwnerStoreInfo.css";
import useKakaoPostcode from "../../hooks/useKakaoPostcode.js";

export default function OwnerStoreInfo({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    // phone은 이제 파트별로 관리 후 조합
    address: "",
    detailAddress: ""
  });

  const [phonePrefix, setPhonePrefix] = useState("02");
  const [phoneMiddle, setPhoneMiddle] = useState(""); // 전화번호 중간 부분 상태
  const [phoneLast, setPhoneLast] = useState("");     // 전화번호 마지막 부분 상태

  const { openPostcode } = useKakaoPostcode();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 전화번호 각 부분 입력 핸들러
  const handlePhonePartChange = (setter) => (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 허용
    setter(numericValue);
  };

  const handleSubmit = () => {
    // 클라이언트 측 유효성 검사
    if (!formData.name.trim()) {
      alert("매장명을 입력해주세요.");
      return;
    }
    if (!phoneMiddle.trim() || !phoneLast.trim()) { // 전화번호 중간/마지막 부분 검증
      alert("매장 전화번호를 입력해주세요.");
      return;
    }
    if (!formData.address.trim()) {
      alert("주소를 검색해주세요.");
      return;
    }
    if (!formData.detailAddress.trim()) { // 상세 주소도 필수로 만듭니다.
      alert("상세 주소를 입력해주세요.");
      return;
    }

    // 1. 전화번호 조합
    const phoneNumber = `${phonePrefix}${phoneMiddle}${phoneLast}`;

    // 2. 주소 가공 (시/도, 군/구/읍/면/동, 상세주소로 분리)
    let addr1 = ''; // 시/도
    let addr2 = ''; // 군/구/읍/면/동
    const fullAddressFromPostcode = formData.address; // 카카오 우편번호에서 받은 전체 주소
    const detailAddressInput = formData.detailAddress; // 사용자가 입력한 상세 주소

    if (fullAddressFromPostcode) {
      const addressParts = fullAddressFromPostcode.split(' ');
      if (addressParts.length > 0) addr1 = addressParts[0];
      // 주소 파트가 1개 이상이면 2번째 파트부터 끝까지 합쳐서 addr2로
      if (addressParts.length > 1) addr2 = addressParts.slice(1).join(' ');
    }
    // addr3은 사용자가 직접 입력한 상세주소
    const addr3 = detailAddressInput;

    // 3. 서버가 기대하는 형식으로 데이터 구성
    const formattedStoreData = {
      name: formData.name,
      phoneNumber: phoneNumber,
      addr1: addr1,
      addr2: addr2,
      addr3: addr3,
    };

    console.log("클라이언트가 보내는 데이터:", formattedStoreData);

    onSubmit(formattedStoreData); // OwnerInfo.jsx의 handleAddStore로 전달
  };

  const handleAddressSearch = () => {
    openPostcode((addr) => {
      setFormData(prev => ({
        ...prev,
        address: addr
      }));
    });
  };

  return (
    <div className="ownerstoreinfo-modal-overlay" onClick={onClose}>
      <div className="ownerstoreinfo-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>매장 추가</h2>

        <div className="ownerstoreinfo-store-form">
          <div className="ownerstoreinfo-form-field">
            <label>매장명</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="매장명을 입력하세요"
            />
          </div>

          <div className="ownerstoreinfo-form-field">
            <label>전화번호</label>
            <div className="ownerstoreinfo-phone-inputs">
              <select value={phonePrefix} onChange={(e) => setPhonePrefix(e.target.value)}>
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
                <option value="054">054</option> {/* 경북 */}
                <option value="055">055</option> {/* 경남 */}
                <option value="061">061</option> {/* 전남 */}
                <option value="062">062</option> {/* 광주 */}
                <option value="063">063</option> {/* 전북 */}
                <option value="064">064</option> {/* 제주 */}
              </select>
              <span>-</span>
              <input
                type="text"
                maxLength="4"
                value={phoneMiddle}
                onChange={handlePhonePartChange(setPhoneMiddle)}
              />
              <span>-</span>
              <input
                type="text"
                maxLength="4"
                value={phoneLast}
                onChange={handlePhonePartChange(setPhoneLast)}
              />
            </div>
          </div>

          <div className="ownerstoreinfo-form-field">
            <label>주소</label>
            <div className="ownerstoreinfo-address-field">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="주소를 검색하세요"
                readOnly
              />
              <button
                type="button"
                className="bg-blue btn-medium"
                onClick={handleAddressSearch}
              >
                검색하기
              </button>
            </div>
          </div>

          <div className="ownerstoreinfo-form-field">
            <label>상세주소</label>
            <input
              type="text"
              name="detailAddress"
              value={formData.detailAddress}
              onChange={handleChange}
              placeholder="상세주소를 입력하세요"
            />
          </div>
        </div>

        <div className="ownerstoreinfo-modal-btn-container">
          <button type="button" className="bg-light btn-medium" onClick={onClose}>
            추가 취소
          </button>
          <button type="button" className="bg-blue btn-medium" onClick={handleSubmit}>
            추가 완료
          </button>
        </div>
      </div>
    </div>
  );
}