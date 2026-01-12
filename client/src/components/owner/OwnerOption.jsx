import React, { useState } from "react";

export const RESERVATION_QUESTIONS = [
  { id: 1, code: "Q01", type: "toggle", text: "Q1. 하루에 제빙기 가동시간은 얼마나 되나요?", options: ["5시간", "10시간", "12시간 이상"] },
  { id: 2, code: "Q02", type: "toggle", text: "Q2. 제빙기 내부 청소 주기는 어떻게 되나요?", options: ["3개월", "6개월", "9개월", "청소한 적 없음"] },
  { id: 3, code: "Q03", type: "toggle", text: "Q3. 청소를 할 제빙기는 몇 대 인가요?", options: ["1대", "2대", "3대 이상"] },
  { id: 4, code: "Q04", type: "radio", text: "Q4. 곰팡이 냄새나 악취가 나나요?", labels: { yes: "네", no: "아니요" } },
  { id: 5, code: "Q05", type: "radio", text: "Q5. 얼음이 탁한가요?", labels: { yes: "네", no: "아니요" } },
  { id: 6, code: "Q06", type: "radio", text: "Q6. 얼음의 맛이 평소와 다른가요?", labels: { yes: "네", no: "아니요" } },
  { id: 7, code: "Q07", type: "radio", text: "Q7. 제빙량이 감소했나요?", labels: { yes: "네", no: "아니요" } },
  { id: 8, code: "Q08", type: "radio", text: "Q8. 기계에서 평소와 다른 소음이 있나요?", labels: { yes: "네", no: "아니요" } },
  { id: 9, code: "Q09", type: "radio", text: "Q9. 기계 주변은 청결한가요?", labels: { yes: "네", no: "아니요" } },
];

export default function OwnerOption({ 
  answers, 
  onAnswerChange, 
  additionalRequest, 
  onAdditionalRequestChange 
}) { 
  const [openId, setOpenId] = useState(null);

  const toggleDropdown = (id) => setOpenId(openId === id ? null : id);

  const handleSelect = (qId, option) => {
    onAnswerChange(qId, option);
    setOpenId(null);
  };

  return (
    <section className="owner-reservation-card">
      <h2 className="owner-reservation-card-title">
        추가 정보 <span className="sub-guide">(필수 사항이 아닌 선택 사항입니다. 하지만 입력해주시면 기사님들이 빠른 진단을 해주실 수 있어요!)</span>
      </h2>
      <div className="owner-reservation-question-container">
        {RESERVATION_QUESTIONS.map((q) => (
          <div key={q.id} className="owner-reservation-question-item">
            <p className="owner-reservation-question-text">{q.text}</p>
            <div className="owner-reservation-answer-area">
              {q.type === "toggle" ? (
                <div className="owner-reservation-dropdown-wrapper">
                  <button type="button" className="owner-reservation-dropdown-btn" onClick={() => toggleDropdown(q.id)}>
                    <span>{answers[`q${q.id}`] || "선택하세요"}</span>
                    <span className="owner-reservation-dropdown-arrow">▼</span>
                  </button>
                  {openId === q.id && (
                    <div className="owner-reservation-dropdown-menu">
                      {q.options.map((option) => (
                        <div key={option} className="owner-reservation-dropdown-item" onClick={() => handleSelect(q.id, option)}>
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="owner-reservation-q-radio-group">
                  <label>
                    <input 
                      type="radio" 
                      name={`q${q.id}`} 
                      value="yes" 
                      checked={answers[`q${q.id}`] === "yes"} 
                      onChange={(e) => onAnswerChange(q.id, e.target.value)} 
                    />
                    <span>{q.labels.yes}</span>
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name={`q${q.id}`} 
                      value="no" 
                      checked={answers[`q${q.id}`] === "no"} 
                      onChange={(e) => onAnswerChange(q.id, e.target.value)} 
                    />
                    <span>{q.labels.no}</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        ))}
        <div className="owner-reservation-question-item owner-reservation-textarea-item">
          <p className="owner-reservation-question-text">추가 요청 사항</p>
          <textarea
            className="owner-reservation-q-textarea"
            placeholder="기사님께 전달할 추가 내용을 적어주세요."
            value={additionalRequest}
            onChange={(e) => onAdditionalRequestChange(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}