import React, { useEffect, useState } from 'react';
import './ReservationCompletedList.css';
import { FaMapMarkerAlt } from "react-icons/fa";
import { getPendingJobs } from '../../../api/axiosCleaner.js';

export default function ReservationCompletedList() {
  const [jobs, setJobs] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchJobs();
  }, []);

  // 카카오맵 열기 함수
  function openKakaoMap(storeName, address) {
    if (!address) {
      alert("주소 정보가 없습니다.");
      return;
    }
    const searchQuery = `${storeName || ''} ${address}`;
    const kakaoMapUrl = `kakaomap://search?q=${encodeURIComponent(searchQuery)}`;
    const webMapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(searchQuery)}`;
    
    window.location.href = kakaoMapUrl;
    
    setTimeout(() => {
      window.open(webMapUrl, '_blank');
    }, 2000);
  }

  if (loading) return <div className="tab-placeholder">로딩 중...</div>;

  return (
    <div className="reservation-completedlist-container">
      <div className="reservation-completedlist-cards">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job.id} className="reservation-completedlist-card card-shadow">
              {/* 매장명 */}
              <div className="reservation-completedlist-card-row">
                <span className="reservation-completedlist-card-label">매장명</span>
                <div className="completedjoblist-card-place">
                  <FaMapMarkerAlt 
                    style={{ fontSize: '1rem', color: '#7C7F88', cursor: "pointer" }}
                    onClick={() => openKakaoMap(job.store?.name, job.store?.address)} 
                  />
                  <span className="completedjoblist-card-value">
                    {job.store?.name || '정보 없음'}
                  </span>
                </div>
              </div>

              <div className="reservation-completedlist-card-row">
                <span className="reservation-completedlist-card-label">일시</span>
                <span className="reservation-completedlist-card-value">
                  {job.date} {job.time?.slice(0, 5)}
                </span>
              </div>

              <div className="reservation-completedlist-card-row">
                <span className="reservation-completedlist-card-label">금액</span>
                <span className="reservation-completedlist-card-value" style={{ color: '#007bff', fontWeight: 'bold' }}>
                  {job.estimate?.estimated_amount ? `${job.estimate.estimated_amount.toLocaleString()}원` : '견적 확인 중'}
                </span>
              </div>

              <div className="reservation-completedlist-card-row">
                <span className="reservation-completedlist-card-label">점주</span>
                <span className="reservation-completedlist-card-value">
                  {job.owner?.name || '익명'}
                </span>
              </div>
              
              <button className="job-detail-btn">상세 보기</button>
            </div>
          ))
        ) : (
          <div className="no-data">현재 대기 중인 작업이 없습니다.</div>
        )}
      </div>
    </div>
  );
}