import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ReservationCompletedList.css';
import { FaMapMarkerAlt } from "react-icons/fa";
import { getPendingJobs } from '../../../api/axiosCleaner.js';

export default function ReservationCompletedList() {
  const [jobs, setJobs] = useState([]); // 작업 목록 저장
  const [loading, setLoading] = useState(true);

  // 1. 컴포넌트 마운트 시 데이터 불러오기
useEffect(() => {
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await getPendingJobs(); // 정의한 함수 사용
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

  // 카카오맵 열기 함수 (매장 이름과 주소를 함께 검색하면 더 정확합니다)
  function openKakaoMap(storeName, address) {
    const searchQuery = `${storeName} ${address}`;
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
                    onClick={() => openKakaoMap(job.store?.name, job.store?.addr1)}
                  />
                  <span className="completedjoblist-card-value">
                    {job.store?.name || '정보 없음'}
                  </span>
                </div>
              </div>

              {/* 시간 - 날짜와 시간을 함께 표시 */}
              <div className="reservation-completedlist-card-row">
                <span className="reservation-completedlist-card-label">일시</span>
                <span className="reservation-completedlist-card-value">
                  {job.reservationDate} {job.reservationTime}
                </span>
              </div>

              {/* 위치 */}
              <div className="reservation-completedlist-card-row">
                <span className="reservation-completedlist-card-label">위치</span>
                <span className="reservation-completedlist-card-value">
                  {job.store?.addr1 || '주소 정보 없음'}
                </span>
              </div>

              {/* 점주 이름 */}
              <div className="reservation-completedlist-card-row">
                <span className="reservation-completedlist-card-label">점주</span>
                <span className="reservation-completedlist-card-value">
                  {job.owner?.name || '익명'}
                </span>
              </div>
              
              {/* 작업 시작/상세 버튼 (필요 시 추가) */}
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