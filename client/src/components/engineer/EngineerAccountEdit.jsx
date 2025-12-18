import { useState } from "react";
import './EngineerAccountEdit.css';

function EngineerAccountEdit () {

  const [toggleNew, setToggleNew] = useState(false);
  const [toggleInfo, setToggleInfo] = useState(false);

  const toggleMenuNew = () => {

    setToggleNew(!toggleNew)

  };

  const toggleMenuInfo = () => {

    setToggleInfo(!toggleInfo)

  };

  const [addAccounts, setAddAccounts] = useState();

  const addSettlementAccounts = () => {

    setAddAccounts(!addAccounts)

  };


  return (
    <>
    <div className="engineer-account-edit-account-management">

      <div className="engineer-account-edit-new-account">
        
        <div className="engineer-account-edit-account-management-title">
        <img className="engineer-account-edit-toggle-img" src={toggleNew ? "/icons/toggle_down.png" : "/icons/toggle_up.png"} onClick={toggleMenuNew} />
        <p className="engineer-account-edit-new-account-message">신규 정산 계좌</p>
        </div>

      </div>

      <div className={
    toggleNew 
      ? "engineer-account-edit-toggle-updown-contents-toggledown" 
      : "engineer-account-edit-toggle-updown-contents"
  }
>
      <div>
        <p className="engineer-account-edit-account-message">정산에 사용할 계좌를 선택해 주세요.</p>
      </div>

      <div className="engineer-account-edit-active-account">

        <span>정산 계좌</span>
        <form>
          <select>
            <option value="Woori Bank">우리은행</option>
            <option value="iM Bank">iM뱅크</option>
            <option value="Kookmin Bank">국민은행</option>
            <option value="Shinhan Bank">신한은행</option>
            <option value="Hana Bank">하나은행</option>
            <option value="Citibank Korea Inc.">한국시티은행</option>
            <option value="Nonghyup Bank Co., Ltd.">NH농협</option>
            <option value="Suhyup Bank">SH수협</option>
            <option value="Korean Federation of Community Credit Cooperatives">MG새마을금고</option>
          </select>
        <span>계좌번호</span>
          <input>
          </input>
        <span>예금주</span>
          <input>
          </input>
        <span>계좌 별명</span><span className="engineer-account-edit-option">(선택)</span>
          <input>
          </input>
        <button type="button">취소</button>
        <button type="submit">저장</button>
        </form>

      </div>

      <div className="engineer-account-edit-add-settlement-account">
        <img src={!addAccounts ? "/icons/add.png" : "/icons/add_selected.png"} onClick={addSettlementAccounts}/><span className="engineer-account-edit-new-accounts" onClick={addSettlementAccounts} >신규 정산 계좌</span>
      </div>

    </div>
    </div>

    <div className="engineer-account-edit-account-info">

      <div className="engineer-account-edit-info-account">
        
        <div className="engineer-account-edit-account-info-title">

          <img className="engineer-account-edit-toggle-img-info" src={toggleInfo ? "/icons/toggle_down.png" : "/icons/toggle_up.png"} onClick={toggleMenuInfo} />
          <p className="engineer-account-edit-account-info-message">정산 계좌 정보</p>

        </div>

        <div className={
            toggleInfo 
              ? "engineer-account-edit-toggle-updown-info-contents-toggledown" 
              : "engineer-account-edit-toggle-updown-info-contents"
          }
        >
        <div className="engineer-account-edit-accout-settlement-criteria-guide">

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
            정산 계좌 사용 시 규칙
          </span>
          <p>
            - 정산 계좌는 최대 3개까지 등록할 수 있습니다.
          </p>
          <p>
            - 기본 정산 계좌는 미선택 시 자동으로 선택됩니다.
          </p>

          <span>
            현재 상태
          </span>
          <p>
            - 등록된 계좌: 3개
          </p>

        </div>

      </div>
      </div>

      <div className="engineer-account-edit-account-modal-page">
        
      </div>

    </div>
    </>
  )

};

export default EngineerAccountEdit;