import { useState } from 'react';
import './EngineerInfoEdit.css';

function EngineerInfoEdit () {
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
    <div className="wrapper-engineer-info-edit">

      <form>

        <label>아이디(닉네임):</label>
        <input />
        <button>수정</button>

        <label>비밀번호:</label>
        <input />
        <button>수정</button>

        <label>이름:</label>
        <input />

        <label>생년월일:</label>
        <input type="text" placeholder="6자리" />

        <label>성별:</label>
        <label htmlFor="gender-male" className={`engineer-info-edit-label ${gender === 'M' ? 'engineer-info-edit-label-selected' : ''}`}>남자</label>
        <input className="engineer-info-edit-radio" name="gender" id="gender-male" type="radio" value="M" onChange={changeGender} />
        <label htmlFor="gender-female" className={`engineer-info-edit-label ${gender === 'F' ? 'engineer-info-edit-label-selected' : ''}`}>여자</label>
        <input className="engineer-info-edit-radio" name="gender" id="gender-female" type="radio" value="F" onChange={changeGender} />

        <label>알림:</label>
        <label htmlFor="notification-on" className={`engineer-info-edit-label-notification ${notification === 'ON' ? 'engineer-info-edit-lobel-notification-selected' : ''}`}>ON</label>
        <input className="engineer-info-edit-radio-notification" name="notification" id="notification-on" type="radio" value="ON" onChange={changeNotificationStatus} />
        <label htmlFor="notification-off" className={`engineer-info-edit-label-notification ${notification === 'OFF' ? 'engineer-info-edit-lobel-notification-selected' : ''}`}>OFF</label>
        <input className="engineer-info-edit-radio-notification" name="notification" id="notification-off" type="radio" value="OFF" onChange={changeNotificationStatus} />
      
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

export default EngineerInfoEdit;