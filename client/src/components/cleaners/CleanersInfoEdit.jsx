import React, { useState } from 'react';
import "./CleanersInfoEdit.css";

const CleanersInfoEdit = () => {
  // 1. 상태 (State) 정의
  const [formData, setFormData] = useState({
    name: '',
    emailLocal: '',
    emailDomain: '',
    password: '', // 비밀번호 수정 시 사용할 임시 상태로 가정합니다.
    passwordChk: '',
    phonePrefix: '010',
    phoneMiddle: '',
    phoneLast: '',
  });

  // *추가 상태: 생년월일과 알림 상태는 formData와 별도의 상태로 처리되어 있었습니다.
  const [birth, setBirth] = useState('');
  const [notification, setNotification] = useState('ON');
  const [check, setCheck] = useState(false);


  // 2. 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const changeNotificationStatus = (e) => {
      setNotification(e.target.value);
  };
  
  const changeCheckStatus = () => {
      setCheck(!check);
  };

  const checkStatus = () => {
    // 여기에 전체 유효성 검사 로직 등을 추가할 수 있습니다.
  };

  // 3. 최종 데이터 Payload 생성 (예시)
  const payload = {
    ...formData,
    email: `${formData.emailLocal}@${formData.emailDomain}`,
    phone: `${formData.phonePrefix}-${formData.phoneMiddle}-${formData.phoneLast}`,
  };

  // 4. Submit 핸들러 (예시)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!check) {
        alert("수정하신 내용을 확인 후 체크박스를 눌러주세요.");
        return;
    }
    
    console.log("전송할 최종 Payload:", payload);
    // 여기서 axios.put('/api/cleanerinfo', payload) 등을 호출하여 서버에 전송합니다.
  };


  return (
    <div className="all-container cleanerinfoedit-container">
      {/* 폼 전체에 onSubmit을 적용하고, 제출 버튼의 type을 "submit"으로 설정하여 handleSubmit을 호출하도록 변경했습니다. */}
      <form className="cleanerinfoedit-wrapper" onSubmit={handleSubmit}> 
        <h1 className="cleanerinfoedit-title">정보 수정</h1>

        <section className="cleanerinfoedit-form">
          {/* 아이디 (읽기 전용) - 상태와 무관 */}
          <div className="cleanerinfoedit-group">
            <label>아이디:</label>
            <input type="text" value="id_icedoctor_cleaner" readOnly className="cleanerinfoedit-input-disabled" />
          </div>

          {/* 이메일 주소 (formData.emailLocal, formData.emailDomain 사용) */}
          {/* 기존 HTML 요소의 클래스명이 혼재되어 있어, formData에 맞게 구조를 수정했습니다. */}
          <div className="cleanerinfoedit-group">
            <label htmlFor="emailLocal">이메일:</label>
            <div className="cleanerinfoedit-email-container">
                <input 
                    className="cleaners-info-edit-input-border-radius" 
                    id="emailLocal" 
                    name="emailLocal"
                    type="text"
                    value={formData.emailLocal}
                    onChange={handleChange}
                    placeholder="아이디"
                />
                <span className="cleanerinfoedit-email-separator">@</span>
                <input 
                    className="cleaners-info-edit-input-border-radius" 
                    id="emailDomain" 
                    name="emailDomain"
                    type="text"
                    value={formData.emailDomain}
                    onChange={handleChange}
                    placeholder="도메인"
                />
            </div>
          </div>
          

          {/* 비밀번호 수정 (formData.password, formData.passwordChk 사용) */}
          {/* 입력 필드 이름은 `password`와 `passwordChk`를 사용하도록 수정합니다. */}
          <div className="cleanerinfoedit-group">
            <label htmlFor="password">새 비밀번호:</label>
            <div className="cleanerinfoedit-input-with-btn">
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="새 비밀번호 입력"
                className="cleanerinfoedit-input"
              />
              <button type="button" className="cleanerinfoedit-inline-btn">수정</button> {/* 수정 로직은 별도 구현 필요 */}
            </div>
          </div>
          
          <div className="cleanerinfoedit-group">
            <label htmlFor="passwordChk">비밀번호 확인:</label>
            <input 
              type="password" 
              name="passwordChk"
              value={formData.passwordChk}
              onChange={handleChange}
              placeholder="새 비밀번호 확인"
              className="cleanerinfoedit-input"
            />
          </div>

          {/* 이름 (formData.name 사용) */}
          <div className="cleanerinfoedit-group">
            <label htmlFor="name">이름:</label>
            <input 
              type="text" 
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요" 
              className="cleanerinfoedit-input"
            />
          </div>


          {/* 생년월일 (기존 setBirth 상태 사용) */}
          {/* 생년월일은 formData에 없으므로 기존 로직 유지 */}
          <label className="cleanerinfoedit-group" htmlFor="birth">생년월일:</label>
          <input 
            className="cleanerinfoedit-group cleaners-info-edit-input-border-radius cleanerinfoedit-input" 
            id="birth" 
            name="birth" 
            type="text" 
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder="&nbsp;&nbsp;&nbsp;6자리"
            value={birth} // birth 상태와 연결
            onChange={(e) => {
              const onlyNumber = (e.target.value.replace(/\D/g, ""));
              setBirth(onlyNumber);
            }} 
            // onBeforeInput 로직은 유지
            onBeforeInput={(e) => {
              if (!/^\d*$/.test(e.data)) {
                e.preventDefault();
              }
            }}
          />

          {/* 휴대전화 (formData.phonePrefix, formData.phoneMiddle, formData.phoneLast 사용) */}
          <div className="cleanerinfoedit-group">
            <label>휴대전화:</label>
            <div className="cleanerinfoedit-phone-container">
              <select 
                name="phonePrefix" // name 추가
                value={formData.phonePrefix} 
                onChange={handleChange} // handleChange 사용
              >
                <option value="010">010</option>
                <option value="011">011</option>
                <option value="016">016</option>
                <option value="017">017</option>
                <option value="018">018</option>
                <option value="019">019</option>
              </select>
              <span>-</span>
              <input 
                type="text" 
                maxLength="4" 
                name="phoneMiddle" // name 추가
                value={formData.phoneMiddle} // value 연결
                onChange={handleChange} // handleChange 사용
                className="cleanerinfoedit-phone-input" 
              />
              <span>-</span>
              <input 
                type="text" 
                maxLength="4" 
                name="phoneLast" // name 추가
                value={formData.phoneLast} // value 연결
                onChange={handleChange} // handleChange 사용
                className="cleanerinfoedit-phone-input" 
              />
            </div>
          </div>
          
          {/* 알림 (기존 notification 상태 사용) */}
          <label className="cleanerinfoedit-group" htmlFor="notification">알림:</label>
          <span className="cleaners-info-edit-notification">
            <label 
              htmlFor="notification-on" 
              className={`cleaners-info-edit-label-notification ${notification === 'ON' ? 'cleaners-info-edit-lobel-notification-selected' : ''}`}>ON</label>
            <input 
              className="cleaners-info-edit-radio-notification" 
              name="notification" 
              id="notification-on" 
              type="radio" 
              value="ON" 
              checked={notification === 'ON'} // checked 속성 추가
              onChange={changeNotificationStatus} 
            />
            <label 
              htmlFor="notification-off" 
              className={`cleaners-info-edit-label-notification ${notification === 'OFF' ? 'cleaners-info-edit-lobel-notification-selected' : ''}`}>OFF</label>
            <input 
              className="cleaners-info-edit-radio-notification" 
              name="notification" 
              id="notification-off" 
              type="radio" 
              value="OFF" 
              checked={notification === 'OFF'} // checked 속성 추가
              onChange={changeNotificationStatus} 
            />
          </span>

          {/* 하단 안내 및 버튼 */}
          <div className="cleanerinfoedit-footer">
            <div className="cleanerinfoedit-status-msg">
              <p className="cleanerinfoedit-status-title">정산 가능</p>
              <p className="cleanerinfoedit-status-desc">※ 계좌 인증이 완료되어 정산이 가능합니다.</p>
            </div>

            <div className="cleanerinfoedit-confirm-msg" onClick={checkStatus}>
              <div className="cleanerinfoedit-check-icon"  onClick={changeCheckStatus}>{check ? '✓' : ''}</div> 
              <p className="cleanerinfoedit-check-message">수정하신 내용을 한 번 더 확인하시고 왼쪽 버튼을 눌러주세요.</p>
            </div>

            <div className="cleanerinfoedit-action-btns">
              {/* 버튼들은 <form> 밖에 있었던 버튼과 중복되어 제거했습니다. */}
              <button type="button" className="btn-custom-bg-light-gray">수정 취소</button>
              <button type="submit" className="btn-custom-bg-blue ">수정 완료</button> {/* type="submit"으로 변경 */}
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}

export default CleanersInfoEdit;