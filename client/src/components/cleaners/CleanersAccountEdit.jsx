import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import './CleanersAccountEdit.css';
import { IoMdAddCircleOutline } from "react-icons/io";
import { RiArrowDropDownFill } from "react-icons/ri";
import { RiArrowDropUpFill } from "react-icons/ri";


function ConfirmModal({ open, message, onClose, onConfirm }) {

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.    removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="cleaners-profile-edit-last-modal-backdrop"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        // 바깥 클릭 닫기(원하면 제거 가능)
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="cleaners-profile-edit-last-modal-box">

        <div className="cleaners-profile-eidt-modal-cancel-submit-text-button">
        <div className="cleaners-profile-edit-modal-text">
          {message}
        </div>

        <div className="cleaners-profile-edit-modal-button-row">
          <button
            className="cleaners-profile-edit-modal-button"
            type="button"
            onClick={onClose}
            style={{background: "var(--color-light-gray", borderRadius: "5px"}}
          >
            취소
          </button>

          <button
            className="cleaners-profile-edit-modal-button"
            type="button"
            onClick={onConfirm}
            autoFocus
            style={{background: "var(--color-light-gray", borderRadius: "5px"}}
          >
            확인
          </button>
        </div>
        </div>

      </div>
    </div>,
    document.body
  );
}

function CleanerAccountEdit () {

  const [toggleNew, setToggleNew] = useState(false);
  const [toggleInfo, setToggleInfo] = useState(false);

  const toggleMenuNew = () => {

    setToggleNew(!toggleNew)

  };

  const toggleMenuInfo = () => {

    setToggleInfo(!toggleInfo)

  };

  const [selectAddAccount, setSelectAddAccount] = useState(false);

  const toggleAddAccount = (e) => {
  e.stopPropagation();           // 바깥 토글로 클릭 전파 방지
  setSelectAddAccount(prev => !prev);
  };

  const [selectRemoveAccount, setSelectRemoveAccount] = useState(false);

  const handleRemoveAccount = (e) => {
  e.stopPropagation();     // 상위 토글 영향 방지
  setSelectRemoveAccount(true);
  setSelectAddAccount(false);
  };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState(null); // "cancel" | "save"

  const openCancelModal = () => {
  setConfirmType("cancel");
  setConfirmOpen(true);
  };

  const openSaveModal = () => {
  setConfirmType("save");
  setConfirmOpen(true);
};

  const closeConfirmModal = () => {
  setConfirmOpen(false);
  setConfirmType(null);
};

  const onConfirm = () => {
  if (confirmType === "cancel") {
    // TODO: 취소 확정 동작 (예: 뒤로가기, 페이지 이동, 상태 초기화 등)
    // navigate(-1) 여기서 처리
    closeConfirmModal();
    return;
  }

  if (confirmType === "save") {
    // TODO: 저장 확정 동작 (API 호출, submit 등)
    // handleSubmit() 여기서 호출
    closeConfirmModal();
    return;
  }

  closeConfirmModal();
  };

  return (

    <>

    <div className="all-container cleaners-account-edit-wrapper">

    <div className="cleaners-account-edit-account-management">
        
        <div className="cleaners-account-edit-add-account-wrapper">
          
        <div className="cleaners-account-edit-account-management-title" 
        onClick={toggleMenuNew}>

          <button
            type="button"
          >
            {toggleNew? (
              <RiArrowDropUpFill size={30} />
            ) : (
              <RiArrowDropDownFill size={30} />
            )}
          </button>
          <p className="cleaners-account-edit-new-account-message">신규 정산 계좌</p>

        </div>

      <div className={
            toggleNew
              ? "cleaners-account-edit-toggle-updown-new-contents-toggledown" 
              : "cleaners-account-edit-toggle-updown-new-contents"
          }
        >

      <div className="cleaners-account-edit-form-edit">

      <div className="cleaners-account-edit-new-account-title-wrapper">

          <div className="cleaners-account-edit-add-button"
            onClick={toggleAddAccount}>
          <div className={
            selectAddAccount
              ? "cleaners-account-edit-toggle-updown-form-contents-toggledown" 
              : "cleaners-account-edit-toggle-updown-form-contents"
          }
          >
          <div className="cleaners-account-edit-add-button-text">
          <IoMdAddCircleOutline size={20} />
          <span className="cleaners-account-edit-new-accounts">신규 정산 계좌 추가</span>
          </div>
          <p className="cleaners-account-edit-account-message">정산에 사용할 계좌를 선택해 주세요.</p>
        </div>
      </div>
      </div>

      {selectAddAccount && (
  <div className="cleaners-account-edit-form-wrapper">
    <form className="cleaners-account-edit-form">

      <span
        className="cleaners-account-edit-remove-layout"
        onClick={handleRemoveAccount}
      >
        <label className="cleaners-account-edit-account-title">
          정산 계좌
        </label>
        <img
          src="/icons/btn-delete.png"
          className="cleaners-account-edit-delete-img"
          onClick={openCancelModal}
          alt="계좌 삭제"
        />
      </span>
      
      <span className="cleaners-account-edit-layout-inputs">
      <label htmlFor="banks">은행</label>
      <select className="cleaners-account-edit-input-layout" id="banks" name="banks">
        <option value="Woori Bank">우리은행</option>
        <option value="iM Bank">iM뱅크</option>
        <option value="Kookmin Bank">국민은행</option>
        <option value="Shinhan Bank">신한은행</option>
        <option value="Hana Bank">하나은행</option>
        <option value="Citibank Korea Inc.">한국시티은행</option>
        <option value="Nonghyup Bank Co., Ltd.">NH농협</option>
        <option value="Suhyup Bank">SH수협</option>
        <option value="Korean Federation of Community Credit Cooperatives">
          MG새마을금고
        </option>
      </select>

      <label htmlFor="accounts">계좌번호</label>
      <input className="cleaners-account-edit-input-layout" id="accounts" name="accounts" 
      value="1002-123-456789" readOnly/>

      <label htmlFor="account-holder">예금주</label>
      <input className="cleaners-account-edit-input-layout" id="account-holder" name="account-holder" 
      value="김기사" readOnly/>
      </span>
      
      <div className="cleaners-account-edit-button">
        <button className="cleaners-account-edit-cancel-button" type="button" onClick={openCancelModal}>취소</button>
        <button className="cleaners-account-edit-submit-button" ttype="submit" onClick={openSaveModal}>저장</button>
      </div>

    </form>
    </div>
  )}  
      </div>
      </div>

    </div>



    </div>


    <div className="cleaners-account-edit-account-info">

      <div className="cleaners-account-edit-info-account">
        
        <div className="cleaners-account-edit-account-info-title" onClick={toggleMenuInfo}>

          <button
            type="button"
          >
            {toggleInfo ? (
              <RiArrowDropUpFill size={30} />
            ) : (
              <RiArrowDropDownFill size={30} />
            )}
          </button>
          <p className="cleaners-account-edit-account-info-message"> 정산 계좌 정보</p>

        </div>

        <div className={
            toggleInfo 
              ? "cleaners-account-edit-toggle-updown-info-contents-toggledown" 
              : "cleaners-account-edit-toggle-updown-info-contents"
          }
        >
        <div className="cleaners-account-edit-accout-settlement-criteria-guide">

          <span>
            정산 기준 안내
          </span>
          
          <p>
            - 매월 11일 기준으로 이전달 30(31)일까지의 정산금이 지급됩니다.
          </p>
          <p>
            - 정산일이 공휴일인 경우 전일에 지급됩니다.
          </p>

        </div>

      </div>
      </div>

      <div className="cleaners-account-edit-account-modal-page">
        <p>저장하시겠습니까?(임시)</p>
      </div>

      </div>

       <ConfirmModal
          open={confirmOpen}
          message={
            confirmType === "cancel" ? (
              <>
                수정 내용이 삭제됩니다.
                <br />
                작성을 취소하시겠습니까?
              </>
            ) : (
              <>
                계좌 정보를 수정하시겠습니까?
              </>
            )
          }
          onClose={closeConfirmModal}
          onConfirm={onConfirm}
        />       

    </div>

    </>
  )

};

export default CleanerAccountEdit;