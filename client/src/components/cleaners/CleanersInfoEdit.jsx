
import { useState } from "react";
import { CleanersModalConfirmModal } from './cleaners-modal/CleanersModalConfirmModal';
import './CleanersInfoEdit.css';

function CleanersInfoEdit () {

  const [birth, setBirth] = useState("");

  const [notification, setNotification] = useState('');
  
  function changeNotificationStatus(e) {
    setNotification(e.target.value);
  }

  const [check, setCheck] = useState('');

  function changeCheckStatus(e) {
    setCheck(e.target.value);
  }

  const checkStatus = () => {

    setCheck(!check)

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
    <div className="all-container">
      <div className="cleanerinfoedit-wrapper">
        <h1 className="cleanerinfoedit-title">정보 수정</h1>

        <form className="cleanerinfoedit-form">
          {/* 아이디 (읽기 전용) */}
          <div className="cleanerinfoedit-group">
            <label>아이디:</label>
            <input type="text" value="id_icedoctor_cleaner" readOnly className="cleanerinfoedit-input-disabled" />
          </div>


       
        <label htmlFor="id">이메일:</label>
        <span className="cleaners-info-edit-id">
        <input className="cleaners-info-edit-input-border-radius" id="id" name="id" />
        </span>

        
        <label htmlFor="password">비밀번호:</label>
        <span className="cleaners-info-edit-ps">
        <input className="cleaners-info-edit-input-border-radius" id="password" name="password" />
        <button className="cleaners-info-edit-btn-small-custom2">수정</button>
        </span>

          {/* 비밀번호 수정 */}
          <div className="cleanerinfoedit-group">
            <label>비밀번호:</label>
            <div className="cleanerinfoedit-input-with-btn">
              <input type="password" placeholder="새 비밀번호 입력" />
              <button type="button" className="cleanerinfoedit-inline-btn">수정</button>
            </div>
          </div>

          {/* 이메일 주소 (단순 출력 및 연동 표시) */}
          <div className="cleanerinfoedit-group">
            <label>이메일 주소:</label>
            <div className="cleanerinfoedit-email-display">
              <div className="cleanerinfoedit-email-row">
                <span>ice_cleaner@kakao.com</span>
              </div>
            </div>
          </div>


          {/* 이름 */}
          <div className="cleanerinfoedit-group">
            <label>이름:</label>
            <input type="text" placeholder="이름을 입력하세요" />
          </div>


        <label htmlFor="birth">생년월일:</label>
        <input className="cleaners-info-edit-input-border-radius" 
        id="birth" 
        name="birth" 
        type="text" 
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={6}
        placeholder="&nbsp;&nbsp;&nbsp;6자리"
        onBeforeInput={(e) => {
        if (!/^\d*$/.test(e.data)) {
        e.preventDefault();
        }
        }}
        onChange={(e) => 
        {const onlyNumber = (e.target.value.replace(/\D/g, ""));
        setBirth(onlyNumber);
        }} />

        <label htmlFor="notification">알림:</label>

        <span className="cleaners-info-edit-notification">
        <label 
        htmlFor="notification-on" 
        className={`cleaners-info-edit-label-notification
         ${notification === 'ON' ? 'cleaners-info-edit-lobel-notification-selected' : ''}`}>ON</label>
        <input 
        className="cleaners-info-edit-radio-notification" 
        name="notification" 
        id="notification-on" 
        type="radio" 
        value="ON" 
        onChange={changeNotificationStatus} />
        <label 
        htmlFor="notification-off" 
        className={`cleaners-info-edit-label-notification 
        ${notification === 'OFF' ? 'cleaners-info-edit-lobel-notification-selected' : ''}`}>OFF</label>
        <input 
        className="cleaners-info-edit-radio-notification" 
        name="notification" 
        id="notification-off" 
        type="radio" 
        value="OFF" 
        onChange={changeNotificationStatus} />
        </span>

        <div className="cleaners-info-edit-check" onClick={checkStatus}>
          <img 
          src={!check ? "/icons/checkbox.png" : "/icons/checkbox_checked.png"} 
          onClick={changeCheckStatus} /><span>수정하신 내용을 한 번 더 확인하시고 왼쪽 버튼을 눌러주세요.</span>
        </div>

      <div className="cleaners-info-edit-button-direction-row">
      <button className=" cleaners-info-edit-btn-small-custom2" type="button">탈퇴</button>
      <button className=" cleaners-info-edit-btn-small-custom2" type="button" onClick={openCancelModal}>취소</button>
      <button className=" cleaners-info-edit-btn-small-custom2" type="submit" onClick={openSaveModal}>저장</button>
      </div>
          {/* 휴대전화 (선택-4자리-4자리) */}
          <div className="cleanerinfoedit-group">
            <label>휴대전화:</label>
            <div className="cleanerinfoedit-phone-container">
              <select>
                <option value="010">010</option>
                <option value="011">011</option>
                <option value="016">016</option>
                <option value="017">017</option>
                <option value="018">018</option>
                <option value="019">019</option>
              </select>
              <span>-</span>
              <input type="text" maxLength="4" className="cleanerinfoedit-phone-input" />
              <span>-</span>
              <input type="text" maxLength="4" className="cleanerinfoedit-phone-input" />
            </div>
          </div>

          {/* 하단 안내 및 버튼 */}
          <div className="cleanerinfoedit-footer">
            <div className="cleanerinfoedit-status-msg">
              <p className="cleanerinfoedit-status-title">정산 가능</p>
              <p className="cleanerinfoedit-status-desc">※ 계좌 인증이 완료되어 정산이 가능합니다.</p>
            </div>

            <div className="cleanerinfoedit-confirm-msg">
              <div className="cleanerinfoedit-check-icon">✓</div> {/* 리액트아이콘 있나 찾아보죠 */}
              <p>수정하신 내용을 한 번 더 확인하시고<br />왼쪽 버튼을 눌러주세요.</p>
            </div>

            <div className="cleanerinfoedit-action-btns">
              <button type="button" onClick={openCancelModal}>수정 취소</button>
        <button type="submit" onClick={openSaveModal}>수정 완료</button>
            </div>
          </div>
        </form>

          
      </div>

       <CleanersModalConfirmModal
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
  );
}

export default CleanersInfoEdit;