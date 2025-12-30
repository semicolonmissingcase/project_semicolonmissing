import { useEffect, useState } from "react";
import "./OwnerInfo.css";
import { useNavigate } from "react-router-dom";
import OwnerStoreInfo from "./OwnerStoreInfo";
import ConfirmModal from "../../result/ConfirmModal.jsx" // 모달
import { useDispatch, useSelector } from "react-redux";
import { storeGetThunk } from "../../../store/thunks/storeGetThunk.js";
import { storeCreateThunk } from "../../../store/thunks/storeCreateThunk.js";
import { storeDeleteThunk } from "../../../store/thunks/storeDeleteThunk.js";
import { getMeThunk, updateOwnerInfoThunk } from "../../../store/thunks/authThunk.js"

export default function OwnerInfo() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stores = [], status, error:storeError } = useSelector((state) => state.store);
  const { user, isLoggedIn, isLoading, error:authError } = useSelector((state) => state.auth);
  // 전화번호 상태 (수정 가능하게)
  const [phonePrefix, setPhonePrefix] = useState("010");
  const [phoneMiddle, setPhoneMiddle] = useState("");
  const [phoneLast, setPhoneLast] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false); // 매장 추가 모달
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // 삭제 확인 공통 모달
  const [modalConfig, setModalConfig] = useState(null); // 공통 모달 설정값
  const [pendingDeleteId, setPendingDeleteId] = useState(null); // 삭제 대기 중인 ID 저장

  // 컴포넌트 마운트 시 사용자 정보 및 매장 목록 불러오기
  useEffect(() => {
    if (!user && isLoggedIn === false && isLoading === false) {
      dispatch(getMeThunk());
    }
    if (status === 'idle') {
      dispatch(storeGetThunk());
    }
  }, [dispatch, status, user, isLoggedIn, isLoading]);

  // user 정보가 로드되면 전화번호를 파싱하여 상태에 저장
  useEffect(() => {
    if (user && user.phoneNumber) {
      const parts = user.phoneNumber.split('-');
      if (parts.length === 3) {
        setPhonePrefix(parts[0]);
        setPhoneMiddle(parts[1]);
        setPhoneLast(parts[2]);
      } else {
        const num = user.phoneNumber.replace(/[^0-9]/g, '');
        setPhonePrefix(num.substring(0, 3));
        setPhoneMiddle(num.substring(3, 7));
        setPhoneLast(num.substring(7, 11));
      }
    }
  }, [user]);

  // 전화번호 입력 핸들러
  const handlePhonePartChange = (setter) => (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    setter(numericValue);
  };

  // 수정 완료 버튼
  const handleUpdateProfile = async() => {
    const newPhoneNumber = `${phonePrefix}-${phoneMiddle}-${phoneLast}`;

    // 현재 전화번호와 다를 경우만 수정
    if(user.phoneNumber === newPhoneNumber) {
      return
    }
    
    try {
      await dispatch(updateOwnerInfoThunk({ phone: newPhoneNumber })).unwrap();
      dispatch(getMeThunk()); // 내 정보 다시 불러오기

      window.scrollTo({ top: 0, behavior: 'smooth' });

      // ---------수정 오나료 모달 띄우기------------
      setModalConfig({
        message: "회원 정보가 수정되었습니다.",
        confirmText: "확인",
        onConfirm: () => setIsConfirmModalOpen(false) // '확인' 누르면 모달 닫기
      });
      setIsConfirmModalOpen(true);
    } catch(err) {
      const errorMessage = err.data && err.data[0] ? err.data[0] : (err.msg || "정보 수정 중 오류가 발생했습니다.")
      alert(errorMessage)

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  const handleAddStore = async (newStore) => {
    try {
      await dispatch(storeCreateThunk(newStore)).unwrap();
      dispatch(storeGetThunk());
    } catch (error) {
      console.error('매장 추가 실패:', error);
      alert(error.msg || '매장 추가 중 오류가 발생했습니다.');
    } finally {
      setIsModalOpen(false);
    }
  };

  const openDeleteConfirm = (id) => {
    setPendingDeleteId(id);
    setModalConfig({
      message: "해당 매장을 삭제하시겠습니까?\n삭제 시 영구 삭제됩니다.",
      cancelText: "취소하기",
      confirmText: "삭제하기",
      isDelete: true,
      onConfirm: async () => {
        if (id) {
          try {
            await dispatch(storeDeleteThunk(id)).unwrap();
            dispatch(storeGetThunk());
          } catch (error) {
            console.error("삭제 실패:", error);
            alert(error.msg || '매장 삭제 중 오류가 발생했습니다.');
          }
        }
        setPendingDeleteId(null);
        setIsConfirmModalOpen(false);
      }
    });
    setIsConfirmModalOpen(true);
  };

  function ownerMyPage() {
    navigate('/owners/mypage');
  }

  return (
    <>
      <div className="all-container ownerinfo-container">
        <div className="ownerinfo-profile-container">
          <div 
            className="ownerinfo-profile-img" 
            style={{ backgroundImage: `url('/icons/default-profile.png')` }}
          ></div>
          <h2>{user ? `${user.name} 점주님` : '점주님'}</h2>
          <p>{user ? user.email : 'admin@admin.com'}</p>
        </div>

        <div className="ownerinfo-profile-setting-container">
          <div className="ownerinfo-phone-num-container">
            <label htmlFor="phone-num">전화번호</label>
            <div className="ownerinfo-phone-inputs">
              <select
                value={phonePrefix}
                onChange={(e) => setPhonePrefix(e.target.value)}
              >
                <option value="010">010</option>
                <option value="011">011</option>
                <option value="016">016</option>
                <option value="017">017</option>
                <option value="018">018</option>
                <option value="019">019</option>
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

          <div className="ownerinfo-phone-num-container">
            <p>알림 설정</p>
            <div className="checkbox-apple">
              <input className="yep" id="check-apple" type="checkbox" />
              <label htmlFor="check-apple"></label>
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
              {status === 'loading' && <p>매장 정보를 불러오는 중...</p>}
              {status === 'failed' && <p>매장 정보를 불러오는데 실패했습니다: {storeError?.msg || '알 수 없는 오류'}</p>}
              {status === 'succeeded' && stores.length === 0 && <p>등록된 매장이 없습니다.</p>}
              {status === 'succeeded' && stores.map((store) => (
                <div key={store.id} className="ownerinfo-store-card">
                  <div className="ownerinfo-store-card-header">
                    <span className="store-name">{store.name || "매장명"}</span>
                    <button type="button" className="delete-btn" onClick={() => openDeleteConfirm(store.id)}>
                      <div className="icon-delete" />
                    </button>
                  </div>
                  <div className="ownerinfo-store-field">
                    <label>전화번호</label>
                    <p>{store.phoneNumber}</p>
                  </div>
                  <div className="ownerinfo-store-field">
                    <label>주소</label>
                    <p>{`${store.addr1 || ''} ${store.addr2 || ''} ${store.addr3 || ''}`}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ownerinfo-btn-container">
          <button type="button" className="bg-light btn-medium" onClick={ownerMyPage}>수정 취소</button>
          <button type="button" className="bg-blue btn-medium" onClick={handleUpdateProfile}>수정 완료</button>
        </div>
      </div>

      {isModalOpen && (
        <OwnerStoreInfo
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddStore}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        config={modalConfig}
      />
    </>
  );
}