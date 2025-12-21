import { useState } from "react";
import "./CleanersUserQuoteList.css";

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

  const surveyQuestions = [
     { id: 'Q4', text: 'Q4. 곰팡이 냄새나 악취가 나나요?', options: ['네, 악취가 나요.', '아니요. 안 나요.'], values:
     ['yes', 'no'] },
     { id: 'Q5', text: 'Q5. 얼음이 탁한가요?', options: ['네, 탁해요.', '아니요. 괜찮아요.'], values: ['yes', 'no'] },
     { id: 'Q6', text: 'Q6. 얼음의 맛이 평소와 다른가요?', options: ['네, 달라요.', '아니요. 같아요.'], values: ['yes', 'no'] },
     { id: 'Q7', text: 'Q7. 제빙량이 감소했나요?', options: ['네, 감소했어요.', '아니요. 같아요.'], values: ['yes', 'no'] },
     { id: 'Q8', text: 'Q8. 기계에서 평소와 다른 소음이 있나요?', options: ['네, 있어요.', '아니요. 없어요.'], values: ['yes', 'no'] },
     { id: 'Q9', text: 'Q9. 기계 주변은 청결한가요?', options: ['네, 깨끗해요.', '아니요. 더러워요.'], values: ['yes', 'no'] },
   ];
   

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
      <div className="user-quote-list-container">
        <h3 className="user-quote-list-page-info">안녕하세요, 김기사 기사님! 요청 의뢰서입니다.</h3>
        <span className="user-quote-list-wrapper">
          <span className="user-quote-list-quote-status">지정</span>
          <span>남일동 유명한 카페</span>
          <span>이점주</span>
          <span>2025년 12월 27일 19시 ~ 20시</span>
        </span>

      <form>
        <span className="user-quote-list-reservation-date-time-wrapper">
        <span className="user-quote-list-first-card">
        <fieldset className="user-quote-list-border-none">
        <legend className="user-quote-list-border-none">
        <span className="user-quote-list-info">예약 정보*</span>
        <span className="user-quote-list-list-reservation-date">
        <label htmlFor="date">예약날짜</label>
        <input type="date" id="date" name="date"></input>
        <button className="btn-small-custom" type="button">날짜 협의가 가능해요.</button>
        </span>
        </legend>
        </fieldset>
        <fieldset className="user-quote-list-reservation-time-fieldset user-quote-list-border-none">
          <legend className="user-quote-list-reservation-time user-quote-list-border-none">예약시간</legend>

            <input className="user-quote-list-answer-display-none" name="time" id="time9" type="radio" value="9" onChange={changeAnswerStatus} />
            <label htmlFor="time9" className={`user-quote-list-answer ${answers.time === "9" ? "user-quote-list-answer-selected" : ""}`}>09시 ~ 10시</label>
            <input className="user-quote-list-answer-display-none" name="time" id="time11" type="radio" value="11" onChange={changeAnswerStatus} />
            <label htmlFor="time11" className={`user-quote-list-answer ${answers.time === "11" ? "user-quote-list-answer-selected" : ""}`}>11시 ~ 12시</label>
            <input className="user-quote-list-answer-display-none" name="time" id="time12" type="radio" value="12" onChange={changeAnswerStatus} />
            <label htmlFor="time12" className={`user-quote-list-answer ${answers.time === "12" ? "user-quote-list-answer-selected" : ""}`}>12시 ~ 13시</label>
            <input className="user-quote-list-answer-display-none" name="time" id="time13" type="radio" value="13" onChange={changeAnswerStatus} />
            <label htmlFor="time13" className={`user-quote-list-answer ${answers.time === "13" ? "user-quote-list-answer-selected" : ""}`}>13시 ~ 14시</label>
            <input className="user-quote-list-answer-display-none" name="time" id="time14" type="radio" value="14" onChange={changeAnswerStatus} />
            <label htmlFor="time14" className={`user-quote-list-answer ${answers.time === "14" ? "user-quote-list-answer-selected" : ""}`}>14시 ~ 15시</label>
            <input className="user-quote-list-answer-display-none" name="time" id="time15" type="radio" value="15" onChange={changeAnswerStatus} />
            <label htmlFor="time15" className={`user-quote-list-answer ${answers.time === "15" ? "user-quote-list-answer-selected" : ""}`}>15시 ~ 16시</label>
            <input className="user-quote-list-answer-display-none" name="time" id="time16" type="radio" value="16" onChange={changeAnswerStatus} />
            <label htmlFor="time16" className={`user-quote-list-answer ${answers.time === "16" ? "user-quote-list-answer-selected" : ""}`}>16시 ~ 17시</label>
            <input className="user-quote-list-answer-display-none" name="time" id="time17" type="radio" value="17" onChange={changeAnswerStatus} />
            <label htmlFor="time17" className={`user-quote-list-answer ${answers.time === "17" ? "user-quote-list-answer-selected" : ""}`}>17시 ~ 18시</label>
            <input className="user-quote-list-answer-display-none" name="time" id="time18" type="radio" value="18" onChange={changeAnswerStatus} />
            <label htmlFor="time18" className={`user-quote-list-answer ${answers.time === "18" ? "user-quote-list-answer-selected" : ""}`}>18시 ~ 19시</label>
            <input className="user-quote-list-answer-display-none" name="time" id="time19" type="radio" value="19" onChange={changeAnswerStatus} />
            <label htmlFor="time19" className={`user-quote-list-answer ${answers.time === "19" ? "user-quote-list-answer-selected" : ""}`}>19시 ~ 20시</label>

        <label className="user-quote-list-attachment-btn" for="file">첨부파일</label>
        <input className="user-quote-list-attachment" type="file" id="file" name="file" accept=".jpg,.jpeg,.png,.zip" multiple onChange={handleFileChange} />
        
          <ul className="user-quote-list-ul-title">
          {files.map((file, idx) => (
            <li className="user-quote-list-li-contents" key={idx}>
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

        <span className="user-quote-list-details-wrapper">
        <fieldset className="user-quote-list-border-none">
        <legend className="user-quote-list-border-none">
        <span className="user-quote-list-details">추가 정보</span>
        <span className="user-quote-list-details-option-info">(필수 사항이 아닌 선택 사항입니다. 하지만 입력해주시면 기사님들이 빠른 진단을 해주실 수 있어요!)</span>
      
        
        <label className="user-quote-list-answer-binary-layout" htmlFor="Q1">Q1. 하루에 제빙기 가동시간은 얼마나 되나요?</label>
        <input id="Q1" name="Q1" />
        <label className="user-quote-list-answer-binary-layout" htmlFor="cleaning-interval">Q2. 제빙기 내부 청소 주기는 어떻게 되나요?</label>
        <input id="Q2" name="Q2" />
        <label className="user-quote-list-answer-binary-layout" htmlFor="Q3">Q3. 청소를 할 제빙기는 몇 대 인가요?</label>
        <input id="Q3" name="Q3" />

         {surveyQuestions.map(q => (
          <fieldset key={q.id}>
            <legend>{q.text}</legend>
            {q.options.map((option, index) => (
              <label className="user-quote-list-answer-binary-layout" key={option}>
                <input
                  className="user-quote-list-radio-input" 
                  type="radio"
                  name={q.id}
                  value={q.values[index]}
                  checked={answers[q.id] === q.values[index]}
                  onChange={changeAnswerStatus}
                  />
                  {option}
                </label>
              ))}
            </fieldset>
          ))}

        <label className="user-quote-list-requests-title" htmlFor="requests">추가 요청 사항</label>
        <input className="user-quote-list-requests" type="text" id="requests" name="requests" />
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