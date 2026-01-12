import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTodayJobs, completeJob } from "../../../api/axiosCleaner.js"; 
import "./TodayJobList.css";
import { FaMapMarkerAlt, FaClock, FaUser, FaCheckCircle, FaChevronRight } from "react-icons/fa";

export default function TodayJobList() {
  const [todayJobs, setTodayJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getTodayDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  const fetchTodayJobs = async () => {
    try {
      setLoading(true);
      const response = await getTodayJobs();
      if (response.data.success) {
        setTodayJobs(response.data.data);
      }
    } catch (error) {
      console.error("오늘 일정 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayJobs();
  }, []);

  // 작업 완료 처리 함수
  const handleCompleteJob = async (jobId) => {
    console.log("1. 버튼 클릭됨, ID:", jobId);
    if (!window.confirm("작업을 완료하셨습니까?\n완료 시 정산 대기 상태로 변경됩니다.")) return;
    
    try {
      const response = await completeJob(jobId);
      if (response.data.success) {
        alert("작업 완료 처리가 되었습니다.");
        fetchTodayJobs();
      }
    } catch (error) {
      console.error("완료 처리 실패:", error);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  const openKakaoMap = (location) => {
    if (!location) return;
    window.open(`https://map.kakao.com/link/search/${encodeURIComponent(location)}`, '_blank');
  };

  if (loading) return <div className="todayJobList-container"><div className="tab-placeholder">일정을 불러오는 중...</div></div>;

  if (todayJobs.length === 0) {
    return (
      <div className="todayJobList-container">
        <h4 className="todayJobList-date">{getTodayDate()}</h4>
        <div className="todayJobList-empty"><p>오늘은 예정된 작업이 없습니다.</p></div>
      </div>
    );
  }

  return (
    <div className="todayJobList-container">
      <h4 className="todayJobList-date">{getTodayDate()}</h4>

      <div className="todayJobList-cards">
        {todayJobs.map((job) => (
          <div key={job.id} className="todayJobList-card big-card-shadow">
            
            {/* 상단: 매장명 및 상태 */}
            <div className="todayJobList-card-row header-row">
              <div className="todayJobList-store-info">
                <FaMapMarkerAlt className="map-icon" onClick={() => openKakaoMap(`${job.store?.name} ${job.store?.addr1}`)} />
                <span className="todayJobList-store-name">{job.store?.name || "매장명 없음"}</span>
              </div>
              <span className={`todayJobList-status status-${job.status}`}>
                <FaCheckCircle /> {job.status === 'APPROVED' ? '예약확정' : job.status}
              </span>
            </div>

            <hr className="todayJobList-divider" />

            {/* 중단: 상세 정보 섹션 */}
            <div className="todayJobList-info-section">
              <div className="todayJobList-info-item">
                <span className="todayJobList-label"><FaClock /> 방문 시간</span>
                <span className="todayJobList-value highlight">{job.time ? job.time.slice(0, 5) : "시간 미정"}</span>
              </div>
              <div className="todayJobList-info-item">
                <span className="todayJobList-label"><FaMapMarkerAlt /> 상세 위치</span>
                <span className="todayJobList-value">{job.store?.addr1 || "주소 정보 없음"}</span>
              </div>
              <div className="todayJobList-info-item">
                <span className="todayJobList-label"><FaUser /> 담당 점주</span>
                <span className="todayJobList-value">{job.owner?.name || "정보 없음"} 점주님</span>
              </div>
            </div>

            {/* 하단: 버튼 그룹 (상세보기 | 작업완료) */}
            <div className="todayJobList-btn-group">
              <button 
                className="todayJobList-secondary-btn"
                onClick={() => navigate(`/cleaners/mypage/job/${job.id}`)}
              >
                의뢰 상세보기
              </button>
              <button 
                className="todayJobList-primary-btn"
                onClick={() => handleCompleteJob(job.id)}
              >
                작업 완료
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}