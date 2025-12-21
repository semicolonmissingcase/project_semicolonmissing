import { useState } from 'react';
import './CleanersUserQuoteList.css';

function UserQuoteList () {


  const [answer, setAnswer] = useState('');
  
  function changeAnswerStatus(e) {
    setAnswer(e.target.value);
  }


  return (
    <>
      <div className="user-quote-list-container">
        <h3>안녕하세요, 김기사 기사님! 요청 의뢰서입니다.</h3>
        <div className="user-quote-list-wrapper">
          <span className="user-quote-list-quote-status">지정</span>
          <span>남일동 유명한 카페</span>
          <span>이점주</span>
          <span>2025년 12월 27일 19시 ~ 20시</span>
        </div>

        <form>
        <span className="user-quote-list-reservation-date-time-wrapper">
        <fieldset className="user-quote-list-reservation-date-fieldset">
        <legend>
        <span>예약 정보*</span>
        <label htmlFor="date">예약날짜</label>
        <input type="date" id="date" name="date"></input>
        <button type="button">날짜 협의가 가능해요.</button>
        </legend>
        </fieldset>
        <fieldset className="user-quote-list-reservation-time-fieldset">
        <legend className="user-quote-list-reservation-time">예약시간</legend>
            <input className="user-quote-list-answer-display-none" name="time9" id="time9" type="radio" value="9" onChange={changeAnswerStatus} />
            <label htmlFor="time9" className={`user-quote-list-answer ${answer == '9' ? 'user-quote-list-answer-selected' : ''}`}>09시 ~ 10시</label>
            <input className="user-quote-list-answer-display-none" name="time11" id="time11" type="radio" value="11" onChange={changeAnswerStatus} />
            <label htmlFor="time11" className={`user-quote-list-answer ${answer == '11' ? 'user-quote-list-answer-selected' : ''}`}>11시 ~ 12시</label>
            <input className="user-quote-list-answer-display-none" name="time12" id="time12" type="radio" value="12" onChange={changeAnswerStatus} />
            <input className="user-quote-list-answer-display-none" name="time13" id="time13" type="radio" value="13" onChange={changeAnswerStatus} />
            <label htmlFor="time13" className={`user-quote-list-answer ${answer == '13' ? 'user-quote-list-answer-selected' : ''}`}>13시 ~ 14시</label>
            <input className="user-quote-list-answer-display-none" name="time14" id="time14" type="radio" value="14" onChange={changeAnswerStatus} />
            <label htmlFor="time14" className={`user-quote-list-answer ${answer == '14' ? 'user-quote-list-answer-selected' : ''}`}>14시 ~ 15시</label>
            <input className="user-quote-list-answer-display-none" name="time15" id="time15" type="radio" value="15" onChange={changeAnswerStatus} />
            <label htmlFor="time15" className={`user-quote-list-answer ${answer == '15' ? 'user-quote-list-answer-selected' : ''}`}>15시 ~ 16시</label>
            <input className="user-quote-list-answer-display-none" name="time16" id="time16" type="radio" value="16" onChange={changeAnswerStatus} />
            <label htmlFor="time16" className={`user-quote-list-answer ${answer == '16' ? 'user-quote-list-answer-selected' : ''}`}>16시 ~ 17시</label>
            <input className="user-quote-list-answer-display-none" name="time17" id="time17" type="radio" value="17" onChange={changeAnswerStatus} />
            <label htmlFor="time17" className={`user-quote-list-answer ${answer == '17' ? 'user-quote-list-answer-selected' : ''}`}>17시 ~ 18시</label>
            <input className="user-quote-list-answer-display-none" name="time18" id="time18" type="radio" value="18" onChange={changeAnswerStatus} />
            <label htmlFor="time18" className={`user-quote-list-answer ${answer == '18' ? 'user-quote-list-answer-selected' : ''}`}>18시 ~ 19시</label>
            <input className="user-quote-list-answer-display-none" name="time19" id="time19" type="radio" value="19" onChange={changeAnswerStatus} />
            <label htmlFor="time19" className={`user-quote-list-answer ${answer == '19' ? 'user-quote-list-answer-selected' : ''}`}>19시 ~ 20시</label>

        <button type="button">첨부파일</button>
        <span>※jpeg, jpg, png, zip 파일만 첨부 가능합니다.</span>
        </fieldset>
        </span>

        <fieldset>
        <legend>
        <h4>추가 정보</h4>
        <span>(필수 사항이 아닌 선택 사항입니다. 하지만 입력해주시면 기사님들이 빠른 진단을 해주실 수 있어요!)</span>
      
        
        <label htmlFor="Q1">Q1. 하루에 제빙기 가동시간은 얼마나 되나요?</label>
        <input id="Q1" name="Q1" />
        <label htmlFor="cleaning-interval">Q2. 제빙기 내부 청소 주기는 어떻게 되나요?</label>
        <input id="Q2" name="Q2" />
        <label htmlFor="Q3">Q3. 청소를 할 제빙기는 몇 대 인가요?</label>
        <input id="Q3" name="Q3" />
        <label htmlFor="Q4">Q4. 곰팡이 냄새나 악취가 나나요?</label>
          <label htmlFor="Q4" className={`user-quote-list-answer-binary ${answer === 'yes' ? 'user-quote-list-answer-binary-selected' : ''}`}>
            <input className="user-quote-list-radio-input" type="radio" id="Q4" name="Q4" value="yes" onChange={changeAnswerStatus} />
            <span className="user-quote-list-radio-ui" aria-hidden="true" />
            <span className="user-quote-list-radio-text">네, 악취가 나요.</span>
          </label>
          <label htmlFor="Q4" className={`user-quote-list-answer-binary ${answer === 'no' ? 'user-quote-list-answer-binary-selected' : ''}`}>
            <input className="user-quote-list-radio-input" type="radio" id="Q4" name="Q4" value="no" onChange={changeAnswerStatus} />
            <span className="user-quote-list-radio-ui" aria-hidden="true" />
            <span className="user-quote-list-radio-text">아니요. 안 나요.</span>
          </label>
          
          
        <label htmlFor="cleaning-interval">Q5. 얼음이 탁한가요?</label>
          <label htmlFor="notification-on" className={`user-quote-list-answer-binary ${answer === 'ON' ? 'user-quote-list-answer-binary--selected' : ''}`}>네, 탁해요.</label>
          <input className="user-quote-list-answer-display-none" name="notification" id="notification-on" type="radio" value="ON" onChange={changeAnswerStatus} />
          <label htmlFor="notification-off" className={`user-quote-list-answer-binary ${answer === 'OFF' ? 'user-quote-list-answer-binary-selected' : ''}`}>아니요. 괜찮아요.</label>
          <input className="user-quote-list-answer-display-none" name="notification" id="notification-off" type="radio" value="OFF" onChange={changeAnswerStatus} />
        <label htmlFor="cleaning-interval">Q6. 얼음의 맛이 평소와 다른가요?</label>
          <label htmlFor="notification-on" className={`user-quote-list-answer-binary ${answer === 'ON' ? 'user-quote-list-answer-binary--selected' : ''}`}>네, 달라요</label>
          <input className="user-quote-list-answer-display-none" name="notification" id="notification-on" type="radio" value="ON" onChange={changeAnswerStatus} />
          <label htmlFor="notification-off" className={`user-quote-list-answer-binary ${answer === 'OFF' ? 'user-quote-list-answer-binary--selected' : ''}`}>아니요. 같아요.</label>
          <input className="user-quote-list-answer-display-none" name="notification" id="notification-off" type="radio" value="OFF" onChange={changeAnswerStatus} />
        <label htmlFor="cleaning-interval">Q7. 제빙량이 감소했나요?</label>
                        <label htmlFor="notification-on" className={`user-quote-list-answer-binary ${answer === 'ON' ? 'user-quote-list-answer-binary--selected' : ''}`}>네, 감소했어요.</label>
          <input className="user-quote-list-answer-display-none" name="notification" id="notification-on" type="radio" value="ON" onChange={changeAnswerStatus} />
          <label htmlFor="notification-off" className={`user-quote-list-answer-binary ${answer === 'OFF' ? 'user-quote-list-answer-binary--selected' : ''}`}>아니요. 같아요.</label>
          <input className="user-quote-list-answer-display-none" name="notification" id="notification-off" type="radio" value="OFF" onChange={changeAnswerStatus} />
        <label htmlFor="cleaning-interval">Q8. 기계에서 평소와 다른 소음이 있나요?</label>
                        <label htmlFor="notification-on" className={`user-quote-list-answer-binary ${answer === 'ON' ? 'user-quote-list-answer-binary--selected' : ''}`}>네, 있어요.</label>
          <input className="user-quote-list-answer-display-none" name="notification" id="notification-on" type="radio" value="ON" onChange={changeAnswerStatus} />
          <label htmlFor="notification-off" className={`user-quote-list-answer-binary ${answer === 'OFF' ? 'user-quote-list-answer-binary--selected' : ''}`}>아니요. 없어요.</label>
          <input className="user-quote-list-answer-display-none" name="notification" id="notification-off" type="radio" value="OFF" onChange={changeAnswerStatus} />
        <label htmlFor="cleaning-interval">Q9. 기계 주변은 청결한가요?</label>
                        <label htmlFor="notification-on" className={`user-quote-list-answer-binary ${answer === 'ON' ? 'user-quote-list-answer-binary--selected' : ''}`}>네, 깨끗해요.</label>
          <input className="user-quote-list-answer-display-none" name="notification" id="notification-on" type="radio" value="ON" onChange={changeAnswerStatus} />
          <label htmlFor="notification-off" className={`user-quote-list-answer-binary ${answer === 'OFF' ? 'user-quote-list-answer-binary--selected' : ''}`}>아니요. 더러워요.</label>
          <input className="user-quote-list-answer-display-none" name="notification" id="notification-off" type="radio" value="OFF" onChange={changeAnswerStatus} />
        <label htmlFor="requests">추가 요청 사항</label>
        <input type="text" id="requests" name="requests" />
        <button type="submit">요청 수락하기</button>
        <button type="button">점주님에게 문의</button>
        </legend>
        </fieldset>
      
        </form>
            
      </div>
    
    </>
  )
}

export default UserQuoteList;