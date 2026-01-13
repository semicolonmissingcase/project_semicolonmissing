import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendingJobs, completeJob } from '../../../api/axiosCleaner.js'; 
import './ReservationCompletedList.css';
// TodayJobList와 동일한 아이콘 임포트
import { FaMapMarkerAlt, FaClock, FaUser, FaCheckCircle } from "react-icons/fa";

export default function ReservationCompletedList() {
  const [jobs, setJobs] = useState([]); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 오늘 날짜 가져오기 (TodayJobList 로직과 통일)
  const getTodayDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await getPendingJobs(); 
      if (response.data.success) {
        setJobs(response.data.data);
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCompleteJob = async (jobId) => {
    if (!window.confirm("작업을 완료하셨습니까?\n완료 시 정산 대기 상태로 변경됩니다.")) return;
    try {
      const response = await completeJob(jobId);
      if (response.data.success) {
        alert("작업 완료 처리가 되었습니다.");
        fetchJobs(); 
      }
    } catch (error) {
      console.error("완료 처리 실패:", error);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  const openKakaoMap = (storeName, address) => {
    if (!address) return;
    const searchQuery = `${storeName || ''} ${address}`;
    window.open(`https://map.kakao.com/link/search/${encodeURIComponent(searchQuery)}`, '_blank');
  };

  if (loading) return <div className="reservation-completedlist-container"><div className="tab-placeholder">로딩 중...</div></div>;

  const today = getTodayDate();

  return (
    <div className="reservation-completedlist-container">
      {jobs.length > 0 ? (
        <div className="reservation-completedlist-cards">
          {jobs.map((job) => {
            const canComplete = job.date <= today;

            return (
              <div key={job.id} className="reservation-completedlist-card big-card-shadow">
                
                {/* 상단: 매장명 및 상태 (TodayJobList 구조) */}
                <div className="reservation-completedlist-card-row header-row">
                  <div className="reservation-completedlist-store-info">
                    <FaMapMarkerAlt 
                      className="map-icon" 
                      onClick={() => openKakaoMap(job.store?.name, job.store?.addr1)} 
                    />
                    <span className="reservation-completedlist-store-name">
                      {job.store?.name || "매장명 없음"}
                    </span>
                  </div>
                  <span className={`reservation-completedlist-status status-APPROVED`}>
                    <FaCheckCircle /> 승인
                  </span>
                </div>

                <hr className="reservation-completedlist-divider" />

                {/* 중단: 상세 정보 섹션 (아이콘 추가) */}
                <div className="reservation-completedlist-info-section">
                  <div className="reservation-completedlist-info-item">
                    <span className="reservation-completedlist-label"><FaClock /> 일정</span>
                    <span className="reservation-completedlist-value highlight">
                      {job.date} {job.time ? job.time.slice(0, 5) : "시간 미정"}
                    </span>
                  </div>
                  <div className="reservation-completedlist-info-item">
                    <span className="reservation-completedlist-label"><FaMapMarkerAlt /> 위치</span>
                    <span className="reservation-completedlist-value">
                      {job.store?.addr1 || "주소 정보 없음"}
                    </span>
                  </div>
                  <div className="reservation-completedlist-info-item">
                    <span className="reservation-completedlist-label"><FaUser /> 예약자</span>
                    <span className="reservation-completedlist-value">
                      {job.owner?.name || "정보 없음"} 점주님
                    </span>
                  </div>
                </div>

                {/* 하단: 버튼 그룹 */}
                <div className="reservation-completedlist-btn-group">
                  <button 
                    className="reservation-completedlist-secondary-btn"
                    onClick={() => navigate(`/cleaners/mypage/job/${job.id}`)}
                  >
                    의뢰 상세보기
                  </button>
                  
                  {canComplete && (
                    <button 
                      className="reservation-completedlist-primary-btn"
                      onClick={() => handleCompleteJob(job.id)}
                    >
                      작업 완료
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="reservatoin-no-data">
          현재 대기 중인 작업이 없습니다.
        </div>
      )}
    </div>
  );
}