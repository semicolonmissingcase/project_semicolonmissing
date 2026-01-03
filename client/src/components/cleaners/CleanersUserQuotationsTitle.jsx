import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import cleanersThunk from "../../store/thunks/cleanersThunk.js";
import { FaMapMarkerAlt } from "react-icons/fa";
import { clearCleaners } from "../../store/slices/cleanersSlice.js";
import { CiUser } from "react-icons/ci";
import { MdHomeWork } from "react-icons/md";
import { LuCalendarClock } from "react-icons/lu";
import './CleanersUserQuotationsTitle.css';

function CleanersUserQuotationsTitle() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { submissions, loading, user } = useSelector((state) => state.cleaners);

  useEffect(() => {
    dispatch(cleanersThunk.titleThunk());
    return () => dispatch(clearCleaners());
  }, [dispatch]);

  if (loading) return <div className="loading">로딩 중...</div>;

// CleanersUserQuotationsTitle.jsx 내부

// 1. 더 안전하고 유연한 중복 제거 로직
const uniqueSubmissions = submissions ? Array.from(
  submissions.reduce((map, current) => {
    // 백엔드에서 reservation_id 또는 reservationId 중 어떤 이름으로 오는지 확인
    const rId = current.reservation_id || current.reservationId;

    if (rId) {
      if (!map.has(rId)) {
        map.set(rId, current);
      }
    }
    return map;
  }, new Map()).values()
  ) : [];

  // 2. 디버깅: 어떤 키로 데이터가 오는지 확인하기 위해 첫 번째 데이터 출력
  if (submissions && submissions.length > 0) {
    console.log("데이터 샘플 (키 이름 확인용):", submissions[0]);
  }
  console.log("중복 제거 후 개수:", uniqueSubmissions.length);

  // 2. 상태(Status)에 따른 CSS 클래스 매핑 함수
  const getStatusClass = (status) => {
    switch (status) {
      case "요청": return "pending"; // 대기중
      case "승인": return "selected"; // 지정됨
      case "거절": return "rejected"; // 거절됨
      default: return "pending";
    }
  };

const handleCardClick = (id) => {
  navigate(`/cleaners/quotations/${id}`);
};

 return (
    <div className="all-container cleaners-user-quotations-title-container">
      <span className="cleaners-user-quotations-title-text">
        안녕하세요, {user?.name || "기사"} 님! 요청 의뢰서입니다.
      </span>

      <div className="cleaners-user-quotations-title-small-container">
        {uniqueSubmissions.length > 0 ? (
          uniqueSubmissions.slice(0, 4).map((item) => {
            const res = item.reservation;
            const store = res?.store;
            const owner = res?.owner;
            const statusType = getStatusClass(res?.status); // 'selected', 'rejected', 'pending' 중 하나

            return (
              <div 
                key={item.reservation_id} 
                className={`cleaners-user-quotations-title-wrapper-${statusType}`}
                onClick={() => handleCardClick(res.id)}
                style={{ cursor: 'pointer' }}
              >
                {/* 상단 상태 (지정/거절/대기) */}
                <div className={`cleaners-user-quotations-title-status-${statusType}`}>
                  {res?.status || "대기"}
                </div>

                {/* 카드 내부 수직 레이아웃 */}
                <div className={`cleaners-user-quotations-title-vertical-line-${statusType}-layout`}>
                  
                  {/* 주소 정보 */}
                  <div className={`cleaners-user-quotations-title-location-${statusType}-location`}>
                    <FaMapMarkerAlt size={25} /> {store ? `${store.addr1} ${store.addr2}` : "주소 정보 없음"}
                  </div>

                  {/* 업체명 */}
                  <div className={`cleaners-user-quotations-title-place-${statusType}-place`}>
                    <MdHomeWork size={25} /> {store?.name || "상점명 없음"}
                  </div>

                  {/* 점주명 */}
                  <div className={`cleaners-user-quotations-title-user-${statusType}-user`}>
                    <CiUser size={25} /> {owner?.name || "점주명 없음"}
                  </div>

                  {/* 예약 일시 */}
                  <div className={`cleaners-user-quotations-title-date-${statusType}-date`}>
                    <LuCalendarClock size={25} /> {res?.date} {res?.time?.substring(0, 5)}
                  </div>
                </div>

                {/* 이미지 프레임 (점주 프로필) */}
                <div className="cleaners-user-quotations-title-img-frame">
                  {owner?.profile ? (
                    <img src={owner.profile} alt="프로필" className="cleaners-user-quotations-title-img-selected" />
                  ) : (
                    <span>점주님 프로필 사진</span>
                  )}
                </div>

                {/* 하단 특이사항 (CSS에 없어서 텍스트로 추가) */}
                <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
                  {item.answer_text || "특이사항 없음"}
                </div>
              </div>
            );
          })
        ) : (
          <p>의뢰서 내역이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
export default CleanersUserQuotationsTitle;