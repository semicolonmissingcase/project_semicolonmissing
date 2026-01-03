import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import cleanersThunk from "../../store/thunks/cleanersThunk.js"; // titleThunk가 이 안에 있다고 가정
import { clearCleaners } from "../../store/slices/cleanersSlice.js";
import './CleanersUserQuotationsTitle.css';

function CleanersUserQuotationsTitle() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 리덕스 스토어에서 데이터 가져오기
  const { quotationList, user } = useSelector((state) => state.cleaners);

  useEffect(() => {
    // 1. Thunk 호출 (파일명이 cleanersThunk라면 그 안의 titleThunk를 호출)
    dispatch(cleanersThunk.titleThunk());
    
    // 2. 언마운트 시 클린업
    return () => dispatch(clearCleaners());
  }, [dispatch]);

  // 상태값에 따른 스타일 및 텍스트 매핑 (DB의 한글 데이터 기준)
  const getStatusInfo = (status) => {
    switch (status) {
      case "동의":
      case "승인":
      case "진행중":
      case "완료":
        return { label: "지정", className: "selected" };
      case "취소":
        return { label: "반려", className: "rejected" };
      case "요청":
      default:
        return { label: "대기", className: "pending" };
    }
  };

  return (
    <div className="all-container cleaners-user-quotations-title-container">
      <span className="cleaners-user-quotations-title-text">
        안녕하세요, {user?.name || "기사"} 님! 요청 의뢰서입니다.
      </span>

      <div className="cleaners-user-quotations-title-small-container">
        {/* quotationList가 있을 때만 맵 돌리기 */}
        {quotationList && quotationList.map((item) => {
          const statusInfo = getStatusInfo(item.status);

          return (
            <div
              key={item.id}
              className={`cleaners-user-quotations-title-wrapper-${statusInfo.className}`}
              onClick={() => navigate(`/cleaners/quotations/${item.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <span className={`cleaners-user-quotations-title-status-${statusInfo.className}`}>
                {statusInfo.label}
              </span>

              <div className={`cleaners-user-quotations-title-vertical-line-${statusInfo.className}-layout`}>
                <span className={`cleaners-user-quotations-title-location-${statusInfo.className}-location`}>
                  {item.store?.addr1 || "주소 정보 없음"}
                </span>
                <span className={`cleaners-user-quotations-title-place-${statusInfo.className}-place`}>
                  {item.store?.name || `매장 ID: ${item.store_id}`}
                </span>
                <span className={`cleaners-user-quotations-title-user-${statusInfo.className}-user`}>
                  {item.owner?.name || `고객 ID: ${item.owner_id}`}
                </span>
                <span className={`cleaners-user-quotations-title-date-${statusInfo.className}-date`}>
                  {item.date}
                  <br /> {item.time}
                </span>
              </div>
            </div>
          );
        })}

        {/* 데이터가 비어있을 경우 */}
        {(!quotationList || quotationList.length === 0) && (
          <p style={{ textAlign: "center", padding: "20px" }}>의뢰서 내역이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default CleanersUserQuotationsTitle;