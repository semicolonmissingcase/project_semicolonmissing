import React from 'react';
import { useDispatch } from 'react-redux';
import './Reservations.css';
import { getAcceptedEstimatesByOwnerId } from '../../../api/axiosOwner.js';
import FavoriteButton from '../../commons/FavoriteBtn.jsx';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createChatRoom } from '../../../api/axiosChat.js';
import { useCallback } from 'react';
import { cancelEstimateThunk } from '../../../store/thunks/estimateThunk.js';
import EstimatesShow from '../users/EstimatesShow.jsx';

// 예약완료
export default function Reservations() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [estimates, setEstimates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // --- 모달 관련 상태 추가 ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  
  // 취소관련
  const fetchEstimates = useCallback(async() => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAcceptedEstimatesByOwnerId();
      setEstimates(data);
    } catch(err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEstimates();
  }, [fetchEstimates]);

  const handleCancel = async (estimateId) => {
    // 사용자에게 재확인
    if(window.confirm("정말로 예약을 취소하시겠습니까?")) {
      try {
        const resultAction = await dispatch(cancelEstimateThunk(estimateId));

        // 성공 완료 확인
        if(cancelEstimateThunk.fulfilled.match(resultAction)) {
          alert("예약이 취소되었습니다.");
          fetchEstimates(); // 예약목록 새로고침
        } else {
          //실패시 에러 메세지
          const errorMessage = resultAction.payload?.message || "예약 취소에 실패했습니다."
          alert(errorMessage);        
        }
      } catch (error) {
        alert("예약 취소 중 오류가 발생했습니다.");
      } 
    }
  };

  // 모달 열기 핸들러
  const handleOpenModal = (item) => {
    // 모달에서 필요한 데이터 형식으로 매핑
    const dataForModal = {
      cleanerId: item.cleanerId,
      cleanerName: item.name,           // item.name 사용
      cleanerProfile: item.cleanerProfile,
      avgReviewScore: Number(item.avgReviewScore || 0).toFixed(1),
      comment: item.comment,           // API에서 넘어오는 기사님 한마디
      price: item.price,               // item.price 사용
      description: item.description,   // API에서 넘어오는 상세 설명
    };
    setModalData(dataForModal);
    setIsModalOpen(true);
  };

  // 채팅방 생성 및 연결
  const handleChatRoom = async (estimateId, cleanerId) => {
    if(!cleanerId) {
      alert("기사님 정보가 유효하지 않아 채팅을 시작할 수 없습니다.");
      return 
    }

    try {
      const response = await createChatRoom({
        estimate_id: estimateId,
        cleaner_id: cleanerId,
      });

      const chatRoomId = response.data.data.id;

      if(chatRoomId) {
        navigate(`/chatroom/${chatRoomId}`);
      } else {
        alert("채팅방을 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("채팅방 생성/조회 실패:", error);
      alert("채팅방 연결에 실패했습니다.");
    }
  };

  if (loading) {
    return <div className="reservations-tab-container"><p>예약 목록을 불러오는 중...</p></div>;
  }
  if (error) {
    return <div className="reservations-tab-container"><p>예약 목록을 불러오는데 오류가 발생했습니다: {error.message}</p></div>;
  }
  if (!estimates || estimates.length === 0) {
    return (
      <div className="reservations-tab-container">
        <p className="reservations-no-items">아직 예약된 내역이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="reservations-tab-container">
      <p className="reservations-top-notice">지난 1년간의 예약 내역입니다.</p>
      
      <div className="reservations-list">
        {estimates.map((item) => (
          <div key={item.id} className="reservations-card">
            <div className="reservations-card-left">
              {/* 기사님 프로필 이미지 */}
              <div className="reservations-avatar-circle">
                <img 
                  src={item.cleanerProfile ? item.cleanerProfile : "/icons/default-profile.png"} 
                  alt={`${item.name} 기사님`} 
                  className="reservations-avatar-img" 
                />
              </div>
              
              <div className="reservations-info-content">
                <h4 className="reservations-driver-name">
                  {item.name}
                  <FavoriteButton cleanerId={item.cleanerId} initialIsFavorited={item.heart} />
                </h4>
                <p className="reservations-detail-text">{item.time}</p>
                <p className="reservations-detail-text">{item.store}</p>
                <p className="reservations-price-text">견적 금액 {item.price}원</p>
                <p className="reservations-detail-text">상태: {item.status}</p>
              </div>
            </div>

            <div className="reservations-card-right">
              <button className="reservations-btn-secondary"
                onClick={() => handleChatRoom(item.id, item.cleanerId)}
              >채팅하기</button>
              
              {item.status === '승인' ? (
                <>
                  <button className="reservations-btn-danger"
                    onClick={() => handleCancel(item.id)}>
                    예약취소
                  </button>
                </>
              ) : item.status === '완료' ? (
                <button className="bg-blue" onClick={() => handleOpenModal(item)}>견적서 보기</button>
              ) : null}
            </div>
          </div>
        ))}
      </div>  

        {/* 견적서 모달 */}
        <EstimatesShow 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          data={modalData}
          showReserveButton={false}
        />
    </div>
  );
}