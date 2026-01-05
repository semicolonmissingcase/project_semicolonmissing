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

// 상수로 상태 관리 (제공해주신 객체 기준)
const ReservationStatus = {
  REQUEST: '요청',
  APPROVED: '승인',
  IN_PROGRESS: '진행중',
  COMPLETED: '완료',
  ACCEPTED: '동의',
  CANCELED: '취소',
};

function CleanersUserQuotationsTitle() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { submissions, loading, user } = useSelector((state) => state.cleaners);

  useEffect(() => {
    dispatch(cleanersThunk.titleThunk());
    return () => dispatch(clearCleaners());
  }, [dispatch]);

  if (loading) return <div className="loading">로딩 중...</div>;

  // 1. 중복 제거 (예약 ID 기준)
  const uniqueSubmissions = submissions ? Array.from(
    submissions.reduce((map, current) => {
      const rId = current.reservation_id || current.reservationId;
      if (rId && !map.has(rId)) {
        map.set(rId, current);
      }
      return map;
    }, new Map()).values()
  ) : [];

  /**
   * 2. 상태 판별 로직 (ReservationStatus 기준)
   * - 지정 (selected): 점주가 찜(likes)함 + 요청 상태
   * - 요청 (pending): 점주가 찜 안 함 + 요청 상태
   * - 취소 (rejected): 취소 상태
   */
  const getStatusInfo = (item) => {
    const res = item.reservation;
    const currentStatus = res?.status;
    const isLiked = res?.owner?.likes && res.owner.likes.length > 0;

    // "지정" 케이스: 찜이 있고 현재 상태가 '요청' 또는 '승인'일 때
    if (isLiked && (currentStatus === ReservationStatus.REQUEST || currentStatus === ReservationStatus.APPROVED)) {
      return { type: "selected", label: "지정" };
    }

    // "취소" 케이스
    if (currentStatus === ReservationStatus.CANCELED) {
      return { type: "rejected", label: ReservationStatus.CANCELED };
    }

    // "요청" 케이스: 찜이 없고 상태가 '요청'일 때
    if (currentStatus === ReservationStatus.REQUEST) {
      return { type: "pending", label: ReservationStatus.REQUEST };
    }

    // 그 외 상태 (완료, 진행중 등)
    return { type: "pending", label: currentStatus || "대기" };
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
            const { type, label } = getStatusInfo(item);

            return (
              <div 
                key={item.reservation_id} 
                className={`cleaners-user-quotations-title-wrapper-${type}`}
                onClick={() => handleCardClick(res?.id)}
                style={{ cursor: 'pointer' }}
              >
                {/* 상단 상태 라벨 */}
                <div className={`cleaners-user-quotations-title-status-${type}`}>
                  {label}
                </div>

                {/* 메인 정보 섹션 */}
                <div className={`cleaners-user-quotations-title-vertical-line-${type}-layout`}>
                  <div className={`cleaners-user-quotations-title-${type}-location`}>
                    <FaMapMarkerAlt size={25} /> {store ? `${store.addr1} ${store.addr2}` : "주소 정보 없음"}
                  </div>

                  <div className={`cleaners-user-quotations-title-${type}-place`}>
                    <MdHomeWork size={25} /> {store?.name || "상점명 없음"}
                  </div>

                  <div className={`cleaners-user-quotations-title-${type}-user`}>
                    <CiUser size={25} /> {owner?.name || "점주명 없음"}
                  </div>

                  <div className={`cleaners-user-quotations-title-${type}-date`}>
                    <LuCalendarClock size={25} /> {res?.date} {res?.time?.substring(0, 5)}
                  </div>

                  {/* 프로필 이미지 섹션 */}
                <div className="cleaners-user-quotations-title-img-frame">
                  {owner?.profile ? (
                    <img src={owner.profile} alt="프로필" className="cleaners-user-quotations-title-img" />
                  ) : (
                    <div className="cleaners-user-quotations-title-profile-placeholder" />
                  )}
                </div>

                  {/* 추가 요청 아이디가 없어서 일단 추가 요청 칸 비워놓음.. 미리 타이틀 페이지에서 보일 필요가 있을까요? */}
                  {/* 견적서 상태가 취소일 때는 정보 획득 실패라고 뜨는데 일단 먼저 찾아보고.. 내 코드붙.z */}

                </div>

                

              </div>
            );
          })
        ) : (
          <p className="no-data-msg">받은 견적 요청이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default CleanersUserQuotationsTitle;