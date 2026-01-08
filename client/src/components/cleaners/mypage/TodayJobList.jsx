import React, { useEffect, useState } from 'react';
import { getTodayJobs } from "../../../api/axiosCleaner.js";
import "./TodayJobList.css";
import { FaMapMarkerAlt, FaClock, FaUser, FaCheckCircle } from "react-icons/fa";

export default function TodayJobList() {
  const [todayJobs, setTodayJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayDate = getTodayDate();

  useEffect(() => {
    const fetchTodayJobs = async () => {
      try {
        setLoading(true);
        // 백엔드 API 호출
        const response = await getTodayJobs();
        if (response.data.success) {
          // 서버에서 이미 오늘 날짜 데이터를 필터링해서 주지만, 
          // 혹시 모르니 클라이언트에서도 한 번 더 필터링하거나 그대로 사용합니다.
          setTodayJobs(response.data.data);
        }
      } catch (error) {
        console.error("오늘 일정 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTodayJobs();
  }, []);

  // 카카오맵 열기 함수
  const openKakaoMap = (location) => {
    if (!location) return;
    const webMapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(location)}`;
    window.open(webMapUrl, '_blank');
  };

  // 로딩 중일 때 표시
  if (loading) {
    return (
      <div className="todayJobList-container">
        <div className="tab-placeholder">일정을 불러오는 중입니다...</div>
      </div>
    );
  }

  // 오늘 작업이 없을 경우 표시
  if (todayJobs.length === 0) {
    return (
      <div className="todayJobList-container">
        <h4 className="todayJobList-date">{todayDate}</h4>
        <div className="todayJobList-empty">
          <p>오늘은 예정된 작업이 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="todayJobList-container">
      {/* 오늘 날짜 표시 */}
      <h4 className="todayJobList-date">{todayDate}</h4>

      {/* 작업 목록 카드 렌더링 */}
      <div className="todayJobList-cards">
        {todayJobs.map((job) => (
          <div key={job.id} className="todayJobList-card card-shadow">
            
            {/* 매장명 및 상태 */}
            <div className="todayJobList-card-row">
              <div className="completedjoblist-card-place">
                <FaMapMarkerAlt 
                  style={{ fontSize: '1.1rem', color: '#3B82F6', cursor: "pointer" }}
                  onClick={() => openKakaoMap(`${job.store?.name} ${job.store?.addr1}`)}
                />
                <span className="completedjoblist-card-value" style={{ fontWeight: 'bold' }}>
                  {job.store?.name || "매장명 없음"}
                </span>
              </div>
              <span className={`todayJobList-status status-${job.status}`}>
                <FaCheckCircle style={{ marginRight: '4px' }} />
                {job.status}
              </span>
            </div>

            <hr className="card-divider" />

            {/* 시간 정보 */}
            <div className="todayJobList-card-row">
              <span className="todayJobList-card-label">
                <FaClock className="icon-margin" /> 시작 시간
              </span>
              <span className="todayJobList-card-value">
                {job.time ? job.time.slice(0, 5) : "시간 미정"}
              </span>
            </div>

            {/* 위치 정보 */}
            <div className="todayJobList-card-row">
              <span className="todayJobList-card-label">
                <FaMapMarkerAlt className="icon-margin" /> 상세 위치
              </span>
              <span className="todayJobList-card-value">
                {job.store?.addr1 || "주소 정보 없음"}
              </span>
            </div>

            {/* 점주 정보 */}
            <div className="todayJobList-card-row">
              <span className="todayJobList-card-label">
                <FaUser className="icon-margin" /> 담당 점주
              </span>
              <span className="todayJobList-card-value">
                {job.owner?.name || "정보 없음"} 점주님
              </span>
            </div>

            {/* 상세 보기 버튼 (사이드바 로직과 연결될 부분) */}
            <button 
              className="todayJobList-detail-btn"
              onClick={() => alert(`${job.id}번 의뢰 상세보기를 엽니다.`)}
            >
              의뢰 상세보기
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}