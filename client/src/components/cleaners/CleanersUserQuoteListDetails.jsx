import { useState } from "react";
import "./CleanersUserQuoteListDetails.css";

function UserQuoteList () {


  const [answers, setAnswers] = useState({
    time: "",
    Q4: "",
    Q5: "",
    Q6: "",
    Q7: "",
    Q8: "",
    Q9: "",
  });
  
  const changeAnswerStatus = (e) => {
    const { name, value } = e.target; // name이 질문 키 역할
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };
   
  const [files, setFiles] = useState([]);

  function handleFileChange(e) {
    const selectedFiles = Array.from(e.target.files).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setFiles(selectedFiles);
  }

  return (
    <>
      <div className="user-quote-list-details-container">
        <h3 className="user-quote-list-details-page-info">안녕하세요, 김기사 기사님! 요청 의뢰서입니다.</h3>
        <span className="user-quote-list-details-wrapper">
          <span className="user-quote-list-details-quote-status">지정</span>
          <span>남일동 유명한 카페</span>
          <span>이점주</span>
          <span>2025년 12월 27일 19시 ~ 20시</span>
        </span>

      <form>
        <span className="user-quote-list-details-reservation-date-time-wrapper">
        <span className="user-quote-list-details-first-card">
        <fieldset className="user-quote-list-details-border-none">
        <legend className="user-quote-list-details-border-none">
        <span className="user-quote-list-details-info">예약 정보*</span>
        <span className="user-quote-list-details-list-reservation-date">
        <label htmlFor="date">예약날짜</label>
        <input type="date" id="date" name="date"></input>
        <button className="btn-small-custom" type="button">날짜 협의가 가능해요.</button>
        </span>
        </legend>
        </fieldset>
        <fieldset className="user-quote-list-details-reservation-time-fieldset user-quote-list-details-border-none">
          <legend className="user-quote-list-details-reservation-time user-quote-list-details-border-none">예약시간</legend>

            <input 
            className="user-quote-list-details-answer-display-none" 
            name="time" 
            id="time9" 
            type="radio" 
            value="9" 
            onChange={changeAnswerStatus} />
            <label 
            htmlFor="time9" 
            className={`user-quote-list-details-answer 
            ${answers.time === "9" ? "user-quote-list-details-answer-selected" : ""}`}>09시 ~ 10시</label>
            <input 
            className="user-quote-list-details-answer-display-none" 
            name="time" 
            id="time11" 
            type="radio" 
            value="11" 
            onChange={changeAnswerStatus} />
            <label 
            htmlFor="time11" 
            className={`user-quote-list-details-answer 
            ${answers.time === "11" ? "user-quote-list-details-answer-selected" : ""}`}>11시 ~ 12시</label>
            <input 
            className="user-quote-list-details-answer-display-none" 
            name="time" 
            id="time12" 
            type="radio" 
            value="12" 
            onChange={changeAnswerStatus} />
            <label 
            htmlFor="time12" 
            className={`user-quote-list-details-answer 
            ${answers.time === "12" ? "user-quote-list-details-answer-selected" : ""}`}>12시 ~ 13시</label>
            <input 
            className="user-quote-list-details-answer-display-none" 
            name="time" 
            id="time13" 
            type="radio" 
            value="13" 
            onChange={changeAnswerStatus} />
            <label 
            htmlFor="time13" 
            className={`user-quote-list-details-answer 
            ${answers.time === "13" ? "user-quote-list-details-answer-selected" : ""}`}>13시 ~ 14시</label>
            <input 
            className="user-quote-list-details-answer-display-none" 
            name="time" 
            id="time14" 
            type="radio" 
            value="14" 
            onChange={changeAnswerStatus} />
            <label 
            htmlFor="time14" 
            className={`user-quote-list-details-answer 
            ${answers.time === "14" ? "user-quote-list-details-answer-selected" : ""}`}>14시 ~ 15시</label>
            <input 
            className="user-quote-list-details-answer-display-none"
            name="time" 
            id="time15" 
            type="radio" 
            value="15" 
            onChange={changeAnswerStatus} />
            <label 
            htmlFor="time15" 
            className={`user-quote-list-details-answer 
            ${answers.time === "15" ? "user-quote-list-details-answer-selected" : ""}`}>15시 ~ 16시</label>
            <input 
            className="user-quote-list-details-answer-display-none" 
            name="time" 
            id="time16" 
            type="radio" 
            value="16" onChange={changeAnswerStatus} />
            <label 
            htmlFor="time16" 
            className={`user-quote-list-details-answer 
            ${answers.time === "16" ? "user-quote-list-details-answer-selected" : ""}`}>16시 ~ 17시</label>
            <input 
            className="user-quote-list-details-answer-display-none" 
            name="time" 
            id="time17" 
            type="radio" 
            value="17" 
            onChange={changeAnswerStatus} />
            <label 
            htmlFor="time17" 
            className={`user-quote-list-details-answer 
            ${answers.time === "17" ? "user-quote-list-details-answer-selected" : ""}`}>17시 ~ 18시</label>
            <input 
            className="user-quote-list-details-answer-display-none" 
            name="time" 
            id="time18" 
            type="radio" 
            value="18" 
            onChange={changeAnswerStatus} />
            <label 
            htmlFor="time18" 
            className={`user-quote-list-details-answer 
            ${answers.time === "18" ? "user-quote-list-details-answer-selected" : ""}`}>18시 ~ 19시</label>
            <input 
            className="user-quote-list-details-answer-display-none" 
            name="time" 
            id="time19" 
            type="radio" 
            value="19" 
            onChange={changeAnswerStatus} />
            <label 
            htmlFor="time19" 
            className={`user-quote-list-details-answer 
            ${answers.time === "19" ? "user-quote-list-details-answer-selected" : ""}`}>19시 ~ 20시</label>

        <label 
        className="user-quote-list-details-attachment-btn" 
        for="file">첨부파일</label>
        <input 
        className="user-quote-list-details-attachment" 
        type="file" 
        id="file" 
        name="file" 
        accept=".jpg,.jpeg,.png,.zip" 
        multiple 
        onChange={handleFileChange} />
        
          <ul className="user-quote-list-details-ul-title">
          {files.map((file, idx) => (
            <li className="user-quote-list-details-li-contents" key={idx}>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {file.name}
              </a>
            </li>
          ))}
        </ul>
        
        <span>※jpg, jpeg, png, zip 파일만 첨부 가능합니다.</span>
        </fieldset>
        </span>
        </span>

        <span className="user-quote-list-details-details-wrapper">
        <fieldset className="user-quote-list-details-border-none">
        <legend className="user-quote-list-details-border-none">
        <span className="user-quote-list-details-details">추가 정보</span>
        <span className="user-quote-list-details-details-option-info">(필수 사항이 아닌 선택 사항입니다. 하지만 입력해주시면 기사님들이 빠른 진단을 해주실 수 있어요!)</span>
      
        
        <label className="user-quote-list-details-answer-binary-layout" 
        htmlFor="Q1">Q1. 하루에 제빙기 가동시간은 얼마나 되나요?</label>
        <input id="Q1" name="Q1" />
        <label className="user-quote-list-details-answer-binary-layout" 
        htmlFor="cleaning-interval">Q2. 제빙기 내부 청소 주기는 어떻게 되나요?</label>
        <input id="Q2" name="Q2" />
        <label className="user-quote-list-details-answer-binary-layout" 
        htmlFor="Q3">Q3. 청소를 할 제빙기는 몇 대 인가요?</label>
        <input id="Q3" name="Q3" />
        <label className="user-quote-list-details-answer-binary-layout" 
        htmlFor="Q4">Q4. 곰팡이 냄새나 악취가 나나요?</label>
          <label 
          htmlFor="Q4-yes" 
          className={`user-quote-list-details-answer-binary 
          ${answers.Q4 === "yes" ? "user-quote-list-details-answer-binary-selected" : ""}`}>
            <input 
            className="user-quote-list-details-radio-input" 
            type="radio" 
            id="Q4-yes" 
            name="Q4" 
            value="yes" 
            onChange={changeAnswerStatus} />
            <span 
            className="user-quote-list-details-radio-ui" 
            aria-hidden="true" />
            <span 
            className="user-quote-list-details-radio-text">네, 악취가 나요.</span>
          </label>
          <label 
          className="user-quote-list-details-answer-binary-layout" 
          htmlFor="Q4-no" 
          className={`user-quote-list-details-answer-binary 
          ${answers.Q4 === "no" ? "user-quote-list-details-answer-binary-selected" : ""}`}>
            <input 
            className="user-quote-list-details-radio-input" 
            type="radio" 
            id="Q4-no" 
            name="Q4" 
            value="no" 
            onChange={changeAnswerStatus} />
            <span 
            className="user-quote-list-details-radio-ui" 
            aria-hidden="true" />
            <span 
            className="user-quote-list-details-radio-text">아니요. 안 나요.</span>
          </label>
          
        <label 
        className="user-quote-list-details-answer-binary-layout" 
        htmlFor="Q4">Q5. 얼음이 탁한가요?</label>
          <label 
          className="user-quote-list-details-answer-binary-layout"
          htmlFor="Q5-yes" 
          className={`user-quote-list-details-answer-binary 
          ${answers.Q5 === "yes" ? "user-quote-list-details-answer-binary-selected" : ""}`}>
            <input 
            className="user-quote-list-details-radio-input" 
            type="radio" 
            id="Q5-yes" 
            name="Q5" 
            value="yes" 
            onChange={changeAnswerStatus} />
            <span 
            className="user-quote-list-details-radio-ui" 
            aria-hidden="true" />
            <span 
            className="user-quote-list-details-radio-text">네, 탁해요.</span>
          </label>
          <label 
          className="user-quote-list-details-answer-binary-layout" 
          htmlFor="Q5-no" 
          className={`user-quote-list-details-answer-binary 
          ${answers.Q5 === "no" ? "user-quote-list-details-answer-binary-selected" : ""}`}>
            <input 
            className="user-quote-list-details-radio-input" 
            type="radio" 
            id="Q5-no" 
            name="Q5" 
            value="no" 
            onChange={changeAnswerStatus} />
            <span 
            className="user-quote-list-details-radio-ui" 
            aria-hidden="true" />
            <span 
            className="user-quote-list-details-radio-text">아니요. 괜찮아요.</span>
          </label>

        <label 
        className="user-quote-list-details-answer-binary-layout" 
        htmlFor="Q6">Q6. 얼음의 맛이 평소와 다른가요?</label>
          <label 
          className="user-quote-list-details-answer-binary-layout" 
          htmlFor="Q6-yes" 
          className={`user-quote-list-details-answer-binary 
          ${answers.Q6 === "yes" ? "user-quote-list-details-answer-binary-selected" : ""}`}>
            <input 
            className="user-quote-list-details-radio-input" 
            type="radio" 
            id="Q6-yes" 
            name="Q6" 
            value="yes" 
            onChange={changeAnswerStatus} />
            <span 
            className="user-quote-list-details-radio-ui" aria-hidden="true" />
            <span 
            className="user-quote-list-details-radio-text">네, 달라요.</span>
          </label>
          <label 
          className="user-quote-list-details-answer-binary-layout" 
          htmlFor="Q6-no" 
          className={`user-quote-list-details-answer-binary 
          ${answers.Q6 === "no" ? "user-quote-list-details-answer-binary-selected" : ""}`}>
            <input 
            className="user-quote-list-details-radio-input" 
            type="radio" 
            id="Q6-no" 
            name="Q6" 
            value="no" 
            onChange={changeAnswerStatus} />
            <span 
            className="user-quote-list-details-radio-ui" 
            aria-hidden="true" />
            <span 
            className="user-quote-list-details-radio-text">아니요. 같아요.</span>
          </label>    
        
        <label 
        className="user-quote-list-details-answer-binary-layout" 
        htmlFor="Q7">Q7. 제빙량이 감소했나요?</label>
          <label 
          className="user-quote-list-details-answer-binary-layout" 
          htmlFor="Q7-yes" 
          className={`user-quote-list-details-answer-binary 
          ${answers.Q7 === "yes" ? "user-quote-list-details-answer-binary-selected" : ""}`}>
            <input 
            className="user-quote-list-details-radio-input" 
            type="radio" 
            id="Q7-yes" 
            name="Q7" 
            value="yes" 
            onChange={changeAnswerStatus} />
            <span 
            className="user-quote-list-details-radio-ui" 
            aria-hidden="true" />
            <span 
            className="user-quote-list-details-radio-text">네, 감소했어요.</span>
          </label>
          <label 
          className="user-quote-list-details-answer-binary-layout" 
          htmlFor="Q7-no" 
          className={`user-quote-list-details-answer-binary 
          ${answers.Q7 === "no" ? "user-quote-list-details-answer-binary-selected" : ""}`}>
            <input 
            className="user-quote-list-details-radio-input" 
            type="radio" 
            id="Q7-no" 
            name="Q7" 
            value="no" 
            onChange={changeAnswerStatus} />
            <span 
            className="user-quote-list-details-radio-ui" 
            aria-hidden="true" />
            <span 
            className="user-quote-list-details-radio-text">아니요. 같아요.</span>
          </label>    

        <label 
        className="user-quote-list-details-answer-binary-layout" 
        htmlFor="Q8">Q8. 기계에서 평소와 다른 소음이 있나요?</label>
          <label 
          className="user-quote-list-details-answer-binary-layout" 
          htmlFor="Q8-yes" 
          className={`user-quote-list-details-answer-binary 
          ${answers.Q8 === "yes" ? "user-quote-list-details-answer-binary-selected" : ""}`}>
            <input 
            className="user-quote-list-details-radio-input" 
            type="radio" 
            id="Q8-yes" 
            name="Q8" 
            value="yes" 
            onChange={changeAnswerStatus} />
            <span 
            className="user-quote-list-details-radio-ui" 
            aria-hidden="true" />
            <span 
            className="user-quote-list-details-radio-text">네, 있어요.</span>
          </label>
          <label 
          className="user-quote-list-details-answer-binary-layout" 
          htmlFor="Q8-no" 
          className={`user-quote-list-details-answer-binary 
          ${answers.Q8 === "no" ? "user-quote-list-details-answer-binary-selected" : ""}`}>
            <input 
            className="user-quote-list-details-radio-input" 
            type="radio" 
            id="Q8-no" 
            name="Q8" 
            value="no" 
            onChange={changeAnswerStatus} />
            <span 
            className="user-quote-list-details-radio-ui" 
            aria-hidden="true" />
            <span 
            className="user-quote-list-details-radio-text">아니요. 없어요.</span>
          </label>    

        <label 
        className="user-quote-list-details-answer-binary-layout" 
        htmlFor="Q9">Q9. 기계 주변은 청결한가요?</label>
          <label 
          className="user-quote-list-details-answer-binary-layout" 
          htmlFor="Q9-yes" 
          className={`user-quote-list-details-answer-binary 
          ${answers.Q9 === "yes" ? "user-quote-list-details-answer-binary-selected" : ""}`}>
            <input 
            className="user-quote-list-details-radio-input" 
            type="radio" 
            id="Q9-yes" 
            name="Q9" 
            value="yes" 
            onChange={changeAnswerStatus} />
            <span 
            className="user-quote-list-details-radio-ui" 
            aria-hidden="true" />
            <span 
            className="user-quote-list-details-radio-text">네, 깨끗해요.</span>
          </label>
          <label 
          className="user-quote-list-details-answer-binary-layout" 
          htmlFor="Q9-no" 
          className={`user-quote-list-details-answer-binary 
          ${answers.Q9 === "no" ? "user-quote-list-details-answer-binary-selected" : ""}`}>
            <input 
            className="user-quote-list-details-radio-input" 
            type="radio" 
            id="Q9-no" 
            name="Q9" 
            value="no" 
            onChange={changeAnswerStatus} />
            <span 
            className="user-quote-list-details-radio-ui" 
            aria-hidden="true" />
            <span 
            className="user-quote-list-details-radio-text">아니요. 더러워요.</span>
          </label>      

        <label 
        className="user-quote-list-details-requests-title" 
        htmlFor="requests">추가 요청 사항</label>
        <input 
        className="user-quote-list-details-requests" 
        type="text" 
        id="requests" 
        name="requests" />
        <button type="submit">요청 수락하기</button>
        <button type="button">점주님에게 문의</button>
        </legend>
        </fieldset>
        </span>

      </form>
    </div>      
    
    </>
  )
}

export default UserQuoteList;