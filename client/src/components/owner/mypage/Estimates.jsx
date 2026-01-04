import React, { useEffect, useState } from 'react';
import './Estimates.css';
import { useNavigate } from 'react-router-dom';
import FavoriteButton from '../../commons/FavoriteBtn.jsx';
import { getOwnerReservations, getEstimatesByReservationId } from '../../../api/axiosOwner.js';

// 받은 견적
export default function Estimates() {
  const APP_SERVER_URL = import.meta.env.APP_SERVER_URL; // 기사님 프로필 이미지 불러오기
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]); // 예약 목록
  const [loading, setLoading] = useState(true); // 예약 목록 로딩 상태 추가
  const [error, setError] = useState(null);   // 예약 목록 에러 상태 추가
  const [selectedReservation, setSelectedReservation] = useState(null); // 선택된 예약서
  const [estimates, setEstimates] = useState([]); // 견적서 관련
  const [estimatesLoading, setEstimatesLoading] = useState(false);
  const [estimatesError, setEstimatesError] = useState(null);

  // 예약 목록
  useEffect(() => {
    const fetchReservations = async() => {
      try {
        setLoading(true);
        const data = await getOwnerReservations();
        console.log('API에서 받은 예약 목록 데이터:', data);
        setReservations(data);
      } catch (err) {
        setError(err);
        console.error("예약 목록 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleSelectStore = async (reservation) => {
    setSelectedReservation(reservation);
    setEstimates([]); 
    setEstimatesError(null);
    setEstimatesLoading(true);

    try {
      const data = await getEstimatesByReservationId(reservation.id);
      setEstimates(data);
    } catch (err) {
      setEstimatesError(err);
      console.error("견적 목록 불러오기 실패:", err);
    } finally {
      setEstimatesLoading(false); // 로딩 종료
    }
  };

  function chatroom() {
    navigate('/chatroom/:id');
  }

  return (
    <div className="estimates-page">
      <div className="estimates-tab-container">
        <h3 className="estimates-tab-title">견적 요청 목록</h3>
        
        <div className="estimates-request-scroll-container">
          {loading ? (
            <p>예약 목록을 불러오는 중...</p>
          ) : error ? (
            <p>예약 목록을 불러오는데 오류가 발생했습니다.</p>
          ) : reservations.length === 0 ? (
            <p>아직 견적 요청이 없습니다.</p>
          ) : (
            reservations.map((reservation) => (
              <div key={reservation.id} className="estimates-quote-request-card">
                <div className="estimates-req-header">{reservation.store?.name}</div>
                <div className="estimates-req-body">
                  <p>{reservation.store?.addr1} {reservation.store?.addr2} {reservation.store?.addr3}</p>
                  <p>{reservation.date}</p>
                  <p>{reservation.time}</p>
                  <p>상태: {reservation.status}</p> {/* 예약 상태 표시 */}
                </div>
                <button 
                  className={`estimates-confirm-quote-btn ${selectedReservation?.id === reservation.id ? 'active' : ''}`}
                  onClick={() => handleSelectStore(reservation)}
                >
                  {selectedReservation?.id === reservation.id ? '확인 중' : '받은 견적 확인'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. 매장이 선택되었을 때만 하단 영역 노출 */}
      {selectedReservation && (
        <div className="estimates-bottom-blue-section">
          <div className="estimates-tab-container">
            <div className="estimates-store-selection-banner">
              {selectedReservation.store?.name}
            </div>

            <div className="estimates-driver-quote-grid">
              {estimatesLoading ? (
                <p>기사님들의 견적을 불러오는 중...</p>
              ) : estimatesError ? (
                <p>견적을 불러오는 중 오류가 발생했습니다: {estimatesError.message}</p>
              ) : estimates.length === 0 ? (
                <p>아직 받은 견적이 없습니다.</p>
              ) : (
                estimates.map((estimate) => (
                  <div key={estimate.id} className="estimates-driver-selection-card">
                    <div className="estimates-driver-profile-row">
                      <div className="estimates-driver-image-box">
                        <img 
                          src={estimate.cleaner?.profile 
                            ? (APP_SERVER_URL + estimate.cleaner.profile) : '/icons/default-profile.png'}
                          alt={`${estimate.cleaner?.name} 기사님`} 
                          className="estimates-driver-img"
                        />
                      </div>
                      <div className="estimates-driver-brief">
                        <h4>{estimate.cleaner?.name} 기사님 
                            <FavoriteButton 
                            cleanerId={estimate.cleaner?.id}
                            initialIsFavorited={!!estimate.cleaner?.isFavorited}
                            />
                        </h4>
                        <p>리뷰 점수 {Number(estimate.cleaner?.avgReviewScore || 0).toFixed(1)}</p>
                        <p>작업 건수 {estimate.cleaner?.jobCount || 0}건</p>
                      </div>
                    </div>
                    
                    <div className="estimates-quote-price-section">
                      <div className="estimates-price-info">
                        <span className="estimates-label">견적금액</span>
                        <span className="estimates-price">{estimate.estimatedAmount.toLocaleString()}원</span>
                      </div>
                    </div>
  
                    <div className="estimates-card-action-row">
                      <button className="estimates-btn-light">견적서 보기</button>
                      <button className="estimates-btn-primary" onClick={chatroom}>채팅하기</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}