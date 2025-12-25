import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import { useEffect, useState } from "react";
import "./CleanersUserQuoteListDetails.css";
import { CiUser } from "react-icons/ci";
import { MdHomeWork } from "react-icons/md";
import { LuCalendarClock } from "react-icons/lu";
import { RiArrowDropDownFill } from "react-icons/ri";
import { RiArrowDropUpFill } from "react-icons/ri";

function CleanersUserQuoteListDetails () {


  // const [date, setDate] = useState(null);
  // const [isDateNegotiable, setIsDateNegotiable] = useState(false);

  
  // const formattedDate = date
  // ? date.toISOString().slice(0, 10)
  // : "";

  
  // const payload = {
  // cleaningDate: isDateNegotiable
  //   ? null
  //   : date?.toISOString().slice(0, 10),
  // dateNegotiable: isDateNegotiable,
  // };

  // const today = new Date();
  // today.setHours(0, 0, 0, 0);

  const [attachmentMessage, setAttachmentMessage] = useState("");



  const changeAnswerStatus = (e) => {
    const { name, value } = e.target;   
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };
    
  const [files, setFiles] = useState([]);

  const MAX_ATTACHMENTS = 4;

const handleFileChange = (e) => {
  const mapped = Array.from(e.target.files).map((f) => ({
    file: f,
    name: f.name,
    url: URL.createObjectURL(f),
    isImage: f.type.startsWith("image/"),
  }));

  setFiles((prev) => {
    if (prev.length + mapped.length > MAX_ATTACHMENTS) {
      setAttachmentMessage(`최대 ${MAX_ATTACHMENTS}개의 파일만 첨부할 수 있습니다.`);
      return prev;
    }
    return [...prev, ...mapped];
  });

};


  const [toggleDetails, setToggleDetails] = useState(false);

  const toggleMenuDetails = () => {
    setToggleDetails(!toggleDetails)
  };

  // '날짜 협의가 가능해요.' 버튼 클릭 핸들러 (isDateNegotiable 상태 토글)
  const handleDateNegotiableToggle = () => {
    setIsDateNegotiable(prev => !prev);
    // 날짜 협의 가능 시, 선택된 날짜는 무시하도록 할 수 있습니다. (필요에 따라 로직 추가)
    if (!isDateNegotiable) {
      setDate(null);
    }
  };


  const changeTemporaryAnswerStatus = (e) => {
  const { name, value } = e.target;

  setAnswers((prev) => ({
    ...prev,
    [name]: value,
  }));
  };

  const [answers, setAnswers] = useState({
  Q4: "no",
  Q5: "no",
  Q6: "yes",
  Q7: "yes",
  Q8: "yes",
  Q9: "no",
  });

  useEffect (() => {
  const saved = localStorage.getItem("answers-temp");
  if (saved) setAnswers(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("answers-temp", JSON.stringify(answers));
  }, [answers]);

  return (
    <>
      <div className="all-container cleaners-user-quote-list-details-container">
        <p className="cleaners-user-quote-list-details-title">안녕하세요, 김기사 기사님! 요청 의뢰서입니다.</p>

        <div className="cleaners-user-quote-list-details-items-box cleaners-user-quote-list-details-base-info">
          <span className="cleaners-user-quote-list-details-like-status">지정</span>
          <div className="cleaners-user-quote-list-details-icon-set">
            <MdHomeWork size={20} />
            <div className="cleaners-user-quote-list-details-place">남일동 유명한 카페</div>
          </div>
          <div className="cleaners-user-quote-list-details-icon-set">
            <CiUser size={20} />
            <div className="cleaners-user-quote-list-details-user">이점주</div>
          </div>
          <div className="cleaners-user-quote-list-details-icon-set">
            <LuCalendarClock size={20} />
            <div className="cleaners-user-quote-list-details-date">2025년 12월 27일 19시 ~ 20시</div>
          </div>
        </div>

      {/* <form className="cleaners-user-quote-list-details-form"> */}
    
    
        <div className="cleaners-user-quote-list-details-items-box-column">

            <span className="cleaners-user-quote-list-attachment-title">첨부파일</span>
            <label 
            className="cleaners-user-quote-list-details-attachment-button"
            htmlFor="file">
             첨부파일
            </label>
            <input 
              className="cleaners-user-quote-list-details-attachment" 
              type="file" 
              id="file" 
              name="file" 
              accept=".jpg,.jpeg,.png,.zip"
              multiple 
              onChange={handleFileChange} />
            
          <div className="  ">
            <ul className="cleaners-user-quote-list-details-ul-title">
              {files.map((file, idx) => (
                <li 
                    className="cleaners-user-quote-list-detail-li"
                    key={idx}>
                  {file.isImage ?   ( 
                    <img
                      src={file.url}
                      alt={file.name}
                      style={{ width: 160 }}
                      onClick={() => window.open(file.url, "_blank", "noopener,noreferrer")}
                      className="cleaners-user-quote-list-detail-attachment-img"
                    />
                  )  : (  
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {file.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>

            {attachmentMessage && (
            <p className="cleaners-user-quote-list-details-attachment-message">
              {attachmentMessage}
            </p>)}

          </div>

            <span>※jpg, jpeg, png 파일만 첨부 가능합니다.</span>
      

        </div>


        <div className="cleaners-user-quote-list-details-items-box-column">
          <span className="cleaners-user-quote-list-details-items-box-title">매장 정보</span>
          <div className="cleaners-user-quote-list-details-grid-1">
            <div className="cleaners-user-quote-list-details-input-box">
              <label htmlFor="placeName">매장명</label>
              <input type="text" className="cleaners-user-quote-list-details-input-layout" id="placeName" value="남일동 유명한 카페" readOnly />
            </div>
            <div className="cleaners-user-quote-list-details-input-box">
              <label htmlFor="call" style={{width: 80}}>전화번호</label>
              <input type="text" className="cleaners-user-quote-list-details-input-layout" id="call" value="010-0000-0000" readOnly />
            </div>
          </div>
          <div className="cleaners-user-quote-list-details-input-box">
            <label htmlFor="address1">주소</label>
            <input type="text" className="cleaners-user-quote-list-details-input-layout" id="address1" value="남일동 유명한 카페" readOnly />
          </div>
          <div className="cleaners-user-quote-list-details-input-box">
            <label htmlFor="address2" style={{width: 80}}>상세주소</label>
            <input type="text" className="cleaners-user-quote-list-details-input-layout" id="adderss2" value="유명한 카페" readOnly />
          </div>
        </div>

        <div className="cleaners-user-quote-list-details-items-box-column">

        {/* <fieldset className="cleaners-user-quote-list-details-border-none"> */}


              
              <button
                type="button"
                className="cleaners-user-quote-list-details-toggle-details-wrapper"
                onClick={toggleMenuDetails}
              >
                추가 정보 {toggleDetails ? <RiArrowDropUpFill size={20} /> : <RiArrowDropDownFill size={20} />  }
              </button>

              <span className="cleaners-user-quote-list-details-details-option-info">
                <br /> (필수 사항이 아닌 선택 사항입니다. 하지만 입력해주시면 기사님들이 빠른 진단을 해주실 수 있어요!)
              </span>
  
              {toggleDetails && (
                <div className="cleaners-user-quote-list-details-contents">

                  <div className="cleaners-user-quote-list-details-answers">
                  <div className="cleaners-user-quote-list-details-input-box-details-answer
                      cleaners-user-quote-list-details-answer-layout">
                    
                      <label className="cleaners-user-quote-list-details-answer-binary-layout"
                      htmlFor="Q1">Q1. 하루에 제빙기 가동시간은 얼마나 되나요?</label>

                  
                      <input className="cleaners-user-quote-list-details-input-layout-full-width" id="Q1" name="Q1" value="영업시간 내내" readOnly />
                   
                  </div>

                  <div className="cleaners-user-quote-list-details-input-box-details-answer
                      cleaners-user-quote-list-details-answer-layout">
                    <label className="cleaners-user-quote-list-details-answer-binary-layout" 
                    htmlFor="Q2">Q2. 제빙기 내부 청소 주기는 어떻게 되나요?</label>  
                    <input className="cleaners-user-quote-list-details-input-layout-full-width"  id="Q2" name="Q2" value="2개월 전후" readOnly />
                  </div>

                  <div className="cleaners-user-quote-list-details-input-box-details-answer
                      cleaners-user-quote-list-details-answer-layout">
                    <label className="cleaners-user-quote-list-details-answer-binary-layout" 
                    htmlFor="Q3">Q3. 청소를 할 제빙기는 몇 대 인가요?</label>
                    <input className="cleaners-user-quote-list-details-input-layout-full-width" id="Q3" name="Q3" value="1대" readOnly />
                  </div>

                  </div>

                    <div className="cleaners-user-quote-list-details-answer-binary-column">
                    <label className="cleaners-user-quote-list-details-answer-binary-layout" 
                    htmlFor="Q4">Q4. 곰팡이 냄새나 악취가 나나요?</label>  
                      <label 
                      htmlFor="Q4-yes" 
                      className={`cleaners-user-quote-list-details-answer-binary 
                      ${answers.Q4 === "yes" ? "cleaners-user-quote-list-details-answer-binary-selected" : ""}`}>
                        <input 
                        className="cleaners-user-quote-list-details-radio-input" 
                        type="radio" 
                        id="Q4-yes" 
                        name="Q4" 
                        value="yes" 
                        onChange={changeTemporaryAnswerStatus}
                        checked={answers.Q4 === "yes"} />
                        <span 
                        className="cleaners-user-quote-list-details-radio-ui" 
                        aria-hidden="true" />
                        <span 
                        className="cleaners-user-quote-list-details-radio-text">네, 악취가 나요.</span>
                      </label>
                      <label
                      htmlFor="Q4-no" 
                      className={`cleaners-user-quote-list-details-answer-binary 
                      ${answers.Q4 === "no" ? "cleaners-user-quote-list-details-answer-binary-selected" : ""}`}>
                        <input 
                        className="cleaners-user-quote-list-details-radio-input" 
                        type="radio" 
                        id="Q4-no" 
                        name="Q4" 
                        value="no" 
                        onChange={changeTemporaryAnswerStatus}
                        checked={answers.Q4 === "no"} />
                        <span 
                        className="cleaners-user-quote-list-details-radio-ui" 
                        aria-hidden="true" />
                        <span 
                        className="cleaners-user-quote-list-details-radio-text">아니요. 안 나요.</span>
                      </label>
                    
                    <label 
                    className="cleaners-user-quote-list-details-answer-binary-layout" 
                    htmlFor="Q5">Q5. 얼음이 탁한가요?</label>  
                      <label
                      htmlFor="Q5-yes" 
                      className={`cleaners-user-quote-list-details-answer-binary 
                      ${answers.Q5 === "yes" ? "cleaners-user-quote-list-details-answer-binary-selected" : ""}`}>
                        <input 
                        className="cleaners-user-quote-list-details-radio-input" 
                        type="radio" 
                        id="Q5-yes" 
                        name="Q5" 
                        value="yes" 
                        onChange={changeTemporaryAnswerStatus}
                        checked={answers.Q5 === "yes"} />
                        <span 
                        className="cleaners-user-quote-list-details-radio-ui" 
                        aria-hidden="true" />
                        <span 
                        className="cleaners-user-quote-list-details-radio-text">네, 탁해요.</span>
                      </label>
                      <label
                      htmlFor="Q5-no" 
                      className={`cleaners-user-quote-list-details-answer-binary 
                      ${answers.Q5 === "no" ? "cleaners-user-quote-list-details-answer-binary-selected" : ""}`}>
                        <input 
                        className="cleaners-user-quote-list-details-radio-input" 
                        type="radio" 
                        id="Q5-no" 
                        name="Q5" 
                        value="no" 
                        onChange={changeTemporaryAnswerStatus}
                        checked={answers.Q5 === "no"} />
                        <span 
                        className="cleaners-user-quote-list-details-radio-ui" 
                        aria-hidden="true" />
                        <span 
                        className="cleaners-user-quote-list-details-radio-text">아니요. 괜찮아요.</span>
                      </label>

                    <label
                    htmlFor="Q6">Q6. 얼음의 맛이 평소와 다른가요?</label>
                      <label 
                      htmlFor="Q6-yes" 
                      className={`cleaners-user-quote-list-details-answer-binary 
                      ${answers.Q6 === "yes" ? "cleaners-user-quote-list-details-answer-binary-selected" : ""}`}>
                        <input 
                        className="cleaners-user-quote-list-details-radio-input" 
                        type="radio" 
                        id="Q6-yes" 
                        name="Q6" 
                        value="yes" 
                        onChange={changeTemporaryAnswerStatus}
                        checked={answers.Q6 === "yes"} />
                        <span 
                        className="cleaners-user-quote-list-details-radio-ui" aria-hidden="true" />
                        <span 
                        className="cleaners-user-quote-list-details-radio-text">네, 달라요.</span>
                      </label>
                      <label 
                      htmlFor="Q6-no" 
                      className={`cleaners-user-quote-list-details-answer-binary 
                      ${answers.Q6 === "no" ? "cleaners-user-quote-list-details-answer-binary-selected" : ""}`}>
                        <input 
                        className="cleaners-user-quote-list-details-radio-input" 
                        type="radio" 
                        id="Q6-no" 
                        name="Q6" 
                        value="no" 
                        onChange={changeTemporaryAnswerStatus}
                        checked={answers.Q6 === "no"} />
                        <span 
                        className="cleaners-user-quote-list-details-radio-ui" 
                        aria-hidden="true" />
                        <span 
                        className="cleaners-user-quote-list-details-radio-text">아니요. 같아요.</span>
                      </label>
                    
                    <label
                    htmlFor="Q7">Q7. 제빙량이 감소했나요?</label>
                      <label 
                      htmlFor="Q7-yes" 
                      className={`cleaners-user-quote-list-details-answer-binary 
                      ${answers.Q7 === "yes" ? "cleaners-user-quote-list-details-answer-binary-selected" : ""}`}>
                        <input 
                        className="cleaners-user-quote-list-details-radio-input" 
                        type="radio" 
                        id="Q7-yes" 
                        name="Q7" 
                        value="yes" 
                        onChange={changeTemporaryAnswerStatus}
                        checked={answers.Q7 === "yes"} />
                        <span 
                        className="cleaners-user-quote-list-details-radio-ui" 
                        aria-hidden="true" />
                        <span 
                        className="cleaners-user-quote-list-details-radio-text">네, 감소했어요.</span>
                      </label>
                      <label
                      htmlFor="Q7-no" 
                      className={`cleaners-user-quote-list-details-answer-binary 
                      ${answers.Q7 === "no" ? "cleaners-user-quote-list-details-answer-binary-selected" : ""}`}>
                        <input 
                        className="cleaners-user-quote-list-details-radio-input" 
                        type="radio" 
                        id="Q7-no" 
                        name="Q7" 
                        value="no" 
                        onChange={changeTemporaryAnswerStatus}
                        checked={answers.Q7 === "no"} />
                        <span 
                        className="cleaners-user-quote-list-details-radio-ui" 
                        aria-hidden="true" />
                        <span 
                        className="cleaners-user-quote-list-details-radio-text">아니요. 같아요.</span>
                      </label>

                    <label 
                    className="cleaners-user-quote-list-details-answer-binary-layout" 
                    htmlFor="Q8">Q8. 기계에서 평소와 다른 소음이 있나요?</label>
                      <label
                      htmlFor="Q8-yes" 
                      className={`cleaners-user-quote-list-details-answer-binary 
                      ${answers.Q8 === "yes" ? "cleaners-user-quote-list-details-answer-binary-selected" : ""}`}>
                        <input 
                        className="cleaners-user-quote-list-details-radio-input" 
                        type="radio" 
                        id="Q8-yes" 
                        name="Q8" 
                        value="yes" 
                        onChange={changeTemporaryAnswerStatus}
                        checked={answers.Q8 === "yes"} />
                        <span 
                        className="cleaners-user-quote-list-details-radio-ui" 
                        aria-hidden="true" />
                        <span 
                        className="cleaners-user-quote-list-details-radio-text">네, 있어요.</span>
                      </label>
                      <label
                      htmlFor="Q8-no" 
                      className={`cleaners-user-quote-list-details-answer-binary 
                      ${answers.Q8 === "no" ? "cleaners-user-quote-list-details-answer-binary-selected" : ""}`}>
                        <input 
                        className="cleaners-user-quote-list-details-radio-input" 
                        type="radio" 
                        id="Q8-no" 
                        name="Q8" 
                        value="no" 
                        onChange={changeTemporaryAnswerStatus}
                        checked={answers.Q8 === "no"} />
                        <span 
                        className="cleaners-user-quote-list-details-radio-ui" 
                        aria-hidden="true" />
                        <span 
                        className="cleaners-user-quote-list-details-radio-text">아니요. 없어요.</span>
                      </label>

                    <label 
                    className="cleaners-user-quote-list-details-answer-binary-layout" 
                    htmlFor="Q9">Q9. 기계 주변은 청결한가요?</label>
                      <label
                      htmlFor="Q9-yes" 
                      className={`cleaners-user-quote-list-details-answer-binary 
                      ${answers.Q9 === "yes" ? "cleaners-user-quote-list-details-answer-binary-selected" : ""}`}>
                        <input 
                        className="cleaners-user-quote-list-details-radio-input" 
                        type="radio" 
                        id="Q9-yes" 
                        name="Q9" 
                        value="yes" 
                        onChange={changeTemporaryAnswerStatus}
                        checked={answers.Q9 === "yes"} />
                        <span 
                        className="cleaners-user-quote-list-details-radio-ui" 
                        aria-hidden="true" />
                        <span 
                        className="cleaners-user-quote-list-details-radio-text">네, 깨끗해요.</span>
                      </label>
                      <label
                      htmlFor="Q9-no" 
                      className={`cleaners-user-quote-list-details-answer-binary 
                      ${answers.Q9 === "no" ? "cleaners-user-quote-list-details-answer-binary-selected" : ""}`}>
                        <input 
                        className="cleaners-user-quote-list-details-radio-input" 
                        type="radio" 
                        id="Q9-no" 
                        name="Q9" 
                        value="no" 
                        onChange={changeTemporaryAnswerStatus}
                        checked={answers.Q9 === "no"} />
                        <span 
                        className="cleaners-user-quote-list-details-radio-ui" 
                        aria-hidden="true" />
                        <span 
                        className="cleaners-user-quote-list-details-radio-text">아니요. 더러워요.</span>
                      </label>
                      </div>

                    <div className="cleaners-user-quote-list-details-request">
                      <label 
                      className="cleaners-user-quote-list-details-requests-title" 
                      htmlFor="requests">추가 요청 사항</label>
                      <input 
                      className="cleaners-user-quote-list-details-requests" 
                      type="text" 
                      id="requests" 
                      name="requests" 
                      value="없습니다."
                      readOnly />
                    </div>
                    
                </div>
              )}

            {/* </fieldset>   */}
        

       


        </div>      

              <button className="cleaners-profile-edit-button-small-custom3" type="submit">요청 수락하기</button>
      
       {/* </form> */}
      
      </div>

        


      
    </>
  )
}

export default CleanersUserQuoteListDetails;