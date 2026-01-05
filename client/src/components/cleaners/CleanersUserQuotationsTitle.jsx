import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'; 
import { IoMdAddCircleOutline } from "react-icons/io"; 
import { titleThunk } from "../../store/thunks/cleanersThunk.js";
import { FaMapMarkerAlt } from "react-icons/fa";
import { getMe } from "../../store/thunks/cleanersThunk.js";
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
  // 1. 상태들을 먼저 다 가져옵니다.
  const { isInitialized, isLoggedIn } = useSelector((s) => s.auth);
  const { 
    cleaner, 
    submissions, 
    loading, // 👈 여기서 loading이 정의됩니다.
    isLoggedIn: cleanersLoggedIn 
  } = useSelector((state) => state.cleaners);

  // 2. 변수 정의가 끝난 "후에" 콘솔로그나 로직을 작성해야 합니다.
  console.log("체크1 - 로딩중인가?:", loading);
  console.log("체크2 - cleaner 데이터:", cleaner);

  const [filter, setFilter] = useState(filterOptions[0]); 
  const [visibleCount, setVisibleCount] = useState(4);

 useEffect(() => {
  // 초기화 전이면 대기
  if (!isInitialized) return;

  // 로그인이 안 되어 있으면 중단
  if (!isLoggedIn) {
    console.log("로그인이 필요합니다.");
    return;
  }

  // 핵심 로직: 로그인은 됐는데 cleaner 정보가 없으면 직접 getMe 호출
  if (!cleaner) {
    console.log("기사 정보가 비어있어 getMe를 직접 요청합니다.");
    dispatch(getMe());
    return; // 데이터를 받아올 때까지 이번 턴은 종료
  }

  // 이제 cleaner가 확실히 있을 때만 리스트 요청
  if (cleaner.id) {
    console.log("데이터 확인 완료! 리스트를 불러옵니다. ID:", cleaner.id);
    dispatch(titleThunk(cleaner.id));
  }
  }, [isInitialized, isLoggedIn, cleaner, dispatch]); 

  const auth = useSelector((s) => s.auth);
  console.log("--- 디버깅 로그 ---");
  console.log("1. Auth 로그인 여부:", auth.isLoggedIn);
  console.log("2. Cleaner 데이터 존재 여부:", cleaner ? "있음" : "없음(null)");
  console.log("3. 로딩 상태:", loading);

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

  //  데이터 구조에 맞게 수정한 상태 판별 로직
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
      
      <div>
      {/* auth의 isLoggedIn과 cleaner 데이터가 모두 있을 때만 이름을 띄웁니다 */}
      {isLoggedIn && cleaner ? (
        <p>{cleaner.name} 님! 요청 의뢰서입니다</p>
      ) : (
        <p>로그인 정보를 확인 중입니다...</p>
      )}
    </div>
    
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