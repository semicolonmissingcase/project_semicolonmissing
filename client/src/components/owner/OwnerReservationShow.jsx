import React, { useState } from "react";
import './OwnerReservationShow.css';

export default function OwnerReservationShow({ data, estimateData }) {
  const [selectedImg, setSelectedImg] = useState(null);

  if (!data) return <div className="ownerreservationshow-loading">데이터를 불러오는 중입니다...</div>;

  const questionMap = {
    'Q01': '하루 제빙기 가동 시간',
    'Q02': '내부 청소 주기',
    'Q03': '청소할 제빙기 대수',
    'Q04': '악취 발생 여부',
    'Q05': '얼음 상태(탁함)',
    'Q99': '추가 요청 사항'
  };

  return (
    <div className="all-container ownerreservationshow-container">
      <h1 className="ownerreservationshow-main-title">요청서 상세 내역</h1>

      <div className="ownerreservationshow-form">
        {/* 점주 정보 섹션 */}
        <section className="ownerreservationshow-card">
          <div className="ownerreservationshow-user-info">
            <div className="ownerreservationshow-avatar-circle">
              <img src={data.ownerProfile || "/icons/default-profile.png"} alt="프로필" className="ownerreservationshow-profile" />
            </div>
            <div className="ownerreservationshow-user-details">
              <strong>{data.ownerName} 점주님</strong>
              <span>{data.ownerPhone}</span>
            </div>
          </div>
        </section>

        {/* 예약 및 매장 정보 섹션 */}
        <section className="ownerreservationshow-card">
          <h2 className="ownerreservationshow-card-title">예약 및 매장 정보</h2>
          <div className="ownerreservationshow-detail-info-grid">
            <div className="ownerreservationshow-detail-info-item">
              <label>방문 희망 일시</label>
              <div className="ownerreservationshow-detail-value">
                {data.date} / {data.time}
                {data.isDateNegotiable && <span className="ownerreservationshow-negotiable-badge">날짜 협의 가능</span>}
              </div>
            </div>
            <div className="ownerreservationshow-detail-info-item">
              <label>매장 위치</label>
              <div className="ownerreservationshow-detail-value">{data.storeName} | {data.addr1} {data.addr2} {data.addr3}</div>
            </div>
          </div>
        </section>

        {/* 이미지 그리드 섹션 */}
        {data.files && data.files.length > 0 && (
          <section className="ownerreservationshow-card">
            <h2 className="ownerreservationshow-card-title">현장 사진 <span className="ownerreservationshow-sub-guide">({data.files.length})</span></h2>
            <div className="ownerreservationshow-image-grid-4">
              {data.files.slice(0, 4).map((file, idx) => (
                <div key={idx} className="ownerreservationshow-image-item" onClick={() => setSelectedImg(file.url)}>
                  <img src={file.url} alt={`현장사진 ${idx + 1}`} />
                  {idx === 3 && data.files.length > 4 && (
                    <div className="ownerreservationshow-image-more-overlay">+{data.files.length - 4}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 추가 정보 (질문 답변) */}
        <section className="ownerreservationshow-card">
          <h2 className="ownerreservationshow-card-title">추가 정보</h2>
          <div className="ownerreservationshow-question-container">
            {data.submissions?.map((sub) => (
              <div key={sub.questionCode} className="ownerreservationshow-question-item">
                <p className="ownerreservationshow-question-text">{questionMap[sub.questionCode]}</p>
                <div className="ownerreservationshow-detail-answer-box">{sub.answer}</div>
              </div>
            ))}
          </div>
        </section>

        {/* --- [신규] 기사님 견적 정보 섹션 --- */}
        <div className="ownerreservationshow-estimate-area">
          {/* 기사님 프로필 카드 */}
          <section className="ownerreservationshow-card ownerreservationshow-engineer-card">
            <div className="ownerreservationshow-engineer-info">
              <div className="ownerreservationshow-engineer-avatar">
                <img src={estimateData?.engineerProfile || "/icons/engineer-default.png"} alt="기사님" />
              </div>
              <div className="ownerreservationshow-engineer-details">
                <div className="ownerreservationshow-engineer-name">
                  {estimateData?.engineerName || "OOO"} 기사님
                </div>
                <div className="ownerreservationshow-engineer-rating">
                  ⭐ {estimateData?.rating || "4.8"}
                </div>
                <p className="ownerreservationshow-engineer-msg">기사님 한 마디!!!</p>
              </div>
            </div>
          </section>

          {/* 견적 금액 및 설명 카드 */}
          <section className="ownerreservationshow-card ownerreservationshow-price-card">
            <div className="ownerreservationshow-price-row">
              <h2 className="ownerreservationshow-card-title">견적 금액</h2>
              <span className="ownerreservationshow-total-price">
                {estimateData?.price?.toLocaleString() || "150,000"}원
              </span>
            </div>
            
            <div className="ownerreservationshow-description-section">
              <h2 className="ownerreservationshow-card-title">견적 설명</h2>
              <div className="ownerreservationshow-desc-box">
                {estimateData?.description || "견적에 대한 상세 설명이 표시됩니다."}
              </div>
            </div>
          </section>

          {/* 하단 액션 버튼 */}
          <div className="ownerreservationshow-action-btns">
            <button className="ownerreservationshow-btn-chat">채팅하기</button>
            <button className="ownerreservationshow-btn-reserve">예약하기</button>
          </div>
        </div>
      </div>

    </div>
  );
}