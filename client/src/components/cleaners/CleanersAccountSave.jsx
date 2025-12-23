import { useState } from 'react';
import './CleanersAccountSave.css';

function CleanersAccountSave() {

  const [toggleSave, setToggleSave] = useState(false);
  const [toggleInfo, setToggleInfo] = useState(false);

  const toggleMenuSave = () => {

    setToggleSave(!toggleSave)

  };

  const toggleMenuInfo = () => {

    setToggleInfo(!toggleInfo)

  };

    return (
        <>
        <div className="all-container cleaners-account-save-container">
          <div className="cleaners-account-save-wrapper">
          <div className="cleaners-account-save-account-management-title" 
            onClick={toggleMenuSave}>

              <img
              src={!toggleSave ? "/icons/toggle_down.png" : "/icons/toggle_up.png"}/>
              <p className="cleaners-account-save-new-account-message"> 신규 정산 계좌</p>

          </div>
            <span>김기사 기사님의 정산 계좌</span>

            <form className="cleaners-account-save-form">
          <label htmlFor="accounts">정산 계좌</label>
          <label htmlFor="banks">은행</label>
            <option value="Woori Bank">우리은행</option>
          <label htmlFor="accounts">계좌번호</label>
            <input id="accounts" name="accounts">
            </input>
          <label htmlFor="account-holder">예금주</label>
            <input id="account-holder" name="account-holder">
            </input>
          <label htmlFor="account-nickname">계좌 별명</label>
            <input id="account-nickname" name="account-nickname">
            </input>
          <div className="cleaners-account-save-button">
          <button type="button">수정</button>
          </div>
          </form>

          </div>

          
          <div className="cleaners-account-save-account-info">

            <div className="cleaners-account-save-info-account">
              
              <div className="cleaners-account-save-account-info-title" onClick={toggleMenuInfo}>

                <img className="cleaners-account-save-toggle-img-info" 
                src={!toggleInfo ? "/icons/toggle_down.png" : "/icons/toggle_up.png"}/>
                <p className="cleaners-account-save-account-info-message"> 정산 계좌 정보</p>

              </div>

              <div className={
                  toggleInfo 
                    ? "cleaners-account-save-toggle-updown-info-contents-toggledown" 
                    : "cleaners-account-save-toggle-updown-info-contents"
                }
              >
              <div className="cleaners-account-save-accout-settlement-criteria-guide">

                <span>
                  정산 기준 안내
                </span>
                <p>
                  - 작업 완료 후 영업일 기준 2~3일 이내 입금됩니다.
                </p>
                <p>
                  - 공휴일/주말은 정산일에 포함되지 않습니다.
                </p>

                <span>
                  현재 상태
                </span>
                <p>
                  - 등록된 계좌 존재
                </p>

              </div>

            </div>
            </div>

            </div>

            <div className="cleaners-account-save-account-modal-page">
              <p>저장하시겠습니까?(임시)</p>
            </div>

        </div>
        </>
    )
}

export default CleanersAccountSave;