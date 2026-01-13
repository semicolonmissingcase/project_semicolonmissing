import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainQna.css';

export default function MainQna() {
  const navigate = useNavigate();
  
  // 각 아코디언 항목의 열림/닫힘 상태 관리
  const [openIndex, setOpenIndex] = useState(null);

  // FAQ 데이터
  const faqs = [
    {
      id: 1,
      question: "Q. 제빙기 청소는 얼마나 자주 해야 하나요?",
      answer: "A. 일반적으로 3개월에 한 번 정기 청소를 권장합니다."
    },
    {
      id: 2,
      question: "Q. 보험은 어떻게 되나요?",
      answer: "A. 작업 중 발생한 사고는 플랫폼 보험으로 처리됩니다."
    },
    {
      id: 3,
      question: "Q. 예약 취소는 어떻게 하나요?",
      answer: "A. 예약 관리 페이지에서 24시간 전까지 취소 가능합니다."
    },
    {
      id: 4,
      question: "Q. 기사 등록은 어떻게 하나요?",
      answer: "A. 회원가입 후 기사 인증 서류를 제출하시면 됩니다."
    }
  ];

  // 아코디언 토글 함수
  function toggleAccordion(index) {
    // 이미 열려있는 항목을 클릭하면 닫고, 닫혀있으면 열기
    setOpenIndex(openIndex === index ? null : index);
  }

  // 더보기 버튼 클릭 시 QnA 페이지로 이동
  function handleMoreClick() {
    navigate('/qnaposts');
  }

  return (
    <div className="all-container mainqna-container">
      {/* 헤더 */}
      <div className="mainqna-header">
        <h2 className="mainqna-title">주요 문의 사항</h2>
        <button className="mainqna-more-btn" onClick={handleMoreClick}>
          더보기 ▶
        </button>
      </div>

      {/* 아코디언 리스트 */}
      <div className="mainqna-accordion-list">
        {faqs.map((faq, index) => (
          <div key={faq.id} className="mainqna-accordion-item">
            {/* 질문 영역 */}
            <button
              className={`mainqna-question ${openIndex === index ? 'active' : ''}`}
              onClick={() => toggleAccordion(index)}
            >
              <span>{faq.question}</span>
              <span className={`mainqna-arrow ${openIndex === index ? 'rotate' : ''}`}>
                ▼
              </span>
            </button>

            {/* 답변 영역 (열렸을 때만 표시) */}
            {openIndex === index && (
              <div className="mainqna-answer">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}