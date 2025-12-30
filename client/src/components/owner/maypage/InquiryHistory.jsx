import React, { useState } from 'react';
import './InquiryHistory.css';

export default function InquiryHistory() {
  // 어떤 문의가 펼쳐져 있는지 관리하는 상태 (null이면 모두 닫힘)
  const [activeIndex, setActiveIndex] = useState(null);

  const inquiryData = [
    {
      id: 1,
      title: "여기는 문의 제목이 들어갑니다.",
      question: "문의 상세 내용이 여기에 들어갑니다.",
      answer: "여기는 답변 내용이 들어가는 자리입니다."
    },
    {
      id: 2,
      title: "기사님이 연락이 안됩니다ㅠㅠㅠ",
      question: "기사님이 연락이 안됩니다ㅠㅠㅠ 어쩌죠 연락할 방법이 없나요? 연락처 주실 수 있나요?",
      answer: "A. 기사님의 연락처는 개인정보라 알려드릴 수 없습니다. 죄송하지만 예약 취소 후 다른 기사님과 협의 후 예약하시는 것을 추천드립니다."
    },
    {
      id: 3,
      title: "여기는 문의 제목이 들어갑니다.",
      question: "결제 관련 문의드립니다.",
      answer: "결제 취소는 마이페이지 예약 내역에서 가능합니다."
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="inquiryhistory-tab-container">
      <div className="inquiryhistory-list">
        {inquiryData.map((item, index) => (
          <div 
            key={item.id} 
            className={`inquiryhistory-item ${activeIndex === index ? 'active' : ''}`}
          >
            {/* 질문 헤더 (클릭 시 토글) */}
            <div 
              className="inquiryhistory-header" 
              onClick={() => toggleAccordion(index)}
            >
              <span className="inquiryhistory-q-prefix">Q.</span>
              <span className="inquiryhistory-title-text">{item.title}</span>
              <span className="inquiryhistory-arrow-icon">
                {activeIndex === index ? '▲' : '▼'}
              </span>
            </div>

            {/* 답변 영역 (활성화 시 노출) */}
            {activeIndex === index && (
              <div className="inquiryhistory-body">
                <div className="inquiryhistory-question-content">
                  {item.question}
                </div>
                <div className="inquiryhistory-divider"></div>
                <div className="inquiryhistory-answer-content">
                  {item.answer}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}