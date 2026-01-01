import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import { CiUser } from "react-icons/ci";
import { MdHomeWork } from "react-icons/md";
import { LuCalendarClock } from "react-icons/lu";
import { RiArrowDropDownFill } from "react-icons/ri";
import { RiArrowDropUpFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import cleanersThunk from "../../store/thunks/cleanersThunk.js";
import { clearCleaners } from "../../store/slices/cleanersSlice.js";
import CleanersQuotationsPreparationSave from "./CleanersQuotationsPreparationSave";
import "./CleanersUserQuotations.css";

function CleanersUserQuoteListDetails () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { cleanerLike, reservation, submissions } = useSelector(state => state.cleaners);

  const [toggleDetails, setToggleDetails] = useState(false);

  const toggleMenuDetailsMenu = () => {
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

  // --- 1. 견적서 입력을 위한 상태 관리 ---
  const [quoteData, setQuoteData] = useState({
    estimated_amount: "", // 가격 필드명 반영
    description: ""
  }); 

  // --- 2. 모달에서 "불러오기" 클릭 시 실행될 함수 ---
  const handleSelectTemplate = (template) => {
    setQuoteData({
      estimated_amount: template.estimated_amount, // DB 필드명에 맞춤
      description: template.content || template.description // 템플릿의 내용 반영
    });
    closeModal();
  };


  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="all-container cleaners-user-quotations-container">
        <p className="cleaners-user-quotations-title">안녕하세요, 김기사 기사님! 요청 의뢰서입니다.</p>

        {/* 기본 정보 */}
        <div className="cleaners-user-quotations-items-box cleaners-user-quotations-base-info">
          <span className="cleaners-user-quotations-like-status">{cleanerLike ? '지정' : '비지정'}</span>
          <div className="cleaners-user-quotations-icon-set">
            <MdHomeWork size={20} />
            <div className="cleaners-user-quotations-place">{reservation?.store.name}</div>
          </div>
          <div className="cleaners-user-quotations-icon-set">
            <CiUser size={20} />
            <div className="cleaners-user-quotations-user">{reservation?.owner.name}</div>
          </div>
          <div className="cleaners-user-quotations-icon-set">
            <LuCalendarClock size={20} />
            <div className="cleaners-user-quotations-date">{`${reservation?.date} ${reservation?.time}`}</div>
          </div>
        </div>
    
        {/* 첨부파일 미리보기 */}
        <div className="cleaners-user-quotations-items-box-column">
          <span className="cleaners-user-quotations-items-box-title">첨부파일</span>
          <div className="cleaners-user-quotations-items-box-images">
            <div className="cleaners-user-quotations-items-box-image" style={{backgroundImage: `url('../../../public/icons/임시1.jpg')`}}></div>
          </div>
        </div>

        {/* 매장 정보 */}
        <div className="cleaners-user-quotations-items-box-column">
          <span className="cleaners-user-quotations-items-box-title">매장 정보</span>
          <div className="cleaners-user-quotations-grid-1">
            <div className="cleaners-user-quotations-input-box">
              <label htmlFor="placeName">매장명</label>
              <input type="text" className="cleaners-user-quotations-input-layout" id="placeName" value={reservation?.store.name} readOnly />
            </div>
            <div className="cleaners-user-quotations-input-box">
              <label htmlFor="call">전화번호</label>
              <input type="text" className="cleaners-user-quotations-input-layout" id="call" value={reservation?.store.phoneNumber} readOnly />
            </div>
          </div>
          <div className="cleaners-user-quotations-input-box">
            <label htmlFor="address1">주소</label>
            <input type="text" className="cleaners-user-quotations-input-layout" id="address1" value={`${reservation?.store.addr1} ${reservation?.store.addr2}`} readOnly />
          </div>
          <div className="cleaners-user-quotations-input-box">
            <label htmlFor="address2">상세주소</label>
            <input type="text" className="cleaners-user-quotations-input-layout" id="adderss2" value={`${reservation?.store.addr3}`} readOnly />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 추가 정보 */}
          <div className="cleaners-user-quotations-items-box-column">
            <span className="cleaners-user-quotations-items-box-title cleaners-user-quotations-toggle-question" onClick={toggleMenuDetailsMenu}>추가 정보{ toggleDetails ? <RiArrowDropUpFill size={20} /> : <RiArrowDropDownFill size={20} /> }</span>
            {
              submissions && submissions.map(submission => {
                return (
                  <>
                    <div className="cleaners-user-quotations-items-box-question" key={submission.id}>
                      {
                        submission.question && (
                          <>
                            <span className="cleaners-user-quotations-items-box-question-title" htmlFor={submission.question.code}>{`${submission.question.code}. ${submission.question.content}`}</span>
                            <div className="cleaners-user-quotations-items-box-question-answers">
                              {
                                submission.question.questionOptions.map(questionOption => {
                                  return (
                                    <div className="cleaners-user-quotations-items-box-question-answer" key={`${submission.question.code}-${questionOption.id}`}>
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
                          <span className="cleaners-user-quotations-items-box-question-title">추가 요청 사항</span>
                          <textarea id="description" className="cleaners-user-quotations-textarea" readOnly>{submission.answerText}</textarea>
                        </>
                      )
                    }
                  </>
                )
              })
            }
          </div> 

        {/* 기사님 견적서 작성 카드 */}
        <div className="cleaners-user-quotations-items-box-column">
          <div className="cleaners-user-quotations-items-box-title-box">
            <span className="cleaners-user-quotations-items-box-title">기사님 견적서</span>
            <button type="button" className="cleaners-user-quotations-btn" onClick={openModal}>
              임시 저장 견적서 불러오기
            </button>

            {/* 모달 렌더링 */}
            {isModalOpen && (
              <div className="modal-overlay" onClick={closeModal}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <button type="button" className="modal-close-x" onClick={closeModal}>&times;</button>
                  {/* 모달에 데이터 선택 함수를 props로 전달 */}
                  <CleanersQuotationsPreparationSave onSelect={handleSelectTemplate} />
                </div>
              </div>
            )}
          </div>

          {/* 견적 금액 입력 필드 */}
          <div className="cleaners-user-quotations-input-box cleaners-user-quotations-grid-1">
            <label htmlFor="estimated_amount">견적 금액</label>
            <input 
              type="number" 
              className="cleaners-user-quotations-input-layout input-remove-arrows" 
              id="estimated_amount"
              value={quoteData.estimated_amount}
              onChange={(e) => setQuoteData({ ...quoteData, estimated_amount: e.target.value })}
              placeholder="0"
            />
          </div>

          {/* 견적 설명 입력 필드 */}
          <div className="cleaners-user-quotations-textarea-box">
            <label htmlFor="description">견적 설명</label>
            <textarea 
              id="description" 
              className="cleaners-user-quotations-textarea"
              value={quoteData.description}
              onChange={(e) => setQuoteData({ ...quoteData, description: e.target.value })}
              placeholder="견적에 대한 상세 설명을 입력하거나 임시 저장 견적을 불러오세요."
            ></textarea>
          </div>
        </div>
        
        <button type="submit" className="btn-medium bg-light">요청 수락하기</button>
      </form>

      </div> 
    </>
  )
}

export default CleanersUserQuoteListDetails;