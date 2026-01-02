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
      question: "Q. 이거는 문의 제목이 들어갑니다.",
      answer: "A. 이거는 답변 출력"
    },
    {
      id: 2,
      question: "Q. 이거는 문의 제목이 들어갑니다.",
      answer: "A. 이거는 답변 출력"
    },
    {
      id: 3,
      question: "Q. 이거는 문의 제목이 들어갑니다.",
      answer: "A. 이거는 답변 출력"
    },
    {
      id: 4,
      question: "Q. 이거는 문의 제목이 들어갑니다.",
      answer: "A. 이거는 답변 출력"
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