import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from "../commons/DatePicker";
import StoreSelectModal from "../commons/StoreSelectModal.jsx";
import useKakaoPostcode from "../hooks/useKakaoPostcode.js";
import { storeGetThunk } from '../../store/thunks/storeGetThunk.js';
import { createReservation } from '../../api/axiosOwner.js';
import OwnerOption, { RESERVATION_QUESTIONS } from "./OwnerOption.jsx";
import './OwnerReservation.css';

export default function OwnerReservation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location =useLocation();
  const { openPostcode } = useKakaoPostcode();

  const [cleanerId, setCleanerId] = useState(null);

  const { user: owner } = useSelector(state => state.auth || {});
  const { stores = [], status: storesStatus = 'idle' } = useSelector(state => state.store || {});
  const storesLoading = storesStatus === 'loading';

  // 상태 관리
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [storeName, setStoreName] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("02");
  const [phoneMiddle, setPhoneMiddle] = useState("");
  const [phoneLast, setPhoneLast] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [startDate, setStartDate] = useState("");
  const [isDateNegotiable, setIsDateNegotiable] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [files, setFiles] = useState([]);
  const [answers, setAnswers] = useState({});
  const [additionalRequest, setAdditionalRequest] = useState("");
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const areaCodes = ["02", "010", "031", "032", "033", "041", "042", "043", "044", "051", "052", "053", "054", "055", "061", "062", "063", "064", "070"];
  const timeSlots = ["09시 ~ 10시", "11시 ~ 12시", "12시 ~ 13시", "13시 ~ 14시", "14시 ~ 15시", "15시 ~ 16시", "16시 ~ 17시", "17시 ~ 18시", "18시 ~ 19시", "19시 ~ 20시"];

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('cleanerId');
    if(id) {
      setCleanerId(id);
      console.log("OwnerReservation 페이지가 URL에서 추출한 cleanerId:", id);
    }
  }, [location]);

  // --- 추가된 핸들러 함수들 ---
  const handleInputChange = (setter, value) => {
    setter(value);
    if (selectedStoreId) setSelectedStoreId(null);
  };

  const handlePhonePartChange = (setter) => (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    setter(numericValue);
    if (selectedStoreId) setSelectedStoreId(null);
  };

  const handleAddressSearch = () => {
    openPostcode((addr) => {
      setAddress(addr);
      setSelectedStoreId(null);
    });
  };

  const handleLoadStoresClick = () => {
    dispatch(storeGetThunk());
    setIsStoreModalOpen(true);
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnswerChange = (qId, value) => {
    setAnswers(prev => ({ ...prev, [`q${qId}`]: value }));
  };

  const handleStoreSelect = (store) => {
    setSelectedStoreId(store.id);
    setStoreName(store.name || "");
    setAddress(`${store.addr1 || ''} ${store.addr2 || ''}`.trim());
    setDetailAddress(store.addr3 || "");
    // 전화번호 파싱 로직 (필요시 추가)
    setIsStoreModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!storeName || !address || !startDate || !selectedTime || !agreedToTerms) {
      alert("필수 항목을 모두 확인해주세요.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      const formattedDate = startDate instanceof Date ? startDate.toISOString().split('T')[0] : startDate;
      const formattedTime = selectedTime.split('시')[0].trim().padStart(2, '0') + ':00';

      formData.append("storeId", selectedStoreId || "");
      formData.append("storeName", storeName);
      formData.append("phoneNumber", `${phonePrefix}-${phoneMiddle}-${phoneLast}`);
      formData.append("addr1", address.split(" ")[0]);
      formData.append("addr2", address.split(" ").slice(1).join(" "));
      formData.append("addr3", detailAddress);
      formData.append("date", formattedDate);
      formData.append("time", formattedTime);
      formData.append("isDateNegotiable", isDateNegotiable);

      if(cleanerId) {
        formData.append("cleanerId", cleanerId);
      }

      const submissions = RESERVATION_QUESTIONS.map(q => {
        const rawValue = answers[`q${q.id}`];
        if (!rawValue) return null;
        return {
          questionCode: q.code,
          answer: q.type === "radio" ? (rawValue === 'yes' ? '네' : '아니요') : rawValue
        };
      }).filter(Boolean);

      if (additionalRequest.trim()) {
        submissions.push({ questionCode: 'Q99', answer: additionalRequest });
      }

      formData.append("submissions", JSON.stringify(submissions));
      files.forEach(file => formData.append("files", file));

      await createReservation(formData);
      navigate('/result', { 
        state: { 
          title: '전송 완료!', 
          message: '기사님이 곧 연락드립니다.',
          imgSrc: '/icons/success.png',
          button1Text: '홈으로 가기',
          button1Path: '/',
          button2Text: '요청서 확인',
          button2Path: '/owners/mypage',
          showButton2: true,
        } 
      });
    } catch (err) {
      alert("전송 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="all-container owner-reservation-container">
      <h1 className="owner-reservation-main-title">요청서 작성</h1>
      <form className="owner-reservation-form" onSubmit={handleSubmit}>
        {/* 내 정보 섹션 */}
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

        {/* 예약 정보 섹션 */}
        <section className="owner-reservation-card">
          <h2 className="owner-reservation-card-title">예약 정보<span className="required-star">*</span></h2>
          <div className="owner-reservation-date-row">
            <label>예약날짜</label>
            <div className="owner-reservation-date-input-set">
              <DatePicker selected={startDate} onChange={setStartDate} minDate={new Date()} placeholderText="예약 날짜 선택" className="owner-reservation-datepicker-input" />
              <div className="owner-reservation-negotiable-check">
                <input type="checkbox" id="date-negotiable" checked={isDateNegotiable} onChange={(e) => setIsDateNegotiable(e.target.checked)} />
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
            <button type="button" className="owner-reservation-btn-file-select" onClick={() => document.getElementById('file-input').click()}>문의 사진 첨부</button>
            <input type="file" id="file-input" hidden onChange={handleFileChange} multiple accept="image/*" />
            <div className="owner-reservation-file-list">
              {files.map((file, index) => (
                <div key={index} className="owner-reservation-file-item">
                  <span>{file.name}</span>
                  <button type="button" onClick={() => removeFile(index)} className="owner-reservation-file-remove">X</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 매장 정보 섹션 */}
        <section className="owner-reservation-card">
          <div className="owner-reservation-title-with-btn">
            <h2 className="owner-reservation-card-title">매장 정보<span className="required-star">*</span></h2>
            <button type="button" className="owner-reservation-btn-blue-outline" onClick={handleLoadStoresClick}>매장 불러오기</button>
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

        <OwnerOption 
          answers={answers} 
          onAnswerChange={handleAnswerChange} 
          additionalRequest={additionalRequest} 
          onAdditionalRequestChange={setAdditionalRequest} 
        />

        <section className="owner-reservation-card owner-reservation-terms-card">
          <h2 className="owner-reservation-card-title">이용약관</h2>
          <div className="owner-reservation-terms-box">
            1. 아이스닥터는 통신판매중개자이며, 개별 판매자가 제공하는 서비스의 이행 및 계약 책임은 거래당사자에게 있습니다.
          </div>
        </section>

        <div className="owner-reservation-final-check">
          <label>
            <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} />
            이용약관을 확인했습니다.
          </label>
          <div className="owner-reservation-btn-center">
            <button type="submit" className="owner-reservation-btn-submit-final" disabled={loading}>
              {loading ? "전송 중..." : "요청서 보내기"}
            </button>
          </div>
        </div>
      </form>

      <StoreSelectModal isOpen={isStoreModalOpen} onClose={() => setIsStoreModalOpen(false)} onSelect={handleStoreSelect} stores={stores} loading={storesLoading} />
    </div>
  );
}