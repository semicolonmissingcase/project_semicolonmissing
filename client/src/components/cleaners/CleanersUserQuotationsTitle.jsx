import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'; 
import { IoMdAddCircleOutline } from "react-icons/io"; 
import cleanersThunk from "../../store/thunks/cleanersThunk.js";
import { FaMapMarkerAlt } from "react-icons/fa";
import { clearCleaners } from "../../store/slices/cleanersSlice.js";
import { CiUser } from "react-icons/ci";
import { MdHomeWork } from "react-icons/md";
import { LuCalendarClock } from "react-icons/lu";
import './CleanersUserQuotationsTitle.css';

// 일단 더 살펴보기.. 동의/승인 무슨 차이이고.. 취소/반려 무슨 차이인지.. ??
const ReservationStatus = {
  REQUEST: '요청',
  APPROVED: '승인',
  // ACCEPTED: '동의',
  IN_PROGRESS: '진행중',
  COMPLETED: '완료',
  CANCELED: '취소',
  REJECTED: '반려'
};

const filterOptions = [
  { value: 'ALL', label: '전체 보기' },
  { value: '요청', label: '요청' }, // DB 값에 맞춰 한글로 변경
  { value: 'SELECTED', label: '지정' },
  { value: '승인', label: '승인' },
  // { value: '동의', label: '동의' },
  { value: '진행중', label: '진행 중' },
  { value: '완료', label: '완료' },
  { value: '취소', label: '취소/반려' },
];

function CleanersUserQuotationsTitle() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { submissions, loading, user } = useSelector((state) => state.cleaners);
  
  const [filter, setFilter] = useState(filterOptions[0]); 
  const [visibleCount, setVisibleCount] = useState(4); 

  useEffect(() => {
    dispatch(cleanersThunk.titleThunk());
    return () => dispatch(clearCleaners());
  }, [dispatch]);

  const processedData = useMemo(() => {
    const dataArray = Array.isArray(submissions) ? submissions : (submissions?.submissions || []);
    if (dataArray.length === 0) return [];

    const now = new Date();
    const limitDate = new Date();
    limitDate.setDate(now.getDate() - 3);

    const uniqueMap = new Map();
    dataArray.forEach((item, index) => {
      const rId = item.reservationId || item.reservation?.id || `temp-${index}`;
      if (!uniqueMap.has(rId)) {
        const resDateStr = item.reservation?.date ? `${item.reservation.date} ${item.reservation.time || '00:00:00'}` : null;
        if (resDateStr) {
          const resDate = new Date(resDateStr);
          if (resDate >= limitDate) uniqueMap.set(rId, item);
        } else {
          uniqueMap.set(rId, item);
        }
      }
    });

    return Array.from(uniqueMap.values()).sort((a, b) => {
      return new Date(`${b.reservation?.date} ${b.reservation?.time}`) - 
             new Date(`${a.reservation?.date} ${a.reservation?.time}`);
    });
  }, [submissions]);

  // 🟢 데이터 구조에 맞게 수정한 상태 판별 로직
  const getStatusInfo = (item) => {
    const res = item.reservation;
    const currentStatus = res?.status; // 예: "요청"
    const likes = res?.owner?.likes;
    const isLiked = Array.isArray(likes) && likes.length > 0;

    // "지정": 찜이 있고 상태가 '요청' 혹은 '승인'일 때
    if (isLiked && (currentStatus === ReservationStatus.REQUEST || currentStatus === ReservationStatus.APPROVED)) {
      return { type: "selected", label: "지정" };
    }
    // "취소/반려"
    if (currentStatus === ReservationStatus.CANCELED || currentStatus === ReservationStatus.REJECTED) {
      return { type: "rejected", label: currentStatus };
    }
    // "요청" (찜 없음)
    if (currentStatus === ReservationStatus.REQUEST) {
      return { type: "pending", label: ReservationStatus.REQUEST };
    }
    // 기타 (진행중, 완료 등)
    return { type: "pending", label: currentStatus || "대기" };
  };

  const filteredSubmissions = useMemo(() => {
    if (filter.value === 'ALL') return processedData;
    return processedData.filter(item => {
      const info = getStatusInfo(item);
      const status = item.reservation?.status;
      if (filter.value === 'SELECTED') return info.type === 'selected';
      if (filter.value === '취소') return status === '취소' || status === '반려';
      return status === filter.value;
    });
  }, [processedData, filter]);

  if (loading) return <div className="loading">로딩 중...</div>;

  return (
    <div className="all-container cleaners-user-quotations-title-container"> 
      
        <span className="cleaners-user-quotations-title-text">
          안녕하세요, {user?.name || "기사"} 님! 요청 의뢰서입니다.
        </span>
        <div style={{ width: '140px' }}>
          <Select
            options={filterOptions} 
            value={filter}
            onChange={(sel) => { setFilter(sel); setVisibleCount(4); }}
            isSearchable={false}
          />
        </div>

      <div className="cleaners-user-quotations-title-small-container">
          {filteredSubmissions.length > 0 ? (
            <>
              {filteredSubmissions.slice(0, visibleCount).map((item) => {
                const { type, label } = getStatusInfo(item);
                const res = item.reservation;

                return (
                  <div 
                    key={res?.id || Math.random()} 
                    className={`cleaners-user-quotations-title-wrapper-${type}`}
                    onClick={() => navigate(`/cleaners/quotations/${res?.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={`cleaners-user-quotations-title-status-${type}`}>
                      {label}
                    </div>
                    <div className={`cleaners-user-quotations-title-vertical-line-${type}-layout`}>
                      <div className={`cleaners-user-quotations-title-${type}-location`}>
                        <FaMapMarkerAlt size={25} /> {res?.store?.addr1 || "정보 없음"}
                      </div>
                      <div className={`cleaners-user-quotations-title-${type}-place`}>
                        <MdHomeWork size={25} /> {res?.store?.name || "상점명 없음"}
                      </div>
                      <div className={`cleaners-user-quotations-title-${type}-user`}>
                        <CiUser size={25} /> {res?.owner?.name || "점주"}
                      </div>
                      <div className={`cleaners-user-quotations-title-${type}-date`}>
                        <LuCalendarClock size={25} /> {res?.date} {res?.time?.substring(0, 5)}
                      </div>
                      <div className="cleaners-user-quotations-title-img-frame">
                        {res?.owner?.profile ? (
                          <img src={res.owner.profile} alt="profile" className="cleaners-user-quotations-title-img" />
                        ) : (
                          <div className="cleaners-user-quotations-title-profile-placeholder" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })} 
              {visibleCount < filteredSubmissions.length && (
                <div className="cleaners-user-quotations-title-button-wrapper" onClick={() => setVisibleCount(c => c + 4)}>
                  <IoMdAddCircleOutline size={45} color="var(--color-blue)" />
                  <p style={{ marginTop: '5px', color: 'var(--color-blue)' }}>더 보기</p>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '100px 0', color: '#999', width: '100%' }}>
              표시할 요청 내역이 없습니다.
            </div>
          )}
      </div>
    </div>
  );
}

export default CleanersUserQuotationsTitle;