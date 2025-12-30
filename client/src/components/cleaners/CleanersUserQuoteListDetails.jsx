import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import "./CleanersUserQuoteListDetails.css";
import { CiUser } from "react-icons/ci";
import { MdHomeWork } from "react-icons/md";
import { LuCalendarClock } from "react-icons/lu";
import { RiArrowDropDownFill } from "react-icons/ri";
import { RiArrowDropUpFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import cleanersThunk from "../../store/thunks/cleanersThunk.js";
import { clearCleaners } from "../../store/slices/cleanersSlice.js";

function CleanersUserQuoteListDetails () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { cleanerLike, reservation, submissions } = useSelector(state => state.cleaners);

  const [toggleDetails, setToggleDetails] = useState(false);

  const toggleMenuDetails = () => {
    setToggleDetails(!toggleDetails)
  };

  // form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    async function init() {
      const result = await dispatch(cleanersThunk.showThunk(params.id));
      console.log(result);
      if(result.type.endsWith('/rejected')) {
        alert('정보 획득 실패');
        navigate(-1);
      }
    }
    init();

    return () => {
      dispatch(clearCleaners);
    }
  }, []);

  return (
    <>
      <div className="all-container cleaners-user-quote-list-details-container">
        <p className="cleaners-user-quote-list-details-title">안녕하세요, 김기사 기사님! 요청 의뢰서입니다.</p>

        {/* 기본 정보 */}
        <div className="cleaners-user-quote-list-details-items-box cleaners-user-quote-list-details-base-info">
          <span className="cleaners-user-quote-list-details-like-status">{cleanerLike ? '지정' : '비지정'}</span>
          <div className="cleaners-user-quote-list-details-icon-set">
            <MdHomeWork size={20} />
            <div className="cleaners-user-quote-list-details-place">{reservation?.store.name}</div>
          </div>
          <div className="cleaners-user-quote-list-details-icon-set">
            <CiUser size={20} />
            <div className="cleaners-user-quote-list-details-user">{reservation?.owner.name}</div>
          </div>
          <div className="cleaners-user-quote-list-details-icon-set">
            <LuCalendarClock size={20} />
            <div className="cleaners-user-quote-list-details-date">{`${reservation?.date} ${reservation?.time}`}</div>
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
              <input type="text" className="cleaners-user-quote-list-details-input-layout" id="placeName" value={reservation?.store.name} readOnly />
            </div>
            <div className="cleaners-user-quote-list-details-input-box">
              <label htmlFor="call">전화번호</label>
              <input type="text" className="cleaners-user-quote-list-details-input-layout" id="call" value={reservation?.store.phoneNumber} readOnly />
            </div>
          </div>
          <div className="cleaners-user-quote-list-details-input-box">
            <label htmlFor="address1">주소</label>
            <input type="text" className="cleaners-user-quote-list-details-input-layout" id="address1" value={`${reservation?.store.addr1} ${reservation?.store.addr2}`} readOnly />
          </div>
          <div className="cleaners-user-quote-list-details-input-box">
            <label htmlFor="address2">상세주소</label>
            <input type="text" className="cleaners-user-quote-list-details-input-layout" id="adderss2" value={`${reservation?.store.addr3}`} readOnly />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 추가 정보 */}
          <div className="cleaners-user-quote-list-details-items-box-column">
            <span className="cleaners-user-quote-list-details-items-box-title cleaners-user-quote-list-details-toggle-question" onClick={toggleMenuDetails}>추가 정보{ toggleDetails ? <RiArrowDropUpFill size={20} /> : <RiArrowDropDownFill size={20} /> }</span>
            {
              submissions && submissions.map(submission => {
                return (
                  <>
                    <div className="cleaners-user-quote-list-details-items-box-question" key={submission.id}>
                      {
                        submission.question && (
                          <>
                            <span className="cleaners-user-quote-list-details-items-box-question-title" htmlFor={submission.question.code}>{`${submission.question.code}. ${submission.question.content}`}</span>
                            <div className="cleaners-user-quote-list-details-items-box-question-answers">
                              {
                                submission.question.questionOptions.map(questionOption => {
                                  return (
                                    <div className="cleaners-user-quote-list-details-items-box-question-answer" key={`${submission.question.code}-${questionOption.id}`}>
                                      <input type="radio" name={submission.question.code} id={`${submission.question.code}-${questionOption.id}`} checked={submission.questionOptionId === questionOption.id} value={questionOption.id} readOnly />
                                      <label htmlFor={`${submission.question.code}-${questionOption.id}`}>{questionOption.correct}</label>
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </>
                        )
                      }
                    </div>
                    {
                      !submission.question && (
                        <>
                          <span className="cleaners-user-quote-list-details-items-box-question-title">추가 요청 사항</span>
                          <textarea id="description" className="cleaners-user-quote-list-details-textarea" readOnly>{submission.answerText}</textarea>
                        </>
                      )
                    }
                  </>
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