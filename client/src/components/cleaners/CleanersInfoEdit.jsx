import { useState } from 'react';
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



  return (
    <>
    <div className="all-container cleaners-info-edit-all-layout-center">
    <div className="cleaners-info-edit-wrapper-cleaners-info-edit"> 
      <span className="cleaners-info-edit-layout-center">
        <p className="cleaners-info-edit-title">정보 수정</p>

        <form className="cleaners-info-edit-form">

       
        <label htmlFor="id">이메일:</label>
        <span className="cleaners-info-edit-id">
        <input className="cleaners-info-edit-input-border-radius" id="id" name="id" />
        </span>

        
        <label htmlFor="password">비밀번호:</label>
        <span className="cleaners-info-edit-ps">
        <input className="cleaners-info-edit-input-border-radius" id="password" name="password" />
        <button className="cleaners-info-edit-btn-small-custom2">수정</button>
        </span>

        <label htmlFor="name">이름:</label>
        <input className="cleaners-info-edit-input-border-radius" id="name" name="name"/>

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
      <button className=" cleaners-info-edit-btn-small-custom2" type="button">취소</button>
      <button className=" cleaners-info-edit-btn-small-custom2" type="submit">저장</button>
      </div>
      </form>
      </span>
    </div>
    </div>
    </>

  )
};

export default CleanersInfoEdit;