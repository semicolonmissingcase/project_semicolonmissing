import { useState } from "react";
import "./OwnerInfo.css";
import OwnerStoreInfo from "./OwnerStoreInfo";

export default function OwnerInfo() {
  const [phonePrefix, setPhonePrefix] = useState("010");
  const [stores, setStores] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddStore = (newStore) => {
    setStores([...stores, { ...newStore, id: Date.now() }]);
    setIsModalOpen(false);
  };

  const removeStore = (id) => {
    setStores(stores.filter(store => store.id !== id));
  };

  return (
    <>
      <div className="all-container ownerinfo-container">
        <div className="ownerinfo-profile-container">
          <div className="ownerinfo-profile-img" style={{ backgroundImage: `url('/icons/default-profile.png')` }}></div>
          <h2>OOO 점주님</h2>
          <p>admin@admin.com</p>
        </div>
        
        <div className="ownerinfo-profile-setting-container">
          <div className="ownerinfo-phone-num-container">
            <label htmlFor="phone-num">전화번호</label>
            <div className="ownerinfo-phone-inputs">
              <select value={phonePrefix} onChange={(e) => setPhonePrefix(e.target.value)}>
                <option value="010">010</option>
                <option value="011">011</option>
                <option value="016">016</option>
                <option value="017">017</option>
                <option value="018">018</option>
                <option value="019">019</option>
              </select>
              <span>-</span>
              <input type="text" maxLength="4" />
              <span>-</span>
              <input type="text" maxLength="4" />
            </div>
          </div>
          
          <div className="ownerinfo-store-info-container">
            <div className="ownerinfo-store-info-header">
              <p>매장 정보</p>
              <button 
                type="button" 
                className="bg-blue btn-small" 
                onClick={() => setIsModalOpen(true)}
              >
                매장 추가 및 수정
              </button>
            </div>
            
            <div className="ownerinfo-store-info-card-container">
              {stores.map((store) => (
                <div key={store.id} className="ownerinfo-store-card">
                  <div className="ownerinfo-store-card-header">
                    <span className="store-name">{store.name || "매장명"}</span>
                    <button type="button" className="delete-btn" onClick={() => removeStore(store.id)}>
                      <div className="icon-delete" />
                    </button>
                  </div>
                  <div className="ownerinfo-store-field">
                    <label>전화번호</label>
                    <p>{store.phone}</p>
                  </div>
                  <div className="ownerinfo-store-field">
                    <label>주소</label>
                    <p>{store.address}</p>
                  </div>
                  <div className="ownerinfo-store-field">
                    <label>상세주소</label>
                    <p>{store.detailAddress}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="ownerinfo-btn-container">
          <button type="button" className="bg-light btn-medium">수정 취소</button>
          <button type="button" className="bg-blue btn-medium">수정 완료</button>
        </div>
      </div>

      {isModalOpen && (
        <OwnerStoreInfo 
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddStore}
        />
      )}
    </>
  );
}