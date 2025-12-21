import { useState } from 'react';
import './CleanersInfoEdit.css';

function CleanerInfoEdit () {

  const [gender, setGender] = useState('');

  function changeGender(e) {
    setGender(e.target.value);
  }

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
    <div className="wrapper-cleaners-info-edit">

      <form className="cleaners-info-edit-form">

        <label htmlFor="id">아이디(닉네임):</label>
        <input className="cleaners-info-edit-input-border-radius" id="id" name="id" />
        <button className="btn-small">수정</button>

        <label htmlFor="password">비밀번호:</label>
        <input className="cleaners-info-edit-input-border-radius" id="password" name="password" />
        <button className="btn-small">수정</button>

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
        placeholder="6자리"
        onBeforeInput={(e) => {
        if (!/^\d*$/.test(e.data)) {
        e.preventDefault();
        }
        }}
        onChange={(e) => 
        {const onlyNumber = (e.target.value.replace(/\D/g, ""));
        setValue(onlyNumber);
        }} />

        <label htmlfor="gender">성별:</label>

        <span className="cleaners-info-edit-gender">
        <label 
        htmlFor="gender-male" 
        className={`cleaners-info-edit-label ${gender === 'M' ? 'cleaners-info-edit-label-selected' : ''}`}>남자</label>
        <input 
        className="cleaners-info-edit-radio"
        name="gender"
        id="gender-male" 
        type="radio" 
        value="M" 
        onChange={changeGender} />
        <label htmlFor="gender-female" 
        className={`cleaners-info-edit-label ${gender === 'F' ? 'cleaners-info-edit-label-selected' : ''}`}>여자</label>
        <input 
        className="cleaners-info-edit-radio"
         ame="gender" 
         id="gender-female" 
         type="radio" 
         value="F" 
         onChange={changeGender} />
        </span>

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

        <div className="check" onClick={checkStatus}>
          <img 
          src={!check ? "/icons/checkbox.png" : "/icons/checkbox_checked.png"} 
          onClick={changeCheckStatus} /><span>수정하신 내용을 한 번 더 확인하시고 왼쪽 버튼을 눌러주세요.</span>
        </div>

      <div className="button-direction-row">
      <button className="btn-small" type="button">탈퇴</button>
      <button className="btn-small" type="button">취소</button>
      <button className="btn-small" type="submit">저장</button>
      </div>
      </form>

    </div>
    </>

  )
};

export default CleanerInfoEdit;