import React, { useState } from "react";
import DatePicker from "../commons/DatePicker";
import './OwnerReservation.css';

export default function OwnerReservation() {
  const [startDate, setStartDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [files, setFiles] = useState([]);
  const [phonePrefix, setPhonePrefix] = useState("02");
  const [phoneMiddle, setPhoneMiddle] = useState("");
  const [phoneLast, setPhoneLast] = useState("");
  const [q1Answer, setQ1Answer] = useState("");
  const [q2Answer, setQ2Answer] = useState("");
  const [q3Answer, setQ3Answer] = useState("");
  const [q1Open, setQ1Open] = useState(false);
  const [q2Open, setQ2Open] = useState(false);
  const [q3Open, setQ3Open] = useState(false);

  const timeSlots = [
    "09시 ~ 10시", "11시 ~ 12시", "12시 ~ 13시", "13시 ~ 14시", "14시 ~ 15시",
    "15시 ~ 16시", "16시 ~ 17시", "17시 ~ 18시", "18시 ~ 19시", "19시 ~ 20시"
  ];

  const questions = [
    { 
      id: 1, 
      type: "toggle", 
      text: "Q1. 하루에 제빙기 가동시간은 얼마나 되나요?",
      options: ["5시간", "10시간", "12시간 이상"]
    },
    { 
      id: 2, 
      type: "toggle", 
      text: "Q2. 제빙기 내부 청소 주기는 어떻게 되나요?",
      options: ["3개월", "6개월", "9개월", "청소한 적 없음"]
    },
    { 
      id: 3, 
      type: "toggle", 
      text: "Q3. 청소를 할 제빙기는 몇 대 인가요?",
      options: ["1대", "2대", "3대 이상"]
    },
    { id: 4, type: "radio", text: "Q4. 곰팡이 냄새나 악취가 나나요?" },
    { id: 5, type: "radio", text: "Q5. 얼음이 탁한가요?" },
  ];

  // 전화번호 각 부분 입력 핸들러
  const handlePhonePartChange = (setter) => (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    setter(numericValue);
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getToggleAnswer = (qId) => {
    if (qId === 1) return q1Answer;
    if (qId === 2) return q2Answer;
    if (qId === 3) return q3Answer;
    return "";
  };

  const setToggleAnswer = (qId, value) => {
    if (qId === 1) setQ1Answer(value);
    if (qId === 2) setQ2Answer(value);
    if (qId === 3) setQ3Answer(value);
  };

  const getToggleOpen = (qId) => {
    if (qId === 1) return q1Open;
    if (qId === 2) return q2Open;
    if (qId === 3) return q3Open;
    return false;
  };

  const toggleOpen = (qId) => {
    if (qId === 1) setQ1Open(!q1Open);
    if (qId === 2) setQ2Open(!q2Open);
    if (qId === 3) setQ3Open(!q3Open);
  };

  return (
    <div className="all-container owner-reservation-container">
      <h1 className="owner-reservation-main-title">요청서 작성</h1>

      <div className="owner-reservation-form">
        {/* 내 정보 섹션 */}
        <section className="owner-reservation-card">
          <div className="owner-reservation-user-info">
            <div className="owner-reservation-avatar-circle">
              <img 
                src="/icons/default-profile.png" 
                alt="프로필" 
                className="owner-reservation-profile"
              />
            </div>
            <div className="owner-reservation-user-details">
              <strong>OOO 점주님</strong>
              <span>010-123-4567</span>
            </div>
          </div>
        </section>

        {/* 예약 정보 섹션 */}
        <section className="owner-reservation-card">
          <h2 className="owner-reservation-card-title">
            예약 정보<span className="required-star">*</span>
          </h2>
          
          <div className="owner-reservation-date-row">
            <label>예약날짜</label>
            <div className="owner-reservation-date-input-set">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                minDate={new Date()}
                placeholderText="예약 날짜 선택"
                className="owner-reservation-datepicker-input" 
              />
              <button type="button" className="owner-reservation-btn-blue">
                날짜 협의가 가능해요.
              </button>
            </div>
          </div>

          <div className="owner-reservation-time-row">
            <label>예약시간</label>
            <div className="owner-reservation-time-grid">
              {timeSlots.map(time => (
                <button
                  key={time}
                  type="button"
                  className={`owner-reservation-time-btn ${selectedTime === time ? "active" : ""}`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="owner-reservation-file-section">
            <div className="owner-reservation-file-row">
              <button 
                type="button" 
                className="owner-reservation-btn-file-select" 
                onClick={() => document.getElementById('file-input').click()}
              >
                첨부파일
              </button>
              <input 
                type="file" 
                id="file-input" 
                hidden 
                onChange={handleFileChange}
                multiple
              />
            </div>
            {files.length > 0 && (
              <div className="owner-reservation-file-list">
                {files.map((file, index) => (
                  <div key={index} className="owner-reservation-file-item">
                    <span>{file.name}</span>
                    <button 
                      type="button"
                      onClick={() => removeFile(index)}
                      className="owner-reservation-file-remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 매장 정보 섹션 */}
        <section className="owner-reservation-card">
          <div className="owner-reservation-title-with-btn">
            <h2 className="owner-reservation-card-title">
              매장 정보<span className="required-star">*</span>
            </h2>
            <button type="button" className="owner-reservation-btn-blue-outline">
              매장 불러오기
            </button>
          </div>
          
          <div className="owner-reservation-grid-cols">
            <div className="owner-reservation-input-group">
              <label>매장명</label>
              <input type="text" />
            </div>
            <div className="owner-reservation-input-group">
              <label>매장 전화번호</label>
              <div className="owner-reservation-phone-inputs">
                <select value={phonePrefix} onChange={(e) => setPhonePrefix(e.target.value)}>
                  <option value="02">02</option>
                  <option value="031">031</option>
                  <option value="032">032</option>
                  <option value="033">033</option>
                  <option value="041">041</option>
                  <option value="042">042</option>
                  <option value="043">043</option>
                  <option value="044">044</option>
                  <option value="051">051</option>
                  <option value="052">052</option>
                  <option value="053">053</option>
                  <option value="054">054</option>
                  <option value="055">055</option>
                  <option value="061">061</option>
                  <option value="062">062</option>
                  <option value="063">063</option>
                  <option value="064">064</option>
                </select>
                <span>-</span>
                <input
                  type="text"
                  maxLength="4"
                  value={phoneMiddle}
                  onChange={handlePhonePartChange(setPhoneMiddle)}
                />
                <span>-</span>
                <input
                  type="text"
                  maxLength="4"
                  value={phoneLast}
                  onChange={handlePhonePartChange(setPhoneLast)}
                />
              </div>
            </div>
          </div>

          <div className="owner-reservation-input-group">
            <label>주소</label>
            <div className="owner-reservation-address-search-row">
              <input type="text" />
              <button type="button" className="owner-reservation-btn-blue">
                검색하기
              </button>
            </div>
          </div>

          <div className="owner-reservation-input-group">
            <label>상세주소</label>
            <input type="text" />
          </div>
        </section>

        {/* 추가 정보 섹션 */}
        <section className="owner-reservation-card">
          <h2 className="owner-reservation-card-title">
            추가 정보
            <span className="sub-guide">(필수 사항이 아닌 선택 사항입니다.)</span>
          </h2>
          
          <div className="owner-reservation-question-container">
            {questions.map((q) => (
              <div key={q.id} className="owner-reservation-question-item">
                <p className="owner-reservation-question-text">{q.text}</p>
                <div className="owner-reservation-answer-area">
                  {q.type === "toggle" ? (
                    <div className="owner-reservation-dropdown-wrapper">
                      <button
                        type="button"
                        className="owner-reservation-dropdown-btn"
                        onClick={() => toggleOpen(q.id)}
                      >
                        <span>{getToggleAnswer(q.id) || "선택하세요"}</span>
                        <span className="owner-reservation-dropdown-arrow">▼</span>
                      </button>
                      {getToggleOpen(q.id) && (
                        <div className="owner-reservation-dropdown-menu">
                          {q.options.map((option) => (
                            <div
                              key={option}
                              className="owner-reservation-dropdown-item"
                              onClick={() => {
                                setToggleAnswer(q.id, option);
                                toggleOpen(q.id);
                              }}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="owner-reservation-q-radio-group">
                      <label>
                        <input type="radio" name={`q${q.id}`} value="yes" />
                        <span>네</span>
                      </label>
                      <label>
                        <input type="radio" name={`q${q.id}`} value="no" />
                        <span>아니요</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="owner-reservation-question-item owner-reservation-textarea-item">
              <p className="owner-reservation-question-text">추가 요청 사항</p>
              <div className="owner-reservation-answer-area">
                <textarea className="owner-reservation-q-textarea" />
              </div>
            </div>
          </div>
        </section>

        {/* 이용약관 및 전송 */}
        <section className="owner-reservation-card owner-reservation-terms-card">
          <h2 className="owner-reservation-card-title">이용약관</h2>
          <div className="owner-reservation-terms-box">
            1. 아이스닥터는 통신판매중개자이며, 개별 판매자가 제공하는 서비스의 이행 및 계약 책임은 거래당사자에게 있습니다.
          </div>
        </section>

        <div className="owner-reservation-final-check">
          <label>
            <input type="checkbox" /> 이용약관을 확인했습니다.
          </label>
          <div className="owner-reservation-btn-center">
            <button type="submit" className="owner-reservation-btn-submit-final">
              요청서 보내기
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}