import { useState } from 'react';
import './CleanerInfoEdit.css';

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
    <div className="wrapper-cleaner-info-edit">

      <form className="cleaner-info-edit-form">

        <label htmlFor="id">아이디(닉네임):</label>
        <input id="id" name="id" />
        <button>수정</button>

        <label htmlFor="password">비밀번호:</label>
        <input id="password" name="password" />
        <button>수정</button>

        <label htmlFor="name">이름:</label>
        <input id="name" name="name"/>

        <label htmlFor="birth">생년월일:</label>
        <input id="birth" name="birth" type="text" placeholder="6자리" />

        <label htmlfor="gender">성별:</label>
        <label htmlFor="gender-male" className={`cleaner-info-edit-label ${gender === 'M' ? 'cleaner-info-edit-label-selected' : ''}`}>남자</label>
        <input className="cleaner-info-edit-radio" name="gender" id="gender-male" type="radio" value="M" onChange={changeGender} />
        <label htmlFor="gender-female" className={`cleaner-info-edit-label ${gender === 'F' ? 'cleaner-info-edit-label-selected' : ''}`}>여자</label>
        <input className="cleaner-info-edit-radio" name="gender" id="gender-female" type="radio" value="F" onChange={changeGender} />

        <label htmlFor="notification">알림:</label>
        <label htmlFor="notification-on" className={`cleaner-info-edit-label-notification ${notification === 'ON' ? 'cleaner-info-edit-lobel-notification-selected' : ''}`}>ON</label>
        <input className="cleaner-info-edit-radio-notification" name="notification" id="notification-on" type="radio" value="ON" onChange={changeNotificationStatus} />
        <label htmlFor="notification-off" className={`cleaner-info-edit-label-notification ${notification === 'OFF' ? 'cleaner-info-edit-lobel-notification-selected' : ''}`}>OFF</label>
        <input className="cleaner-info-edit-radio-notification" name="notification" id="notification-off" type="radio" value="OFF" onChange={changeNotificationStatus} />
      
        <div className="check" onClick={checkStatus}>
          <img src={!check ? "/icons/checkbox.png" : "/icons/checkbox_checked.png"} onClick={changeCheckStatus} /><span>수정하신 내용을 한 번 더 확인하시고 왼쪽 버튼을 눌러주세요.</span>
        </div>

      <button type="button">탈퇴</button>
      <button type="button">취소</button>
      <button type="submit">저장</button>

      </form>

    </div>
    </>

  )
};

export default CleanerInfoEdit;