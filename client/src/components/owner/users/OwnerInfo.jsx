import { useEffect, useState } from "react";
import "./OwnerInfo.css";
import OwnerStoreInfo from "./OwnerStoreInfo";
import { useDispatch, useSelector } from "react-redux";
import { storeGetThunk } from "../../../store/thunks/storeGetThunk.js";
import { storeCreateThunk } from "../../../store/thunks/storeCreateThunk.js";
import { storeDeleteThunk } from "../../../store/thunks/storeDeleteThunk.js";

export default function OwnerInfo() {
  const dispatch = useDispatch();
  const { stores, status, error } = useSelector((state) => state.store);
  const [phonePrefix, setPhonePrefix] = useState("010");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 매장 목록 불러오기
  useEffect(() => {
    if(status === 'idle') {
      dispatch(storeGetThunk());
    }
  }, [dispatch, status]); 

  const handleAddStore = (newStore) => {
    console.log("Adding store via Redux thunk:", newStore); // Placeholder for debugging
    dispatch(storeCreateThunk(newStore)); // 매장 생성
    setIsModalOpen(false); // 모달 닫기
  };

  const removeStore = (id) => {
    console.log("Removing store via Redux thunk:", id);
    dispatch(storeDeleteThunk(id)); // 매장 삭제
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
              {/* 매장 정보 로딩 및 에러 상태 표시 */}
              {status === 'loading' && <p>매장 정보를 불러오는 중...</p>}
              {status === 'failed' && <p>매장 정보를 불러오는데 실패했습니다: {error}</p>}
              {/* 매장 목록 렌더링 */}
              {status === 'succeeded' && stores.length === 0 && <p>등록된 매장이 없습니다.</p>}
              {status === 'succeeded' && stores.map((store) => (
                <div key={store.id} className="ownerinfo-store-card">
                  <div className="ownerinfo-store-card-header">
                    <span className="store-name">{store.name || "매장명"}</span>
                    <button type="button" className="delete-btn" onClick={() => removeStore(store.id)}>
                      <div className="icon-delete" />
                    </button>
                  </div>
                  <div className="ownerinfo-store-field">
                    <label>전화번호</label>
                    <p>{store.phoneNumber}</p> {/* 데이터베이스 스키마에 맞춰 phoneNumber 사용 */}
                  </div>
                  <div className="ownerinfo-store-field">
                    <label>주소</label>
                    {/* addr1, addr2, addr3를 조합하여 전체 주소 표시 */}
                    <p>{`${store.addr1} ${store.addr2} ${store.addr3}`}</p>
                  </div>
                  {/* <div className="ownerinfo-store-field">
                    <label>상세주소</label>
                    <p>{store.detailAddress}</p>
                  </div> */}
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