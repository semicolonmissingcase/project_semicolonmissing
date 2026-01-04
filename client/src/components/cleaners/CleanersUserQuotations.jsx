import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import { CiUser } from "react-icons/ci";
import { MdHomeWork } from "react-icons/md";
import { LuCalendarClock } from "react-icons/lu";
import { RiArrowDropDownFill, RiArrowDropUpFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import cleanersThunk from "../../store/thunks/cleanersThunk.js";
import { clearCleaners } from "../../store/slices/cleanersSlice.js";
import CleanersQuotationsPreparationSave from "./CleanersQuotationsPreparationSave.jsx";
import "./CleanersUserQuotations.css";
import styles from "./CleanersUserQuotations.module.css";

function CleanersUserQuoteListDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { cleanerLike, reservation, submissions } = useSelector((state) => state.cleaners);

  const [toggleDetails, setToggleDetails] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- 1. 견적서 입력을 위한 상태 관리 ---
  const [quoteData, setQuoteData] = useState({
    estimatedAmount: "",
    description: "",
  });

  const toggleMenuDetailsMenu = () => {
    setToggleDetails(!toggleDetails);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // --- 2. 모달에서 "불러오기" 클릭 시 실행될 함수 ---
  const handleSelectTemplate = (template) => {
    setQuoteData({
      estimatedAmount: template.estimatedAmount, // 자식 컴포넌트의 onApplyNow 필드명과 일치시킴
      description: template.description,
    });
    closeModal();
  };

  useEffect(() => {
    (async () => {
      const result = await dispatch(cleanersThunk.showThunk(params.id));
      if (result.type.endsWith("/rejected")) {
        alert("정보 획득 실패");
        navigate(-1);
      }
    })();

    return () => dispatch(clearCleaners());
  }, [dispatch, navigate, params.id]);

 useEffect(() => {
    // 모달이 열릴 때만 명확하게 템플릿 호출
    dispatch(cleanersThunk.fetchTemplatesThunk());
  }, [dispatch]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    reservationId: params.id, // URL 파라미터에서 가져온 예약 ID
    estimatedAmount: quoteData.estimatedAmount,
    description: quoteData.description
  };

  try {
    const result = await dispatch(cleanersThunk.submitQuotationThunk(payload));
    
    if (result.type.endsWith("/fulfilled")) {
      alert("견적이 성공적으로 전송되었습니다!");
      navigate("/cleaners/main"); // 성공 시 목록으로 이동
    } else {
      alert("제출 실패: " + result.payload);
    }
  } catch (err) {
    alert("오류가 발생했습니다.");
  }
};

  return (
    <>
      <div className="all-container cleaners-user-quotations-container">
        <p className="cleaners-user-quotations-title">안녕하세요, 김기사 기사님! 요청 의뢰서입니다.</p>

        {/* 기본 정보 */}
        <div className="cleaners-user-quotations-items-box cleaners-user-quotations-base-info">
          <span className="cleaners-user-quotations-like-status">{cleanerLike ? "지정" : "비지정"}</span>
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
            <div
              className="cleaners-user-quotations-items-box-image"
              style={{ backgroundImage: `url('/icons/임시1.jpg')` }}
            ></div>
          </div>
        </div>

        {/* 매장 정보 */}
        <div className="cleaners-user-quotations-items-box-column">
          <span className="cleaners-user-quotations-items-box-title">매장 정보</span>
          <div className="cleaners-user-quotations-grid-1">
            <div className="cleaners-user-quotations-input-box">
              <label htmlFor="placeName">매장명</label>
              <input
                type="text"
                className="cleaners-user-quotations-input-layout"
                id="placeName"
                value={reservation?.store.name || ""}
                readOnly
              />
            </div>
            <div className="cleaners-user-quotations-input-box">
              <label htmlFor="call">전화번호</label>
              <input
                type="text"
                className="cleaners-user-quotations-input-layout"
                id="call"
                value={reservation?.store.phoneNumber || ""}
                readOnly
              />
            </div>
          </div>
          <div className="cleaners-user-quotations-input-box">
            <label htmlFor="address1">주소</label>
            <input
              type="text"
              className="cleaners-user-quotations-input-layout"
              id="address1"
              value={`${reservation?.store.addr1 || ""} ${reservation?.store.addr2 || ""}`}
              readOnly
            />
          </div>
          <div className="cleaners-user-quotations-input-box">
            <label htmlFor="address2">상세주소</label>
            <input
              type="text"
              className="cleaners-user-quotations-input-layout"
              id="address2"
              value={reservation?.store.addr3 || ""}
              readOnly
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 추가 정보 */}
          <div className="cleaners-user-quotations-items-box-column">
            <span
              className="cleaners-user-quotations-items-box-title cleaners-user-quotations-toggle-question"
              onClick={toggleMenuDetailsMenu}
            >
              추가 정보
              {toggleDetails ? <RiArrowDropUpFill size={20} /> : <RiArrowDropDownFill size={20} />}
            </span>
            {!toggleDetails &&
              submissions &&
              submissions.map((submission) => (
                <div key={submission.id}>
                  {submission.question ? (
                    <div className="cleaners-user-quotations-items-box-question">
                      <span className="cleaners-user-quotations-items-box-question-title">
                        {`${submission.question.code}. ${submission.question.content}`}
                      </span>
                      <div className="cleaners-user-quotations-items-box-question-answers">
                        {submission.question.questionOptions.map((questionOption) => (
                          <div
                            className="cleaners-user-quotations-items-box-question-answer"
                            key={`${submission.question.code}-${questionOption.id}`}
                          >
                            <input
                              type="radio"
                              name={submission.question.code}
                              id={`${submission.question.code}-${questionOption.id}`}
                              checked={submission.questionOptionId === questionOption.id}
                              value={questionOption.id}
                              readOnly
                              className={styles.radioInput}
                            />
                            <label
                              htmlFor={`${submission.question.code}-${questionOption.id}`}
                              className={styles.radioLabel}
                            >
                              {questionOption.correct}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="cleaners-user-quotations-items-box-additional-question">
                      <span className="cleaners-user-quotations-items-box-question-title">추가 요청 사항</span>
                      <textarea
                        className="cleaners-user-quotations-textarea"
                        value={submission.answerText || ""}
                        readOnly
                      ></textarea>
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* 기사님 견적서 작성 카드 */}
          <div className="cleaners-user-quotations-items-box-column">
            <div className="cleaners-user-quotations-items-box-title-box">
              <span className="cleaners-user-quotations-items-box-title">기사님 견적서</span>
              <button type="button" className="cleaners-user-quotations-btn" onClick={openModal}>
                임시 저장 견적서 불러오기
              </button>

              {isModalOpen && (
                <div className="cleaners-user-quotations-modal-overlay" onClick={closeModal}>
                  <div className="cleaners-user-quotations-modal-content" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="cleaners-user-quotations-modal-close-x" onClick={closeModal}>
                      &times;
                    </button>
                    <CleanersQuotationsPreparationSave onSelect={handleSelectTemplate} />
                  </div>
                </div>
              )}
            </div>

            {/* 견적 금액 입력 필드 */}
            <div className="cleaners-user-quotations-input-box cleaners-user-quotations-grid-1">
              <label htmlFor="estimatedAmount">견적 금액</label>
              <input
                type="number"
                className="cleaners-user-quotations-input-layout-custom input-remove-arrows"
                id="estimatedAmount"
                value={quoteData.estimatedAmount}
                onChange={(e) => setQuoteData({ ...quoteData, estimatedAmount: e.target.value })}
                placeholder="0"
              />
            </div>

            {/* 견적 설명 입력 필드 */}
            <div className="cleaners-user-quotations-textarea-box">
              <label htmlFor="quote_description">견적 설명</label>
              <textarea
                id="quote_description"
                className="cleaners-user-quotations-textarea"
                value={quoteData.description}
                onChange={(e) => setQuoteData({ ...quoteData, description: e.target.value })}
                placeholder="견적에 대한 상세 설명을 입력하거나 임시 저장 견적을 불러오세요."
              ></textarea>
            </div>
          </div>

          <button type="submit" className="btn-medium bg-light">
            요청 수락하기
          </button>
        </form>
      </div>
    </>
  );
}

export default CleanersUserQuoteListDetails;