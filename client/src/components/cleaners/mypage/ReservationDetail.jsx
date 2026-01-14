import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaClock, FaClipboardList, FaChevronLeft, FaStore, FaUser } from "react-icons/fa";
import { getCleanerJobDetail } from '../../../api/axiosCleaner'; 
import './ReservationDetail.css';

export default function ReservationDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await getCleanerJobDetail(id);
        
        if (response.data.success) {
          const { reservation, submissions } = response.data.data;
          
          // 주소 병합
          const fullAddress = [
            reservation.store?.addr1,
            reservation.store?.addr2,
            reservation.store?.addr3
          ].filter(Boolean).join(' ');

          const formattedQaList = (submissions || []).map(s => {
            let displayAnswer = s.answerText || s.answer_text;

            const optionId = s.questionOptionId || s.question_option_id;
            if (!displayAnswer && optionId && s.question?.questionOptions) {
              const matchedOption = s.question.questionOptions.find(opt => opt.id === optionId);
              if (matchedOption) {
                displayAnswer = matchedOption.correct;
              }
            }

            return {
              question: s.question?.content || '상세 항목', //
              answer: displayAnswer || '답변 없음'
            };
          });

          setData({
            storeName: reservation.store?.name || '정보 없음',
            storeAddress: fullAddress || '주소 정보 없음',
            wishDate: reservation.date,
            wishTime: reservation.time?.slice(0, 5),
            ownerName: reservation.owner?.name || '정보 없음',
            ownerPhone: reservation.owner?.phone, 
            price: reservation.estimate?.estimated_amount || 0,
            description: reservation.description,
            qaList: formattedQaList
          });
        }
      } catch (error) {
        console.error("의뢰 상세 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className="reservation-detail-loading-state">데이터를 불러오는 중...</div>;
  if (!data) return <div className="reservation-detail-error-state">의뢰 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="reservation-detail-outer-wrapper">
      <div className="reservation-detail-container">
        <header className="reservation-detail-nav">
          <button className="reservation-detail-back-btn" onClick={() => navigate('/cleaners/mypage')}>
            <FaChevronLeft />
          </button>
          <h1 className="reservation-detail-header-title">의뢰 상세 내역</h1>
          <div className="reservation-detail-header-empty"></div>
        </header>

        <main className="reservation-detail-scroll-area">
          <section className="reservation-detail-main-card">
            <div className="reservation-detail-store-header">
              <FaStore className="reservation-detail-store-icon" />
              <h2 className="reservation-detail-store-name">{data.storeName}</h2>
            </div>
            <div className="reservation-detail-address-row">
              <FaMapMarkerAlt className="reservation-detail-icon" />
              <p className="reservation-detail-address-text">{data.storeAddress}</p>
            </div>
          </section>

          <div className="reservation-detail-info-grid">
            <article className="reservation-detail-info-item-card">
              <div className="reservation-detail-info-title"><FaClock /> 방문 일정</div>
              <p className="reservation-detail-info-value">{data.wishDate}</p>
              <p className="reservation-detail-info-sub-value">{data.wishTime} 방문 예정</p>
            </article>
            <article className="reservation-detail-info-item-card">
              <div className="reservation-detail-info-title"><FaUser /> 담당 점주</div>
              <p className="reservation-detail-info-value">{data.ownerName} 점주님</p>
              <p className="reservation-detail-phone-text">{data.ownerPhone || "연락처 정보 없음"}</p>
            </article>
          </div>

          <section className="reservation-detail-desc-card">
            <div className="reservation-detail-info-title"><FaClipboardList /> 상세 요청 문항</div>
            <div className="reservation-detail-qa-container">
              {data.qaList && data.qaList.length > 0 ? (
                data.qaList.map((item, index) => (
                  <div key={index} className="reservation-detail-qa-row">
                    <span className="reservation-detail-qa-q">{item.question}</span>
                    <span className="reservation-detail-qa-a">{item.answer}</span>
                  </div>
                ))
              ) : (
                <p className="reservation-detail-no-data">등록된 상세 답변이 없습니다.</p>
              )}
            </div>

            <div className="reservation-detail-price-summary">
              <span className="reservation-detail-price-label">확정 견적 금액</span>
              <span className="reservation-detail-final-price">
                {new Intl.NumberFormat('ko-KR').format(data.price)}원
              </span>
            </div>

            {data.description && (
              <div className="reservation-detail-memo-section">
                <h4 className="reservation-detail-memo-title">고객 추가 요청사항</h4>
                <div className="reservation-detail-memo-content">{data.description}</div>
              </div>
            )}
          </section>
        </main>

        <footer className="reservation-detail-footer">
          <button className="reservation-detail-primary-btn" onClick={() => navigate('/cleaners/mypage')}>
            목록으로 돌아가기
          </button>
        </footer>
      </div>
    </div>
  );
}