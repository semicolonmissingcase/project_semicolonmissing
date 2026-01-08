import { useState, useEffect } from "react";
import { CleanersModalConfirmModal } from "./cleaners-modal/CleanersModalConfirmModal.jsx";
import './CleanersAccountSave.css';
import { IoMdAddCircleOutline } from "react-icons/io";
import { RiArrowDropDownFill, RiArrowDropUpFill } from "react-icons/ri";
import { FaRegTrashCan } from "react-icons/fa6";
import axios from "axios"; // API 통신을 위해 추가

function CleanerAccountSave() {
  const [toggleNew, setToggleNew] = useState(true);
  const [toggleInfo, setToggleInfo] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부
  
  // DB에서 받아온 실제 계좌 데이터를 저장할 상태
  const [accountInfo, setAccountInfo] = useState({
    bank: "",
    accountNumber: "",
    depositor: ""
  });

  // 페이지 로드 시 데이터 불러오기
  useEffect(() => {
    // 실제로는 axios.get('/api/adjustment/primary')...
    // 여기서는 더미 시더 데이터와 연결된 것으로 가정합니다.
    const dummyFromDB = {
      bank: "우리은행",
      accountNumber: "1002-123-456789",
      depositor: "최기사"
    };
    setAccountInfo(dummyFromDB);
  }, []);

  const toggleMenuNew = () => setToggleNew(!toggleNew);
  const toggleMenuInfo = () => setToggleInfo(!toggleInfo);

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccountInfo(prev => ({ ...prev, [name]: value }));
  };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState(null);

  const openCancelModal = () => { setConfirmType("cancel"); setConfirmOpen(true); };
  const openSaveModal = (e) => { 
    e.preventDefault();
    setConfirmType("save"); 
    setConfirmOpen(true); 
  };

  const onConfirm = async () => {
    if (confirmType === "save") {
      // TODO: axios.post('/api/adjustment/update', accountInfo) API 호출
      console.log("DB 저장 완료:", accountInfo);
      setIsEditing(false); // 저장 후 조회 모드로 전환
    } else {
      // 취소 시 로직 (초기화 등)
      setIsEditing(false);
    }
    setConfirmOpen(false);
  };

  return (
    <div className="all-container cleaners-account-edit-wrapper">
      <div className="cleaners-account-edit-account-management">
        <div className="cleaners-account-edit-add-account-wrapper">
          <div className="cleaners-account-edit-account-management-title" onClick={toggleMenuNew}>
            <button type="button">
              {!toggleNew ? <RiArrowDropUpFill size={30} /> : <RiArrowDropDownFill size={30} />}
            </button>
            <p className="cleaners-account-edit-new-account-message">정산 계좌 설정</p>
          </div>

          <div className={toggleNew ? "cleaners-account-edit-toggle-updown-new-contents-closed" : "cleaners-account-edit-toggle-updown-new-contents"}>
            <div className="cleaners-account-edit-form-edit">
              
              {/* 1. 계좌가 없거나 수정 모드가 아닐 때 보여주는 UI */}
              {!isEditing ? (
                <div className="cleaners-account-edit-new-account-title-wrapper" onClick={() => setIsEditing(true)}>
                  <div className="cleaners-account-edit-add-button">
                    <div className="cleaners-account-edit-add-button-text">
                      <IoMdAddCircleOutline size={20} />
                      <span className="cleaners-account-edit-new-accounts">
                        {accountInfo.accountNumber ? "계좌 정보 수정하기" : "신규 정산 계좌 추가"}
                      </span>
                    </div>
                    {accountInfo.accountNumber ? (
                      <p className="cleaners-account-edit-account-message">
                        현재 등록된 계좌: <strong>{accountInfo.bank} {accountInfo.accountNumber}</strong>
                      </p>
                    ) : (
                      <p className="cleaners-account-edit-account-message">정산에 사용할 계좌를 등록해 주세요.</p>
                    )}
                  </div>
                </div>
              ) : (
                /* 2. 수정 모드(입력 폼) UI */
                <div className="cleaners-account-edit-form-wrapper">
                  <form className="cleaners-account-edit-form" onSubmit={openSaveModal}>
                    <span className="cleaners-account-edit-remove-layout">
                      <label className="cleaners-account-edit-account-title">정산 계좌 정보 입력</label>
                      <button type="reset" onClick={openCancelModal}>
                      <FaRegTrashCan size={20}/>
                      </button>
                    </span>

                    <span className="cleaners-account-edit-layout-inputs">
                      <label>은행</label>
                      <select 
                        className="cleaners-account-edit-input-layout" 
                        name="bank" 
                        value={accountInfo.bank} 
                        onChange={handleInputChange}
                      >
                        <option value="우리은행">우리은행</option>
                        <option value="국민은행">국민은행</option>
                        <option value="신한은행">신한은행</option>
                        <option value="NH농협">NH농협</option>
                      </select>

                      <label>계좌번호</label>
                      <input 
                        className="cleaners-account-edit-input-layout" 
                        name="accountNumber" 
                        placeholder="'-' 없이 입력"
                        value={accountInfo.accountNumber} 
                        onChange={handleInputChange}
                      />

                      <label>예금주</label>
                      <input 
                        className="cleaners-account-edit-input-layout" 
                        name="depositor" 
                        value={accountInfo.depositor} 
                        onChange={handleInputChange}
                      />
                    </span>

                    <div className="cleaners-account-edit-button">
                      <button className="cleaners-account-edit-cancel-button" type="button" onClick={() => setIsEditing(false)}>취소</button>
                      <button className="cleaners-account-edit-submit-button" type="submit">저장</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 안내 섹션 및 모달은 기존과 동일 */}
      <div className="cleaners-account-edit-account-info">
        <div className="cleaners-account-edit-info-account">
          <div className="cleaners-account-edit-account-info-title" onClick={toggleMenuInfo}>
            <button type="button">
              {toggleInfo ? <RiArrowDropUpFill size={30} /> : <RiArrowDropDownFill size={30} />}
            </button>
            <p className="cleaners-account-edit-account-info-message">정산 기준 안내</p>
          </div>
          {toggleInfo && (
            <div className="cleaners-account-edit-account-settlement-criteria-guide">
              <p>- 매주 월요일에 전주 작업분이 정산됩니다.</p>
              <p>- 정산일이 공휴일인 경우 전일에 지급됩니다.</p>
            </div>
          )}
        </div>
      </div>

      <CleanersModalConfirmModal
        open={confirmOpen}
        message={confirmType === "cancel" ? "수정 내용을 취소하시겠습니까?" : "계좌 정보를 저장하시겠습니까?"}
        onClose={() => setConfirmOpen(false)}
        onConfirm={onConfirm}
      />
    </div>
  );
}

export default CleanerAccountSave;