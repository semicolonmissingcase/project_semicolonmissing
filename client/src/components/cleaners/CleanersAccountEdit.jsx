import { useState } from "react";
import './CleanersAccountEdit.css';

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


  return (

    <>

    <div className="cleaners-account-edit-wrapper">

    <div className="cleaners-account-edit-account-management">
        
        <div className="cleaners-account-edit-add-account-wrapper">
          
        <div className="cleaners-account-edit-account-management-title" 
        onClick={toggleMenuNew}>

          <img
          src={!toggleNew ? "/icons/toggle_down.png" : "/icons/toggle_up.png"}/>
          <p className="cleaners-account-edit-new-account-message"> 신규 정산 계좌</p>

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
          <img className="cleaners-account-edit-add-button-img" 
          src="/icons/add.png"
          />
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
      <input className="cleaners-account-edit-input-layout" id="accounts" name="accounts" />

      <label htmlFor="account-holder">예금주</label>
      <input className="cleaners-account-edit-input-layout" id="account-holder" name="account-holder" />
      </span>
      
      <div className="cleaners-account-edit-button">
        <button type="button">취소</button>
        <button type="submit">저장</button>
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

          <img className="cleaners-account-edit-toggle-img-info" 
          src={!toggleInfo ? "/icons/toggle_down.png" : "/icons/toggle_up.png"}/>
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
            - 월 11일 기준으로 이전달 30(31)일까지의 정산금이 정산됩니다.
          </p>
          <p>
            - 정산일이 공휴일인 경우 전일에 정산됩니다.
          </p>

        </div>

      </div>
      </div>

      <div className="cleaners-account-edit-account-modal-page">
        <p>저장하시겠습니까?(임시)</p>
      </div>

      </div>

    </div>

    </>
  )

};

export default CleanerAccountEdit;