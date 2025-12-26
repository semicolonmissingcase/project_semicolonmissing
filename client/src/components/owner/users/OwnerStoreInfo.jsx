import { useState } from "react";
import "./OwnerStoreInfo.css";
import useKakaoPostcode from "../../hooks/useKakaoPostcode.js";

export default function OwnerStoreInfo({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    detailAddress: ""
  });

  const [phonePrefix, setPhonePrefix] = useState("02");
  const { openPostcode } = useKakaoPostcode();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phone || !formData.address) {
      alert("필수 항목을 입력해주세요.");
      return;
    }
    onSubmit(formData);
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
                <option value="054">054</option> {/* 경뷱 */}
                <option value="055">055</option> {/* 경남 */}
                <option value="061">061</option> {/* 전남 */}
                <option value="062">062</option> {/* 광주 */}
                <option value="063">063</option> {/* 전북 */}
                <option value="064">064</option> {/* 제주 */}
              </select>
              <span>-</span>
              <input type="text" maxLength="4" />
              <span>-</span>
              <input type="text" maxLength="4" />
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