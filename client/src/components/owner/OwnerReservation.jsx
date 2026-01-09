import React, { useState, useEffect } from "react";
import DatePicker from "../commons/DatePicker";
import './OwnerReservation.css';
import StoreSelectModal from "../commons/StoreSelectModal.jsx";
import useKakaoPostcode from "../hooks/useKakaoPostcode.js";
// Redux & API 관련 임포트
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { storeGetThunk } from '../../store/thunks/storeGetThunk.js';
import { createReservation, getQuestions } from '../../api/axiosOwner.js';

export default function OwnerReservation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openPostcode } = useKakaoPostcode();

  // --- Redux 데이터 ---
  const { user: owner } = useSelector(state => state.auth || {});
  const { stores = [], status: storesStatus = 'idle' } = useSelector(state => state.store || {});
  const storesLoading = storesStatus === 'loading';

  // --- 상태 관리 ---
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [storeName, setStoreName] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("02");
  const [phoneMiddle, setPhoneMiddle] = useState("");
  const [phoneLast, setPhoneLast] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");

  const [startDate, setStartDate] = useState("");
  const [isDateNegotiable, setIsDateNegotiable] = useState(false); // 날짜협의 체크 여부
  const [selectedTime, setSelectedTime] = useState("");
  const [files, setFiles] = useState([]);
  
  const [q1Answer, setQ1Answer] = useState("");
  const [q2Answer, setQ2Answer] = useState("");
  const [q3Answer, setQ3Answer] = useState("");
  const [q4Answer, setQ4Answer] = useState("");
  const [q5Answer, setQ5Answer] = useState("");
  const [additionalRequest, setAdditionalRequest] = useState("");

  const [q1Open, setQ1Open] = useState(false);
  const [q2Open, setQ2Open] = useState(false);
  const [q3Open, setQ3Open] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- 상수 데이터 ---
  const timeSlots = ["09시 ~ 10시", "11시 ~ 12시", "12시 ~ 13시", "13시 ~ 14시", "14시 ~ 15시", "15시 ~ 16시", "16시 ~ 17시", "17시 ~ 18시", "18시 ~ 19시", "19시 ~ 20시"];
  
  const questions = [
    { id: 1, type: "toggle", text: "Q1. 하루에 제빙기 가동시간은 얼마나 되나요?", options: ["5시간", "10시간", "12시간 이상"] },
    { id: 2, type: "toggle", text: "Q2. 제빙기 내부 청소 주기는 어떻게 되나요?", options: ["3개월", "6개월", "9개월", "청소한 적 없음"] },
    { id: 3, type: "toggle", text: "Q3. 청소를 할 제빙기는 몇 대 인가요?", options: ["1대", "2대", "3대 이상"] },
    { id: 4, type: "radio", text: "Q4. 곰팡이 냄새나 악취가 나나요?" },
    { id: 5, type: "radio", text: "Q5. 얼음이 탁한가요?" },
  ];

  const areaCodes = ["02", "010", "031", "032", "033", "041", "042", "043", "044", "051", "052", "053", "054", "055", "061", "062", "063", "064", "070"];

  // --- 핸들러 ---
  const handleLoadStoresClick = () => {
    dispatch(storeGetThunk());
    setIsStoreModalOpen(true);
  };

  const handleStoreSelect = (store) => {
    setSelectedStoreId(store.id);
    setStoreName(store.name || "");
    setAddress(`${store.addr1 || ''} ${store.addr2 || ''}`.trim());
    setDetailAddress(store.addr3 || "");

    const rawPhone = (store.phoneNumber || "").replace(/[^0-9-]/g, "");
    if (rawPhone.includes('-')) {
      const parts = rawPhone.split('-');
      if (areaCodes.includes(parts[0])) setPhonePrefix(parts[0]);
      setPhoneMiddle(parts[1] || "");
      setPhoneLast(parts[2] || "");
    } else if (rawPhone.length >= 9) {
      const isSeoul = rawPhone.startsWith("02");
      const prefixLen = isSeoul ? 2 : 3;
      const prefix = rawPhone.substring(0, prefixLen);
      if (areaCodes.includes(prefix)) setPhonePrefix(prefix);
      setPhoneMiddle(rawPhone.substring(prefixLen, rawPhone.length - 4));
      setPhoneLast(rawPhone.substring(rawPhone.length - 4));
    }
    setIsStoreModalOpen(false);
  };

  const handleAddressSearch = () => {
    openPostcode((addr) => {
      setAddress(addr);
      setSelectedStoreId(null);
    });
  };

  const handleInputChange = (setter, value) => {
    setter(value);
    if (selectedStoreId) setSelectedStoreId(null); 
  };

  const handlePhonePartChange = (setter) => (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    setter(numericValue);
    if (selectedStoreId) setSelectedStoreId(null);
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleOpen = (qId) => {
    if (qId === 1) setQ1Open(!q1Open);
    if (qId === 2) setQ2Open(!q2Open);
    if (qId === 3) setQ3Open(!q3Open);
  };

  const getToggleAnswer = (qId) => {
    if (qId === 1) return q1Answer;
    if (qId === 2) return q2Answer;
    if (qId === 3) return q3Answer;
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!storeName.trim()) { alert("매장명을 입력해주세요."); return; }
    if (!phoneMiddle || !phoneLast) { alert("연락처를 모두 입력해주세요."); return; }
    if (!address) { alert("주소를 검색해주세요."); return; }
    // 날짜는 무조건 필수
    if (!startDate) { alert("예약 날짜를 선택해주세요."); return; }
    if (!selectedTime) { alert("예약 시간을 선택해주세요."); return; }
    if (!agreedToTerms) { alert("이용약관에 동의해주세요."); return; }

    setLoading(true);
    try {
      const formattedDate = startDate instanceof Date ? startDate.toISOString().split('T')[0] : startDate;
      const formattedTime = selectedTime.split('시')[0].trim().padStart(2, '0') + ':00';
      const fullPhoneNumber = `${phonePrefix}-${phoneMiddle}-${phoneLast}`;

      let addr1 = "", addr2 = "";
      if (address) {
        const parts = address.split(" ");
        addr1 = parts[0];
        addr2 = parts.slice(1).join(" ");
      }

      const formData = new FormData();
      formData.append("storeId", selectedStoreId || "");
      formData.append("storeName", storeName);
      formData.append("phoneNumber", fullPhoneNumber);
      formData.append("addr1", addr1);
      formData.append("addr2", addr2);
      formData.append("addr3", detailAddress);
      formData.append("date", formattedDate);
      formData.append("time", formattedTime);
      formData.append("isDateNegotiable", isDateNegotiable); // 기사님이 보실 정보

      const submissions = [
        { questionCode: 'Q01', answer: q1Answer },
        { questionCode: 'Q02', answer: q2Answer },
        { questionCode: 'Q03', answer: q3Answer },
        { questionCode: 'Q04', answer: q4Answer === 'yes' ? '네' : '아니요' },
        { questionCode: 'Q05', answer: q5Answer === 'yes' ? '네' : '아니요' },
        { questionCode: 'Q99', answer: additionalRequest }
      ].filter(item => item.answer);

      formData.append("submissions", JSON.stringify(submissions));
      files.forEach(file => formData.append("files", file));

      await createReservation(formData); 
      
      navigate('/result', {
        state: {
          title: '견적 요청서 전송이 완료되었습니다!',
          message: '기사님들이 내용을 검토한 후<br/>견적서를 보내드립니다.',
          imgSrc: '/icons/success.png',
          button1Text: '홈으로 가기',
          button1Path: '/',
          button2Text: '요청서 확인',
          button2Path: '/owners/mypage',
          showButton2: true,
        },
      });
    } catch (err) {
      alert("전송에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="all-container owner-reservation-container">
      <h1 className="owner-reservation-main-title">요청서 작성</h1>

      <form className="owner-reservation-form" onSubmit={handleSubmit}>
        <section className="owner-reservation-card">
          <div className="owner-reservation-user-info">
            <div className="owner-reservation-avatar-circle">
              <img src={owner?.profile || "/icons/default-profile.png"} alt="프로필" className="owner-reservation-profile" />
            </div>
            <div className="owner-reservation-user-details">
              <strong>{owner?.name || "점주"} 점주님</strong>
              <span>{owner?.phoneNumber || owner?.phone || "전화번호 없음"}</span>
            </div>
          </div>
        </section>

        <section className="owner-reservation-card">
          <h2 className="owner-reservation-card-title">예약 정보<span className="required-star">*</span></h2>
          <div className="owner-reservation-date-row">
            <label>예약날짜</label>
            <div className="owner-reservation-date-input-set">
              <DatePicker 
                selected={startDate} 
                onChange={setStartDate} 
                minDate={new Date()} 
                placeholderText="예약 날짜 선택" 
                className="owner-reservation-datepicker-input" 
              />
              <div className="owner-reservation-negotiable-check">
                <input 
                  type="checkbox" 
                  id="date-negotiable"
                  checked={isDateNegotiable}
                  onChange={(e) => setIsDateNegotiable(e.target.checked)}
                />
                <label htmlFor="date-negotiable">날짜 협의 가능</label>
              </div>
            </div>
          </div>
          <div className="owner-reservation-time-row">
            <label>예약시간</label>
            <div className="owner-reservation-time-grid">
              {timeSlots.map(time => (
                <button key={time} type="button" className={`owner-reservation-time-btn ${selectedTime === time ? "active" : ""}`} onClick={() => setSelectedTime(time)}>{time}</button>
              ))}
            </div>
          </div>
          <div className="owner-reservation-file-section">
            <div className="owner-reservation-file-row">
              <button type="button" className="owner-reservation-btn-file-select" onClick={() => document.getElementById('file-input').click()}>문의 사진 첨부</button>
              <input type="file" id="file-input" hidden onChange={handleFileChange} multiple accept="image/*" />
            </div>
            {files.length > 0 && (
              <div className="owner-reservation-file-list">
                {files.map((file, index) => (
                  <div key={index} className="owner-reservation-file-item">
                    <span>{file.name}</span>
                    <button type="button" onClick={() => removeFile(index)} className="owner-reservation-file-remove">X</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="owner-reservation-card">
          <div className="owner-reservation-title-with-btn">
            <h2 className="owner-reservation-card-title">매장 정보<span className="required-star">*</span></h2>
            <button type="button" className="owner-reservation-btn-blue-outline" onClick={handleLoadStoresClick}>내 매장 불러오기</button>
          </div>
          
          <div className="owner-reservation-grid-cols">
            <div className="owner-reservation-input-group">
              <label>매장명</label>
              <input type="text" value={storeName} onChange={(e) => handleInputChange(setStoreName, e.target.value)} placeholder="매장명을 입력하세요" />
            </div>
            <div className="owner-reservation-input-group">
              <label>매장 전화번호</label>
              <div className="owner-reservation-phone-inputs">
                <select value={phonePrefix} onChange={(e) => handleInputChange(setPhonePrefix, e.target.value)}>
                  {areaCodes.map(code => <option key={code} value={code}>{code}</option>)}
                </select>
                <span>-</span>
                <input type="text" maxLength="4" value={phoneMiddle} onChange={handlePhonePartChange(setPhoneMiddle)} />
                <span>-</span>
                <input type="text" maxLength="4" value={phoneLast} onChange={handlePhonePartChange(setPhoneLast)} />
              </div>
            </div>
          </div>

          <div className="owner-reservation-input-group">
            <label>주소</label>
            <div className="owner-reservation-address-search-row">
              <input type="text" value={address} readOnly placeholder="주소 검색을 해주세요" />
              <button type="button" className="owner-reservation-btn-blue" onClick={handleAddressSearch}>검색하기</button>
            </div>
          </div>

          <div className="owner-reservation-input-group">
            <label>상세주소</label>
            <input type="text" value={detailAddress} onChange={(e) => handleInputChange(setDetailAddress, e.target.value)} placeholder="나머지 상세 주소를 입력하세요" />
          </div>
        </section>

        <section className="owner-reservation-card">
          <h2 className="owner-reservation-card-title">추가 정보 <span className="sub-guide">(선택 사항입니다.)</span></h2>
          <div className="owner-reservation-question-container">
            {questions.map((q) => (
              <div key={q.id} className="owner-reservation-question-item">
                <p className="owner-reservation-question-text">{q.text}</p>
                <div className="owner-reservation-answer-area">
                  {q.type === "toggle" ? (
                    <div className="owner-reservation-dropdown-wrapper">
                      <button type="button" className="owner-reservation-dropdown-btn" onClick={() => toggleOpen(q.id)}>
                        <span>{getToggleAnswer(q.id) || "선택하세요"}</span>
                        <span className="owner-reservation-dropdown-arrow">▼</span>
                      </button>
                      {((q.id === 1 && q1Open) || (q.id === 2 && q2Open) || (q.id === 3 && q3Open)) && (
                        <div className="owner-reservation-dropdown-menu">
                          {q.options.map((option) => (
                            <div key={option} className="owner-reservation-dropdown-item" onClick={() => {
                              if (q.id === 1) setQ1Answer(option);
                              if (q.id === 2) setQ2Answer(option);
                              if (q.id === 3) setQ3Answer(option);
                              toggleOpen(q.id);
                            }}>{option}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="owner-reservation-q-radio-group">
                      <label><input type="radio" name={`q${q.id}`} value="yes" checked={(q.id === 4 ? q4Answer : q5Answer) === 'yes'} onChange={(e) => q.id === 4 ? setQ4Answer(e.target.value) : setQ5Answer(e.target.value)} /> <span>네</span></label>
                      <label><input type="radio" name={`q${q.id}`} value="no" checked={(q.id === 4 ? q4Answer : q5Answer) === 'no'} onChange={(e) => q.id === 4 ? setQ4Answer(e.target.value) : setQ5Answer(e.target.value)} /> <span>아니요</span></label>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="owner-reservation-question-item owner-reservation-textarea-item">
              <p className="owner-reservation-question-text">추가 요청 사항</p>
              <textarea className="owner-reservation-q-textarea" placeholder="기사님께 전달할 추가 내용을 적어주세요." value={additionalRequest} onChange={(e) => setAdditionalRequest(e.target.value)} />
            </div>
          </div>
        </section>

        <section className="owner-reservation-card owner-reservation-terms-card">
          <h2 className="owner-reservation-card-title">이용약관</h2>
          <div className="owner-reservation-terms-box">
            1. 아이스닥터는 통신판매중개자이며, 개별 판매자가 제공하는 서비스의 이행 및 계약 책임은 거래당사자에게 있습니다.
          </div>
        </section>

        <div className="owner-reservation-final-check">
          <label><input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} /> 이용약관을 확인했습니다.</label>
          <div className="owner-reservation-btn-center">
            <button type="submit" className="owner-reservation-btn-submit-final" disabled={loading}>{loading ? "전송 중..." : "요청서 보내기"}</button>
          </div>
        </div>
      </form>

      <StoreSelectModal isOpen={isStoreModalOpen} onClose={() => setIsStoreModalOpen(false)} onSelect={handleStoreSelect} stores={stores} loading={storesLoading} />
    </div>
  );
}