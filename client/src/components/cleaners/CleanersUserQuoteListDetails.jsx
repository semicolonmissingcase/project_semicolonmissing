import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import "./CleanersUserQuoteListDetails.css";
import { CiUser } from "react-icons/ci";
import { MdHomeWork } from "react-icons/md";
import { LuCalendarClock } from "react-icons/lu";
import { RiArrowDropDownFill } from "react-icons/ri";
import { RiArrowDropUpFill } from "react-icons/ri";

// TODO: 테스트 데이터
const dummyQuestions = [
  {
    id: 1,
    code: 'Q01',
    content: '하루에 제빙기 가동시간은 얼마나 되나요?',
    questionChoices: [
      { id: 1, correct: '5시간 미만'},
      { id: 2, correct: '5시간 ~ 10시간'},
      { id: 3, correct: '10시간 이상'},
    ]
  },
  {
    id: 2,
    code: 'Q02',
    content: '제빙기 내부 청소 주기는 어떻게 되나요?',
    questionChoices: [
      { id: 4, correct: '1주일 이하'},
      { id: 5, correct: '2주일 이하'},
      { id: 6, correct: '1달 이상'},
    ]
  },
  {
    id: 3,
    code: 'Q03',
    content: '청소를 할 제빙기는 몇 대 인가요?',
    questionChoices: [
      { id: 7, correct: '1대(임시)'},
      { id: 8, correct: '2대(임시)'},
      { id: 9, correct: '3대 이상(임시)'},
    ]
  },
  {
    id: 4,
    code: 'Q04',
    content: '곰팡이 냄새나 악취가 나나요?',
    questionChoices: [
      { id: 10, correct: '네, 악취가 나요.'},
      { id: 11, correct: '아니요. 안 나요.'},
    ]
  },
  {
    id: 4,
    code: 'Q05',
    content: '얼음이 탁한가요?',
    questionChoices: [
      { id: 10, correct: '네, 탁해요.'},
      { id: 11, correct: '아니요. 괜찮아요.'},
    ]
  },
];


function CleanersUserQuoteListDetails () {
  const [toggleDetails, setToggleDetails] = useState(false);

  const toggleMenuDetails = () => {
    setToggleDetails(!toggleDetails)
  };

  // form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // -------------------------
  // 질문 답변 관련
  // -------------------------
  const [answerStatus, setAnswerStatus] = useState(null);

  const handleAnswerChange = async (e) => {
    const code = e.target.name; // 'Q01', 'Q02', ...
    const questionId = Number(e.target.value); // 1, 2, 3, ...

    setAnswerStatus(prevAnswers => ({
      ...prevAnswers, // 기존 답변들을 복사
      [code]: questionId, // 해당 질문 ID의 답변만 새 값으로 업데이트
    }));
  };

  useEffect(() => {
    function init() {
      const initAnswerStatus = dummyQuestions.reduce((acc, question) => {
        acc[question.code] = null; // null 또는 기본 선택 값으로 초기화
        return acc;
      }, {});
      setAnswerStatus(initAnswerStatus);
    }
    init();
  }, []);

  return (
    <>
      <div className="all-container cleaners-user-quote-list-details-container">
        <p className="cleaners-user-quote-list-details-title">안녕하세요, 김기사 기사님! 요청 의뢰서입니다.</p>

        {/* 기본 정보 */}
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
    
        {/* 첨부파일 미리보기 */}
        <div className="cleaners-user-quote-list-details-items-box-column">
          <span className="cleaners-user-quote-list-details-items-box-title">첨부파일</span>
          <div className="cleaners-user-quote-list-details-items-box-images">
            <div className="cleaners-user-quote-list-details-items-box-image" style={{backgroundImage: `url('../../../public/icons/임시1.jpg')`}}></div>
          </div>
        </div>

        {/* 매장 정보 */}
        <div className="cleaners-user-quote-list-details-items-box-column">
          <span className="cleaners-user-quote-list-details-items-box-title">매장 정보</span>
          <div className="cleaners-user-quote-list-details-grid-1">
            <div className="cleaners-user-quote-list-details-input-box">
              <label htmlFor="placeName">매장명</label>
              <input type="text" className="cleaners-user-quote-list-details-input-layout" id="placeName" value="남일동 유명한 카페" readOnly />
            </div>
            <div className="cleaners-user-quote-list-details-input-box">
              <label htmlFor="call">전화번호</label>
              <input type="text" className="cleaners-user-quote-list-details-input-layout" id="call" value="010-0000-0000" readOnly />
            </div>
          </div>
          <div className="cleaners-user-quote-list-details-input-box">
            <label htmlFor="address1">주소</label>
            <input type="text" className="cleaners-user-quote-list-details-input-layout" id="address1" value="남일동 유명한 카페" readOnly />
          </div>
          <div className="cleaners-user-quote-list-details-input-box">
            <label htmlFor="address2">상세주소</label>
            <input type="text" className="cleaners-user-quote-list-details-input-layout" id="adderss2" value="유명한 카페" readOnly />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 추가 정보 */}
          <div className="cleaners-user-quote-list-details-items-box-column">
            <span className="cleaners-user-quote-list-details-items-box-title cleaners-user-quote-list-details-toggle-question" onClick={toggleMenuDetails}>추가 정보{ toggleDetails ? <RiArrowDropUpFill size={20} /> : <RiArrowDropDownFill size={20} /> }</span>
            {
              (dummyQuestions && answerStatus) && dummyQuestions.map(question => {
                return (
                  <div className="cleaners-user-quote-list-details-items-box-question" key={question.code}>
                    <span className="cleaners-user-quote-list-details-items-box-question-title" htmlFor={question.code}>{`${question.code}. ${question.content}`}</span>
                    <div className="cleaners-user-quote-list-details-items-box-question-answers">
                      {
                        question.questionChoices && question.questionChoices.map(choice => {
                          return (
                            <div className="cleaners-user-quote-list-details-items-box-question-answer" key={`${question.code}-${choice.id}`}>
                              <input type="radio" name={question.code} id={`${question.code}-${choice.id}`} checked={answerStatus[question.code] === choice.id} value={choice.id} onChange={handleAnswerChange} />
                              <label htmlFor={`${question.code}-${choice.id}`}>{choice.correct}</label>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                )
              })
            }
          </div> 

          {/* 기사님 견적서 */}
          <div className="cleaners-user-quote-list-details-items-box-column">
            <div className="cleaners-user-quote-list-details-items-box-title-box">
              <span className="cleaners-user-quote-list-details-items-box-title">기사님 견적서</span>
              <button type="button" className="cleaners-user-quote-list-details-btn">임시 저장 견적서 불러오기</button>
            </div>
            <div className="cleaners-user-quote-list-details-input-box">
              <label htmlFor="estimatedAmount">견적 금액</label>
              <input type="number" className="cleaners-user-quote-list-details-input-layout input-remove-arrows" id="estimatedAmount" />
            </div>
            <div className="cleaners-user-quote-list-details-textarea-box">
              <label htmlFor="description">견적 설명</label>
              <textarea id="description" className="cleaners-user-quote-list-details-textarea"></textarea>
            </div>
          </div>

          <button type="submit" className="btn-medium bg-light">요청 수락하기</button>
        </form>
      </div> 
    </>
  )
}

export default CleanersUserQuoteListDetails;